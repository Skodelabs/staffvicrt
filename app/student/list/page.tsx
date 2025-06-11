"use client";

import { useState, useEffect } from "react";
import StudentTable from "@/components/StudentTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, RefreshCw } from "lucide-react";

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

export default function StudentListPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDisabled, setShowDisabled] = useState(false);

  // Fetch students
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      if (searchTerm) {
        queryParams.append("search", searchTerm);
      }
      
      if (statusFilter !== "all") {
        queryParams.append("status", statusFilter);
      }
      
      if (showDisabled) {
        queryParams.append("showDisabled", "true");
      }
      
      const response = await fetch(`/api/students?${queryParams.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setStudents(data.data);
      } else {
        console.error("Failed to fetch students:", data.message);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle search
  const handleSearch = () => {
    fetchStudents();
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Student Management</h1>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, NIC, course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setTimeout(fetchStudents, 100);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          variant={showDisabled ? "default" : "outline"}
          onClick={() => {
            setShowDisabled(!showDisabled);
            setTimeout(fetchStudents, 100);
          }}
        >
          {showDisabled ? "Show All" : "Show Disabled"}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={fetchStudents}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      {/* Student Table */}
      <StudentTable 
        students={students}
        loading={loading}
        onRefresh={fetchStudents}
      />
    </div>
  );
}
