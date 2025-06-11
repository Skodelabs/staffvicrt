"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import StudentTable from '@/components/StudentTable';
import RegistrationForm from '@/components/student/RegistrationForm';



export default function StudentRegistrationPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Fetch students data
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/students');
      const result = await response.json();
      
      if (result.success) {
        setStudents(result.data);
      } else {
        console.error('Failed to load students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);
  
  const handleRegistrationSuccess = () => {
    setIsDialogOpen(false);
    // Refresh the student list instead of reloading the page
    fetchStudents();
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Student Registration</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Register New Student</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Student Registration Form</DialogTitle>
            </DialogHeader>
            <RegistrationForm 
              onSuccess={handleRegistrationSuccess} 
              onCancel={() => setIsDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Registered Students</h2>
        <StudentTable 
          students={students} 
          loading={loading} 
          onRefresh={fetchStudents} 
        />
      </div>
    </div>
  );
}
