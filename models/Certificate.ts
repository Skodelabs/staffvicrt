import mongoose, { Document, Schema } from 'mongoose';
import connectToDatabase from '@/utils/db';

// Connect to the database
connectToDatabase();

// Define the Certificate document interface
export interface ICertificate extends Document {
  studentId: string;
  nic: string;
  certificateType: string;
  issuingInstitution?: string;
  issueDate?: Date;
  certificateId?: string;
  comments?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  uploadDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Certificate schema
const CertificateSchema = new Schema<ICertificate>(
  {
    studentId: { type: String, required: true },
    nic: { type: String, required: true },
    certificateType: { type: String, required: true },
    issuingInstitution: { type: String },
    issueDate: { type: Date },
    certificateId: { type: String },
    comments: { type: String },
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    fileSize: { type: Number, required: true },
    fileType: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['Pending', 'Verified', 'Rejected'], 
      default: 'Pending' 
    },
    uploadDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Create and export the model
export const Certificate = mongoose.models.Certificate || mongoose.model<ICertificate>('Certificate', CertificateSchema);

export default Certificate;
