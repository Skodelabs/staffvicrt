import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center space-y-10 py-10">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Welcome to Student Portal
        </h1>
        <p className="text-xl text-gray-600">
          Register, upload certificates, and manage your student applications
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center space-y-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Student Registration</h2>
          <p className="text-gray-600">Register as a new student with your personal and academic details</p>
          <Link href="/student/register" className="mt-2">
            <Button>Register Now</Button>
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center space-y-4">
          <div className="bg-green-100 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Certificate Upload</h2>
          <p className="text-gray-600">Upload your certificates and qualifications for verification</p>
          <Link href="/student/certificate" className="mt-2">
            <Button>Upload Certificate</Button>
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center space-y-4">
          <div className="bg-purple-100 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Admin Portal</h2>
          <p className="text-gray-600">Staff login to view and manage student applications</p>
          <Link href="/auth/login" className="mt-2">
            <Button>Staff Login</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
