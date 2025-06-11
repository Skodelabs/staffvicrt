import { NextRequest, NextResponse } from 'next/server';
import { Certificate } from '@/models/Certificate';
import connectToDatabase from '@/utils/db';

// Connect to the database
connectToDatabase();

// GET all certificates or filter by status/student
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const studentId = searchParams.get('studentId');
    const nic = searchParams.get('nic');
    
    let query: any = {};
    
    // Apply filters if provided
    if (status) {
      query.status = status;
    }
    
    if (studentId) {
      query.studentId = studentId;
    }
    
    if (nic) {
      query.nic = nic;
    }
    
    const certificates = await Certificate.find(query).sort({ uploadDate: -1 });
    
    return NextResponse.json({ success: true, data: certificates });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch certificates' },
      { status: 500 }
    );
  }
}

// POST upload a new certificate
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // In a real application, you would handle file upload separately
    // and store the file URL. For now, we'll simulate this.
    const fileUrl = `/uploads/certificates/${Date.now()}_${body.fileName}`;
    
    // Create new certificate
    const certificate = new Certificate({
      ...body,
      fileUrl,
      status: 'Pending',
      uploadDate: new Date()
    });
    
    await certificate.save();
    
    return NextResponse.json(
      { success: true, message: 'Certificate uploaded successfully', data: certificate },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error uploading certificate:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload certificate' },
      { status: 500 }
    );
  }
}
