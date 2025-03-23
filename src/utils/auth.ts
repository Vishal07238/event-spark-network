
import jwt from 'jsonwebtoken';
import { User, UserRole, MOCK_USERS } from '@/types/auth';

// This would be an environment variable in a real app
const JWT_SECRET = 'your-secret-key-would-be-in-env-file';

// Login function that verifies credentials and returns a token
export const login = (email: string, password?: string, name?: string, mobile?: string): { user: User; token: string } | null => {
  // For demonstration, we're using mock data
  // In a real app, this would be an API call
  const user = MOCK_USERS.find(u => {
    // For volunteer login (email + name + mobile)
    if (u.role === 'volunteer' && email === u.email && name === u.name && mobile === u.mobile) {
      return true;
    }
    
    // For organizer/admin login (email + password)
    if ((u.role === 'organizer' || u.role === 'admin') && email === u.email && password === u.password) {
      return true;
    }
    
    return false;
  });

  if (!user) {
    return null;
  }

  // Create a user object without the password
  const userData: User = {
    id: user.id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    role: user.role,
    createdAt: user.createdAt
  };

  // Create a JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  return { user: userData, token };
};

// Verify and decode JWT token
export const verifyToken = (token: string): { id: string; email: string; role: UserRole } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: UserRole };
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

// Get user data from token payload
export const getUserFromToken = (token: string): User | null => {
  const decoded = verifyToken(token);
  if (!decoded) return null;

  const user = MOCK_USERS.find(u => u.id === decoded.id);
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    role: user.role,
    createdAt: user.createdAt
  };
};
