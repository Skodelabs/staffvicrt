import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/utils/db';

export interface IStaff {
  email: string;
  password: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const StaffSchema = new mongoose.Schema<IStaff>({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false, // Don't return password by default
  },
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  role: {
    type: String,
    enum: ['admin', 'staff'],
    default: 'staff',
  },
}, {
  timestamps: true,
});

// Hash password before saving
StaffSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to check if password matches
StaffSchema.methods.matchPassword = async function(enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create a function to get the Staff model
const getStaffModel = async () => {
  // Ensure database connection is established
  await connectToDatabase();
  // Prevent mongoose from creating a model multiple times during hot reloading
  return mongoose.models.Staff || mongoose.model<IStaff>('Staff', StaffSchema);
};

// For server-side usage, we can directly export the model
let Staff: mongoose.Model<IStaff>;

// Handle both client and server side model access
try {
  // For client-side, we need to check if mongoose is available
  Staff = mongoose.models.Staff || mongoose.model<IStaff>('Staff', StaffSchema);
} catch (error) {
  // If we're on the client side and mongoose isn't ready, create a placeholder
  // This will be replaced with the actual model when used server-side
  console.warn('Creating placeholder Staff model for client-side rendering');
  // @ts-ignore - This is a workaround for client-side rendering
  Staff = { getStaffModel } as any;
}

export default Staff;
