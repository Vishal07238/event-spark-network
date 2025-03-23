
import { User, UserRole, MOCK_USERS } from '@/types/auth';

// This would be an environment variable in a real app
const JWT_SECRET = 'your-secret-key-would-be-in-env-file';

// Simple browser-compatible JWT implementation for demo purposes
const createToken = (payload: any): string => {
  // In a real app, you would use a proper JWT library like jose
  // This is a simplified implementation for demo purposes
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = btoa(
    JSON.stringify({ data: `${header}.${encodedPayload}`, secret: JWT_SECRET })
  );
  
  return `${header}.${encodedPayload}.${signature}`;
};

const parseToken = (token: string): any | null => {
  try {
    // In a real app, you would verify the signature
    // This is a simplified implementation for demo purposes
    const [, payload] = token.split('.');
    return JSON.parse(atob(payload));
  } catch (error) {
    console.error('Token parsing failed:', error);
    return null;
  }
};

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
  const token = createToken(
    { id: user.id, email: user.email, role: user.role, exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) }
  );

  return { user: userData, token };
};

// Verify and decode JWT token
export const verifyToken = (token: string): { id: string; email: string; role: UserRole } | null => {
  try {
    const decoded = parseToken(token) as { id: string; email: string; role: UserRole; exp: number };
    
    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      console.error('Token expired');
      return null;
    }
    
    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
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
