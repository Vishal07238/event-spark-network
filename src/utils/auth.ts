import { User, UserRole, MOCK_USERS } from '@/types/auth';

// This would be an environment variable in a real app
const JWT_SECRET = 'your-secret-key-would-be-in-env-file';
const USERS_STORAGE_KEY = 'volunteer_hub_users';
const EVENTS_STORAGE_KEY = 'volunteer_hub_events';
const TASKS_STORAGE_KEY = 'volunteer_hub_tasks';
const MESSAGES_STORAGE_KEY = 'volunteer_hub_messages';
const REPORTS_STORAGE_KEY = 'volunteer_hub_reports';
const VOLUNTEERS_STORAGE_KEY = 'volunteer_hub_volunteers';

// List of authorized organizer emails
const AUTHORIZED_ORGANIZER_EMAILS = [
  'organizer@example.com',
  // Add other authorized organizer emails here
];

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

// MESSAGING SYSTEM
// Initialize messages in localStorage if needed
const initializeMessages = () => {
  if (!localStorage.getItem(MESSAGES_STORAGE_KEY)) {
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify([]));
  }
};

// Get all messages
export const getAllMessages = () => {
  initializeMessages();
  return JSON.parse(localStorage.getItem(MESSAGES_STORAGE_KEY) || '[]');
};

// Get messages for a specific user
export const getUserMessages = (userId: string) => {
  const messages = getAllMessages();
  return messages.filter((message: any) => message.senderId === userId || message.recipientId === userId);
};

// Create a new message
export const sendMessage = (messageData: any) => {
  const messages = getAllMessages();
  const newMessage = {
    ...messageData,
    id: `msg-${Date.now()}`,
    timestamp: new Date().toISOString(),
    isRead: false
  };
  
  messages.push(newMessage);
  localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  return newMessage;
};

// Mark message as read
export const markMessageAsRead = (messageId: string) => {
  const messages = getAllMessages();
  const messageIndex = messages.findIndex((m: any) => m.id === messageId);
  
  if (messageIndex === -1) return null;
  
  messages[messageIndex].isRead = true;
  localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  return messages[messageIndex];
};

// REPORTS SYSTEM
// Initialize reports in localStorage if needed
const initializeReports = () => {
  if (!localStorage.getItem(REPORTS_STORAGE_KEY)) {
    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify([]));
  }
};

// Generate and save a report
export const generateReport = (reportType: string, organizerId: string, filters?: any) => {
  initializeReports();
  const reports = JSON.parse(localStorage.getItem(REPORTS_STORAGE_KEY) || '[]');
  
  // Get data based on report type
  let reportData;
  switch (reportType) {
    case 'events':
      const events = getAllEvents().filter((e: any) => e.organizerId === organizerId);
      reportData = { events };
      break;
    case 'volunteers':
      const users = getUsers().filter((u: any) => u.role === 'volunteer');
      reportData = { volunteers: users };
      break;
    case 'tasks':
      const tasks = getAllTasks().filter((t: any) => t.createdBy === organizerId);
      reportData = { tasks };
      break;
    default:
      reportData = {};
  }
  
  // Create report object
  const newReport = {
    id: `report-${Date.now()}`,
    type: reportType,
    createdBy: organizerId,
    timestamp: new Date().toISOString(),
    data: reportData,
    filters
  };
  
  reports.push(newReport);
  localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
  return newReport;
};

// Get all reports for an organizer
export const getOrganizerReports = (organizerId: string) => {
  initializeReports();
  const reports = JSON.parse(localStorage.getItem(REPORTS_STORAGE_KEY) || '[]');
  return reports.filter((r: any) => r.createdBy === organizerId);
};

// VOLUNTEERS MANAGEMENT
// Initialize volunteers in localStorage if needed
const initializeVolunteers = () => {
  if (!localStorage.getItem(VOLUNTEERS_STORAGE_KEY)) {
    localStorage.setItem(VOLUNTEERS_STORAGE_KEY, JSON.stringify([]));
  }
};

// Get all volunteers
export const getAllVolunteers = () => {
  initializeVolunteers();
  const users = getUsers();
  return users.filter((u: any) => u.role === 'volunteer');
};

// Get volunteer by ID
export const getVolunteerById = (volunteerId: string) => {
  const volunteers = getAllVolunteers();
  return volunteers.find((v: any) => v.id === volunteerId);
};

// Add volunteer to event
export const addVolunteerToEvent = (eventId: number, volunteerId: string) => {
  const events = getAllEvents();
  const eventIndex = events.findIndex((e: any) => e.id === eventId);
  
  if (eventIndex === -1) return null;
  
  if (!events[eventIndex].volunteers) {
    events[eventIndex].volunteers = [];
  }
  
  if (!events[eventIndex].volunteers.includes(volunteerId)) {
    events[eventIndex].volunteers.push(volunteerId);
  }
  
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  return events[eventIndex];
};

// Get volunteers for a specific event
export const getVolunteersForEvent = (eventId: number) => {
  const events = getAllEvents();
  const event = events.find((e: any) => e.id === eventId);
  
  if (!event || !event.volunteers) return [];
  
  return getAllVolunteers().filter((v: any) => event.volunteers.includes(v.id));
};
