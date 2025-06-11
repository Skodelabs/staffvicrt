import { NextRequest, NextResponse } from 'next/server';
import { Student } from '@/models/Student';
import connectToDatabase from '@/utils/db';

// Connect to the database
connectToDatabase();

// GET all students or filter by status, disabled status, and search terms
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const showDisabled = searchParams.get('showDisabled') === 'true';
    
    let query: any = {};
    
    // Filter by disabled status
    // By default, only show non-disabled students unless explicitly requested
    if (!showDisabled) {
      query.disabled = { $ne: true };
    }
    
    // Filter by status if provided
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Search by name, course, or study center if provided
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { selectedCourse: { $regex: search, $options: 'i' } },
        { preferredStudyCenter: { $regex: search, $options: 'i' } },
        { nic: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const students = await Student.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ 
      success: true, 
      count: students.length,
      data: students 
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

// POST create a new student registration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Create new student
    const student = new Student({
      ...body,
      status: 'Pending',
      appliedDate: new Date()
    });
    
    await student.save();
    
    return NextResponse.json(
      { success: true, message: 'Registration submitted successfully', data: student },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering student:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to register student' },
      { status: 500 }
    );
  }
}
