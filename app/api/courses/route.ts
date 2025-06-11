import { NextRequest, NextResponse } from 'next/server';
import { Category } from '@/models/Course';
import connectToDatabase from '@/utils/db';

// Connect to the database
connectToDatabase();

// GET all courses
export async function GET() {
  try {
    const categories = await Category.find().populate({
      path: 'subcategories',
      populate: {
        path: 'courses'
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      data: { categories } 
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

// POST create new course categories (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Create new category
    const category = new Category(body);
    await category.save();
    
    return NextResponse.json(
      { success: true, message: 'Course category created successfully', data: category },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating course category:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create course category' },
      { status: 500 }
    );
  }
}
