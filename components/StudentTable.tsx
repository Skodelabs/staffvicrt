"use client";

import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Loader2, Edit, Trash2, EyeOff, Eye } from "lucide-react";

// Helper function to format date
function formatDate(date: string | Date): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

interface Student {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  nic: string;
  selectedCourse: string;
  preferredStudyCenter: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  disabled: boolean;
  appliedDate: string;
}

interface StudentTableProps {
  students: Student[];
  loading: boolean;
  onRefresh: () => void;
}

export default function StudentTable({ students, loading, onRefresh }: StudentTableProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    status: ""
  });

  // Handle edit student
  const handleEditClick = (student: Student) => {
    setSelectedStudent(student);
    setEditFormData({
      fullName: student.fullName,
      email: student.email,
      phoneNumber: student.phoneNumber,
      status: student.status
    });
    setIsEditDialogOpen(true);
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!selectedStudent) return;
    
    try {
      const response = await fetch(`/api/students/${selectedStudent._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsEditDialogOpen(false);
        onRefresh(); // Refresh the student list
      } else {
        console.error("Failed to update student:", data.message);
        alert("Failed to update student: " + data.message);
      }
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Error updating student");
    }
  };

  // Handle delete student
  const handleDeleteClick = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!selectedStudent) return;
    
    try {
      const response = await fetch(`/api/students/${selectedStudent._id}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsDeleteDialogOpen(false);
        onRefresh(); // Refresh the student list
      } else {
        console.error("Failed to delete student:", data.message);
        alert("Failed to delete student: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Error deleting student");
    }
  };

  // Handle toggle disabled status
  const handleToggleDisabled = async (student: Student) => {
    try {
      const response = await fetch(`/api/students/${student._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ disabled: !student.disabled }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        onRefresh(); // Refresh the student list
      } else {
        console.error("Failed to update student status:", data.message);
        alert("Failed to update student status: " + data.message);
      }
    } catch (error) {
      console.error("Error updating student status:", error);
      alert("Error updating student status");
    }
  };

  return (
    <>
      <div className="border rounded-md">
        <Table>
          <TableCaption>
            {loading ? "Loading students..." : `Total ${students.length} students`}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Study Center</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                </TableCell>
              </TableRow>
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No students found
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow 
                  key={student._id}
                  className={student.disabled ? "opacity-60 bg-muted/50" : ""}
                >
                  <TableCell className="font-medium">
                    <div>
                      {student.fullName}
                      {student.disabled && (
                        <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                          Disabled
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{student.email}</div>
                  </TableCell>
                  <TableCell>{student.selectedCourse}</TableCell>
                  <TableCell>{student.preferredStudyCenter}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      student.status === 'Approved' 
                        ? 'bg-green-100 text-green-800' 
                        : student.status === 'Rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {student.status}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(student.appliedDate)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditClick(student)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleToggleDisabled(student)}
                      >
                        {student.disabled ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteClick(student)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>
              Update student information. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="fullName" className="text-right">
                Full Name
              </label>
              <Input
                id="fullName"
                value={editFormData.fullName}
                onChange={(e) => setEditFormData({...editFormData, fullName: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right">
                Email
              </label>
              <Input
                id="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="phoneNumber" className="text-right">
                Phone
              </label>
              <Input
                id="phoneNumber"
                value={editFormData.phoneNumber}
                onChange={(e) => setEditFormData({...editFormData, phoneNumber: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="status" className="text-right">
                Status
              </label>
              <Select
                value={editFormData.status}
                onValueChange={(value) => setEditFormData({...editFormData, status: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedStudent?.fullName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
