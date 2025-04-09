
import { User, UserRole, MOCK_USERS } from '@/types/auth';
import { 
  createToken, 
  parseToken, 
  initializeLocalStorage, 
  getStorageData, 
  saveStorageData, 
  USERS_STORAGE_KEY,
  AUTHORIZED_ORGANIZER_EMAILS
} from './authUtils';

// Initialize localStorage with mock data if it doesn't exist
const initializeUsers = () => {
  initializeLocalStorage(USERS_STORAGE_KEY, MOCK_USERS);
};

// Get all users from localStorage
export const getUsers = (): Array<any> => {
  initializeUsers();
  return getStorageData(USERS_STORAGE_KEY);
};

// Save users to localStorage
export const saveUsers = (users: Array<any>): void => {
  saveStorageData(USERS_STORAGE_KEY, users);
};

// Register a new user
export const registerUser = (userData: Omit<User, 'id' | 'role' | 'createdAt'> & { password: string; role?: UserRole }): { user: User; token: string } | null => {
  const users = getUsers();
  
  // Check if user with this email already exists
  const existingUser = users.find((u: any) => u.email === userData.email);
  if (existingUser) {
    return null;
  }
  
  // Create a new user
  const newUser = {
    id: `user-${Date.now()}`,
    name: userData.name,
    email: userData.email,
    mobile: userData.mobile,
    password: userData.password, // In a real app, this would be hashed
    role: userData.role || 'volunteer' as UserRole, // Default role is volunteer
    createdAt: new Date().toISOString(),
  };
  
  // Add to users array
  users.push(newUser);
  saveUsers(users);
  
  // Return user data without password and token
  const { password, ...userWithoutPassword } = newUser;
  const token = createToken({ 
    id: newUser.id, 
    email: newUser.email, 
    role: newUser.role,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
  });
  
  return { 
    user: userWithoutPassword as User, 
    token 
  };
};

// Login function that verifies credentials and returns a token
export const login = (email: string, password?: string, name?: string, mobile?: string): { user: User; token: string } | null => {
  console.log('Login attempt:', { email, password: password ? '******' : undefined, name, mobile });
  
  initializeUsers();
  const users = getUsers();
  console.log('Available users:', users);
  
  // Find the user
  const user = users.find((u: any) => {
    // For volunteer login (email + name + mobile)
    if (u.role === 'volunteer' && email === u.email && name === u.name && mobile === u.mobile) {
      console.log('Volunteer match found');
      return true;
    }
    
    // For organizer login (email + password)
    if (u.role === 'organizer' && email === u.email && password === u.password) {
      // Check if this is an authorized organizer email
      if (!AUTHORIZED_ORGANIZER_EMAILS.includes(email)) {
        console.log('Unauthorized organizer email:', email);
        return false;
      }
      console.log('Organizer match found');
      return true;
    }
    
    // For admin login (email + password)
    if (u.role === 'admin' && email === u.email && password === u.password) {
      console.log('Admin match found');
      return true;
    }
    
    return false;
  });

  if (!user) {
    console.log('No matching user found');
    return null;
  }

  console.log('User authenticated:', user);

  // Create a user object without the password
  const { password: _, ...userData } = user;

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

  const users = getUsers();
  const user = users.find((u: any) => u.id === decoded.id);
  if (!user) return null;

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword as User;
};

// Update user profile
export const updateUserProfile = (userId: string, updatedData: Partial<User>): User | null => {
  const users = getUsers();
  const userIndex = users.findIndex((u: any) => u.id === userId);
  
  if (userIndex === -1) return null;
  
  // Update user data
  users[userIndex] = {
    ...users[userIndex],
    ...updatedData,
  };
  
  saveUsers(users);
  
  // Return updated user without password
  const { password, ...userWithoutPassword } = users[userIndex];
  return userWithoutPassword as User;
};
