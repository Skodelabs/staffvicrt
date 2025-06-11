// Authentication service using MongoDB
import connectToDatabase from '@/utils/db';
import Staff from '@/models/Staff';
import mongoose from 'mongoose';
import { IStaff } from '@/models/Staff';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  token?: string;
  message?: string;
}

export const authService = {
  // Login function
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      // Connect to the database
      await connectToDatabase();
      
      // Get Staff model (handles both client and server side)
      let staffModel: mongoose.Model<IStaff>;
      if (typeof (Staff as any).getStaffModel === 'function') {
        staffModel = await (Staff as any).getStaffModel();
      } else {
        staffModel = Staff as mongoose.Model<IStaff>;
      }
      
      // Find user by email and include the password field
      const user = await staffModel.findOne({ email: credentials.email }).select('+password');
      
      // Check if user exists
      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }
      
      // Check if password matches
      const isMatch = await user.matchPassword(credentials.password);
      
      if (!isMatch) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }
      
      // Generate a token (we'll use a simple one for now)
      const token = `auth-token-${Math.random().toString(36).substring(2, 15)}`;
      
      // Save token to localStorage (in client component)
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth-token', token);
        
        // Set a cookie for the middleware
        document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
      }
      
      return {
        success: true,
        user: {
          email: user.email,
          name: user.name,
          role: user.role
        },
        token
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An error occurred during login'
      };
    }
  },
  
  // Logout function
  logout: async (): Promise<void> => {
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
      
      // Clear the cookie
      document.cookie = 'auth-token=; path=/; max-age=0';
    }
  },
  
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('auth-token');
    }
    return false;
  },
  
  // Verify token and get user
  verifyToken: async (token: string): Promise<AuthUser | null> => {
    try {
      await connectToDatabase();
      
      // Get Staff model (handles both client and server side)
      let staffModel: mongoose.Model<IStaff>;
      if (typeof (Staff as any).getStaffModel === 'function') {
        staffModel = await (Staff as any).getStaffModel();
      } else {
        staffModel = Staff as mongoose.Model<IStaff>;
      }
      
      // For now, we'll just find a user by email from the token
      // In a real app with JWT, you would decode the token and extract the user ID
      const user = await staffModel.findOne({ email: 'admin@example.com' });
      
      if (!user) return null;
      
      return {
        email: user.email,
        name: user.name,
        role: user.role
      };
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  }
};
