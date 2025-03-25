
import { User, UserRole, MOCK_USERS } from '@/types/auth';

// This would be an environment variable in a real app
const JWT_SECRET = 'your-secret-key-would-be-in-env-file';
const USERS_STORAGE_KEY = 'volunteer_hub_users';
const EVENTS_STORAGE_KEY = 'volunteer_hub_events';
const TASKS_STORAGE_KEY = 'volunteer_hub_tasks';

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

// Initialize localStorage with mock data if it doesn't exist
const initializeLocalStorage = () => {
  if (!localStorage.getItem(USERS_STORAGE_KEY)) {
    console.log('Initializing localStorage with mock users:', MOCK_USERS);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(MOCK_USERS));
  }
};

// Get all users from localStorage
const getUsers = (): Array<any> => {
  initializeLocalStorage();
  return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
};

// Save users to localStorage
const saveUsers = (users: Array<any>): void => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

// Register a new user
export const registerUser = (userData: Omit<User, 'id' | 'role' | 'createdAt'> & { password: string }): { user: User; token: string } | null => {
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
    role: 'volunteer' as UserRole, // Default role is volunteer
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
  
  initializeLocalStorage();
  const users = getUsers();
  console.log('Available users:', users);
  
  // Find the user
  const user = users.find((u: any) => {
    // For volunteer login (email + name + mobile)
    if (u.role === 'volunteer' && email === u.email && name === u.name && mobile === u.mobile) {
      console.log('Volunteer match found');
      return true;
    }
    
    // For organizer/admin login (email + password)
    if ((u.role === 'organizer' || u.role === 'admin') && email === u.email && password === u.password) {
      console.log('Organizer/Admin match found');
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

// EVENTS MANAGEMENT
// Initialize events in localStorage if needed
const initializeEvents = () => {
  if (!localStorage.getItem(EVENTS_STORAGE_KEY)) {
    // Mock initial events data
    const initialEvents = [
      {
        id: 1,
        title: "Beach Cleanup",
        organization: "Ocean Conservancy",
        date: "August 15, 2023",
        time: "9:00 AM - 12:00 PM",
        location: "Venice Beach, CA",
        participants: 24,
        status: "upcoming",
        description: "Join us for a beach cleanup event to help preserve our coastal ecosystems.",
        image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?q=80&w=300",
        organizerId: "org-1"
      },
      {
        id: 2,
        title: "Food Drive",
        organization: "Local Food Bank",
        date: "August 20, 2023",
        time: "1:00 PM - 4:00 PM",
        location: "Downtown Community Center",
        participants: 12,
        status: "upcoming",
        description: "Help collect and distribute food to families in need.",
        image: "https://images.unsplash.com/photo-1593113598332-cd59a0c3a9a4?q=80&w=300",
        organizerId: "org-1"
      },
    ];
    
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(initialEvents));
  }
};

// Get all events
export const getAllEvents = () => {
  initializeEvents();
  return JSON.parse(localStorage.getItem(EVENTS_STORAGE_KEY) || '[]');
};

// Get event by ID
export const getEventById = (id: number) => {
  const events = getAllEvents();
  return events.find((event: any) => event.id === id) || null;
};

// Create a new event
export const createEvent = (eventData: any, organizerId: string) => {
  const events = getAllEvents();
  const newEvent = {
    ...eventData,
    id: Date.now(),
    participants: 0,
    status: 'upcoming',
    organizerId
  };
  
  events.push(newEvent);
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  return newEvent;
};

// Update an event
export const updateEvent = (eventId: number, eventData: any, organizerId: string) => {
  const events = getAllEvents();
  const eventIndex = events.findIndex((e: any) => e.id === eventId);
  
  if (eventIndex === -1) return null;
  
  // Check if the user is the organizer of this event
  if (events[eventIndex].organizerId !== organizerId) return null;
  
  // Update event data
  events[eventIndex] = {
    ...events[eventIndex],
    ...eventData
  };
  
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  return events[eventIndex];
};

// Delete an event
export const deleteEvent = (eventId: number, organizerId: string) => {
  const events = getAllEvents();
  const eventIndex = events.findIndex((e: any) => e.id === eventId);
  
  if (eventIndex === -1) return false;
  
  // Check if the user is the organizer of this event
  if (events[eventIndex].organizerId !== organizerId) return false;
  
  // Remove the event
  events.splice(eventIndex, 1);
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  return true;
};

// Register for an event
export const registerForEvent = (eventId: number, userId: string) => {
  const events = getAllEvents();
  const eventIndex = events.findIndex((e: any) => e.id === eventId);
  
  if (eventIndex === -1) return null;
  
  // Update participants count
  events[eventIndex].participants += 1;
  
  // Store registered user (in a real app, this would be a many-to-many relationship)
  if (!events[eventIndex].registeredUsers) {
    events[eventIndex].registeredUsers = [];
  }
  events[eventIndex].registeredUsers.push(userId);
  
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  return events[eventIndex];
};

// TASKS MANAGEMENT
// Initialize tasks in localStorage if needed
const initializeTasks = () => {
  if (!localStorage.getItem(TASKS_STORAGE_KEY)) {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify([]));
  }
};

// Get all tasks
export const getAllTasks = () => {
  initializeTasks();
  return JSON.parse(localStorage.getItem(TASKS_STORAGE_KEY) || '[]');
};

// Get tasks for a specific user
export const getUserTasks = (userId: string) => {
  const tasks = getAllTasks();
  return tasks.filter((task: any) => task.assignedTo === userId);
};

// Create a task
export const createTask = (taskData: any, organizerId: string) => {
  const tasks = getAllTasks();
  const newTask = {
    ...taskData,
    id: `task-${Date.now()}`,
    createdBy: organizerId,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  tasks.push(newTask);
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  return newTask;
};

// Update a task
export const updateTask = (taskId: string, taskData: any) => {
  const tasks = getAllTasks();
  const taskIndex = tasks.findIndex((t: any) => t.id === taskId);
  
  if (taskIndex === -1) return null;
  
  // Update task data
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...taskData,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  return tasks[taskIndex];
};

// Complete a task
export const completeTask = (taskId: string, userId: string) => {
  const tasks = getAllTasks();
  const taskIndex = tasks.findIndex((t: any) => t.id === taskId);
  
  if (taskIndex === -1) return null;
  
  // Check if the task is assigned to this user
  if (tasks[taskIndex].assignedTo !== userId) return null;
  
  // Mark task as completed
  tasks[taskIndex].status = 'completed';
  tasks[taskIndex].completedAt = new Date().toISOString();
  
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  return tasks[taskIndex];
};
