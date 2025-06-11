import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import Staff from '@/models/Staff';

export async function GET(request: Request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Extract the token
    const token = authHeader.split(' ')[1];
    
    // In a real app, you would verify the token (e.g., JWT verification)
    // For this example, we'll just check if it starts with our prefix
    if (!token || !token.startsWith('auth-token-')) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Connect to the database
    await connectToDatabase();
    
    // For demonstration purposes, we'll just find a user
    // In a real app, you would decode the token and extract the user ID
    const user = await Staff.findOne({ email: 'admin@example.com' });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Return the user data
    return NextResponse.json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Token verification API error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during verification' },
      { status: 500 }
    );
  }
}
