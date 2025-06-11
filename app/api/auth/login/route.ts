import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import Staff from '@/models/Staff';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Connect to the database
    await connectToDatabase();
    
    // Find user by email and include the password field for verification
    const user = await Staff.findOne({ email }).select('+password');
    
    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Generate a token
    const token = `auth-token-${Math.random().toString(36).substring(2, 15)}`;
    
    // Return success response with user data and token
    return NextResponse.json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
