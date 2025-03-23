
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
