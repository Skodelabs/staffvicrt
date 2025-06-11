import { NextRequest, NextResponse } from 'next/server';
import { Student } from '@/models/Student';
import connectToDatabase from '@/utils/db';

// Connect to the database
connectToDatabase();

// GET a single student by ID
export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const student = await Student.findById(id);
    
    if (!student) {
      return NextResponse.json(
        { success: false, message: 'Student not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: student });
  } catch (error) {
    console.error('Error fetching student:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch student' },
      { status: 500 }
    );
  }
}

// PATCH update a student's information or status
export async function PATCH(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const body = await request.json();
    
    // Find the student first to check if it exists
    const existingStudent = await Student.findById(id);
    
    if (!existingStudent) {
      return NextResponse.json(
        { success: false, message: 'Student not found' },
        { status: 404 }
      );
    }
    
    // Update the student
    const student = await Student.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json({ 
      success: true, 
      message: 'Student updated successfully',
      data: student 
    });
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update student' },
      { status: 500 }
    );
  }
}

// PUT disable/enable a student
export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const { disabled } = await request.json();
    
    // Find the student first to check if it exists
    const existingStudent = await Student.findById(id);
    
    if (!existingStudent) {
      return NextResponse.json(
        { success: false, message: 'Student not found' },
        { status: 404 }
      );
    }
    
    // Update only the disabled status
    const student = await Student.findByIdAndUpdate(
      id,
      { $set: { disabled: !!disabled } },
      { new: true }
    );
    
    const action = disabled ? 'disabled' : 'enabled';
    return NextResponse.json({ 
      success: true, 
      message: `Student ${action} successfully`,
      data: student 
    });
  } catch (error) {
    console.error('Error toggling student status:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update student status' },
      { status: 500 }
    );
  }
}

// DELETE a student
export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    
    // Find the student first to check if it exists
    const existingStudent = await Student.findById(id);
    
    if (!existingStudent) {
      return NextResponse.json(
        { success: false, message: 'Student not found' },
        { status: 404 }
      );
    }
    
    // Delete the student
    await Student.findByIdAndDelete(id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Student deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete student' },
      { status: 500 }
    );
  }
}
