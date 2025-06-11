// Authentication service
// Import types only for type checking
import type { IStaff } from '@/models/Staff';

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
      // In a client-side environment, we need to call an API endpoint instead of using Mongoose directly
      if (typeof window !== 'undefined') {
        // Call the login API endpoint
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });
        
        const data = await response.json();
        
        if (!data.success) {
          return {
            success: false,
            message: data.message || 'Invalid email or password'
          };
        }
        
        // Save token to localStorage
        localStorage.setItem('auth-token', data.token);
        
        // Set a cookie for the middleware
        document.cookie = `auth-token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
        
        return {
          success: true,
          user: data.user,
          token: data.token
        };
      }
      
      // This is a mock implementation for development purposes
      // In production, this should be replaced with actual authentication logic
      if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
        const token = `auth-token-${Math.random().toString(36).substring(2, 15)}`;
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-token', token);
          document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
        }
        
        return {
          success: true,
          user: {
            email: 'admin@example.com',
            name: 'Admin User',
            role: 'admin'
          },
          token
        };
      }
      
      return {
        success: false,
        message: 'Invalid email or password'
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
      // In a client-side environment, we need to call an API endpoint
      if (typeof window !== 'undefined') {
        const response = await fetch('/api/auth/verify', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) return null;
        
        const data = await response.json();
        return data.user || null;
      }
      
      // This is a mock implementation for development purposes
      // In production, this should verify the token properly
      if (token && token.startsWith('auth-token-')) {
        return {
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin'
        };
      }
      
      return null;
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  }
};
