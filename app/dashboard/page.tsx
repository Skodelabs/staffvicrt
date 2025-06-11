"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, FileText, Clipboard, Loader2 } from 'lucide-react';
import { authService } from '@/services/auth/auth-service';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Check if user is authenticated, redirect to login if not
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/auth/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-xl">Loading...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Welcome to Your Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Student Registration Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          <div className="p-6">
            <div className="bg-blue-100 p-3 inline-block rounded-full mb-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Student Registration</h3>
            <p className="text-gray-600 mb-4">Manage student registrations and view registered students.</p>
            <Link href="/student/register" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800">
              Go to Registration <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
        
        {/* Document Upload Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="p-1 bg-gradient-to-r from-green-500 to-emerald-600"></div>
          <div className="p-6">
            <div className="bg-green-100 p-3 inline-block rounded-full mb-4">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Document Management</h3>
            <p className="text-gray-600 mb-4">Upload, view and manage student documents and certificates.</p>
            <Link href="/student/certificate" className="inline-flex items-center text-green-600 font-medium hover:text-green-800">
              Manage Documents <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
        
        {/* Applications Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="p-1 bg-gradient-to-r from-purple-500 to-pink-600"></div>
          <div className="p-6">
            <div className="bg-purple-100 p-3 inline-block rounded-full mb-4">
              <Clipboard className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Applications</h3>
            <p className="text-gray-600 mb-4">Review and process student applications and admission requests.</p>
            <Link href="/student/applications" className="inline-flex items-center text-purple-600 font-medium hover:text-purple-800">
              View Applications <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Recent Activity Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-4">
            <p className="text-gray-500 text-center py-8">No recent activities to display.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
