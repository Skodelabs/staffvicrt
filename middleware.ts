import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /admin/applications)
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const isPublicPath = 
    path === '/' || 
    path === '/auth/login';
  
  // Get the token from cookies
  const token = request.cookies.get('auth-token')?.value || '';
  
  // If the path is not public and there's no token, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  // If the user is logged in and trying to access login page, redirect to admin
  if (path === '/auth/login' && token) {
    return NextResponse.redirect(new URL('/admin/applications', request.url));
  }
  
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
