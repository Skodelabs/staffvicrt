"use client";

import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { formatDate } from '@/utils/format';

type Student = {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  selectedCourse: string;
  preferredStudyCenter: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
};

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/students');
        const result = await response.json();
        
        if (result.success) {
          setStudents(result.data);
        } else {
          setError('Failed to load students');
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('An error occurred while fetching students');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, []);

  if (loading) {
    return <div className="flex justify-center p-8">Loading students...</div>;
  }

  if (error) {
    return <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">{error}</div>;
  }

  if (students.length === 0) {
    return <div className="text-center p-8 text-gray-500">No registered students found.</div>;
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Study Center</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student._id}>
              <TableCell className="font-medium">{student.fullName}</TableCell>
              <TableCell>{student.selectedCourse}</TableCell>
              <TableCell>{student.preferredStudyCenter}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  student.status === 'Approved' ? 'bg-green-100 text-green-800' :
                  student.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {student.status}
                </span>
              </TableCell>
              <TableCell>{formatDate(student.appliedDate)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
