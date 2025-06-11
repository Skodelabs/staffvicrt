"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, FileText, GraduationCap, Users, Clipboard } from 'lucide-react';
import { authService } from '@/services/auth/auth-service';

export default function Home() {
  const router = useRouter();
  
  // Check if user is logged in and redirect to dashboard
  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Your Future Starts <span className="text-yellow-300">Here</span>
              </h1>
              <p className="text-xl md:text-2xl opacity-90">
                Register for courses, manage applications, and track your academic journey all in one place.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <Link href="/student/register">
                  <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/student/courses">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Explore Courses
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-xl">
                <div className="relative h-64 md:h-80 w-full rounded-xl overflow-hidden">
                  {/* Replace with your actual image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-indigo-600/30 flex items-center justify-center">
                    <GraduationCap size={120} className="text-white/80" />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-yellow-400 rounded-full p-4 shadow-lg">
                <BookOpen className="h-8 w-8 text-blue-800" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Services</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">Everything you need to manage your educational journey</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Student Registration Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
              <div className="p-6">
                <div className="bg-blue-100 p-3 inline-block rounded-full mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Student Registration</h3>
                <p className="text-gray-600 mb-4">Complete your profile and register for courses with our simple application process.</p>
                <Link href="/student/register" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800">
                  Register Now <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            {/* Certificate Upload Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-1 bg-gradient-to-r from-green-500 to-emerald-600"></div>
              <div className="p-6">
                <div className="bg-green-100 p-3 inline-block rounded-full mb-4">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Document Upload</h3>
                <p className="text-gray-600 mb-4">Securely upload your certificates, transcripts and other required documents.</p>
                <Link href="/student/certificate" className="inline-flex items-center text-green-600 font-medium hover:text-green-800">
                  Upload Documents <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            {/* Applications Card - Replacing Admin Login */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-1 bg-gradient-to-r from-purple-500 to-pink-600"></div>
              <div className="p-6">
                <div className="bg-purple-100 p-3 inline-block rounded-full mb-4">
                  <Clipboard className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Application Status</h3>
                <p className="text-gray-600 mb-4">Track your applications and check admission status in real-time.</p>
                <Link href="/student/applications" className="inline-flex items-center text-purple-600 font-medium hover:text-purple-800">
                  View Applications <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start your educational journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of students who have already taken the first step toward their future.</p>
          <Link href="/student/register">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
              Apply Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer with Staff Login */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>© 2025 Student Portal. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/auth/login" className="text-gray-300 hover:text-white transition-colors">
                Staff Login
              </Link>
              <Link href="/help" className="text-gray-300 hover:text-white transition-colors">
                Help Center
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
