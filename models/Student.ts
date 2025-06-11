import mongoose, { Document, Schema } from 'mongoose';
import connectToDatabase from '@/utils/db';

// Connect to the database
connectToDatabase();

// Define the Student document interface
export interface IStudent extends Document {
  fullName: string;
  dateOfBirth: Date;
  address: string;
  phoneNumber: string;
  email: string;
  nic: string;
  middleSchoolResults: string;
  highSchoolResults: string;
  certifications?: string;
  preferredStudyCenter: string;
  selectedCategory: string;
  selectedSubcategory?: string;
  selectedCourse: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  disabled: boolean;
  appliedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Student schema
const StudentSchema = new Schema<IStudent>(
  {
    fullName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    nic: { type: String, required: true, unique: true },
    middleSchoolResults: { type: String, required: true },
    highSchoolResults: { type: String, required: true },
    certifications: { type: String },
    preferredStudyCenter: { type: String, required: true },
    selectedCategory: { type: String, required: true },
    selectedSubcategory: { type: String },
    selectedCourse: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['Pending', 'Approved', 'Rejected'], 
      default: 'Pending' 
    },
    disabled: { type: Boolean, default: false },
    appliedDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Create and export the model
export const Student = mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);

export default Student;
