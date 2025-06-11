"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormLabel, FormMessage } from '@/components/ui/form';
import { authService } from '@/services/auth/auth-service';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });
      
      if (response.success) {
        router.push('/admin/applications');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Staff Login</h1>
          <p className="mt-2 text-gray-600">Sign in to access the admin portal</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            <FormField>
              <FormLabel>Email</FormLabel>
              <Input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormField>

            <FormField>
              <FormLabel>Password</FormLabel>
              <Input 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex justify-end mt-1">
                <Link href="#" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
            </FormField>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>

            <div className="text-center text-sm text-gray-600">
              <p>This portal is for authorized staff only.</p>
              <p className="mt-1">
                <Link href="/" className="text-blue-600 hover:underline">
                  Return to home page
                </Link>
              </p>
              <p className="mt-4 text-xs text-gray-500">
                Demo credentials: admin@example.com / password123
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
