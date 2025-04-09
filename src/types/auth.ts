
export type UserRole = "volunteer" | "organizer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// For demonstration purposes, these are mock users
export const MOCK_USERS = [
  {
    id: "vol-1",
    email: "volunteer@example.com",
    name: "John Doe",
    mobile: "1234567890",
    password: "password",
    role: "volunteer" as UserRole,
    createdAt: new Date().toISOString(),
  },
  {
    id: "org-1",
    email: "organizer@example.com",
    name: "Event Organizer",
    password: "password123",
    role: "organizer" as UserRole,
    createdAt: new Date().toISOString(),
  },
  {
    id: "adm-1",
    email: "admin@example.com",
    name: "Admin User",
    password: "admin123",
    role: "admin" as UserRole,
    createdAt: new Date().toISOString(),
  },
];

export interface Event {
  id: number;
  title: string;
  organization: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  status: string;
  description: string;
  image: string;
  organizerId: string;
  requirements?: string[];
  contactPerson?: string;
  contactEmail?: string;
  registeredUsers?: string[];
  volunteers?: string[]; // Added volunteers property
}

export interface Task {
  id: string;
  title: string;
  description: string;
  eventId?: number;
  assignedTo: string;
  createdBy: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
}
