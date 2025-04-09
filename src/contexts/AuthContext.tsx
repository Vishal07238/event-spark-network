
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User, UserRole } from '@/types/auth';
import { verifyToken, getUserFromToken } from '@/utils/auth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';

// Define action types
type AuthAction = 
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

// Create auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

// Create the context
type AuthContextType = {
  state: AuthState;
  login: (user: User, token: string) => void;
  logout: () => void;
  redirectToRoleBasedDashboard: (role: UserRole) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to redirect users based on their role
  const redirectToRoleBasedDashboard = (role: UserRole) => {
    const dashboardPaths = {
      volunteer: "/volunteer/dashboard",
      organizer: "/organizer/dashboard",
      admin: "/admin/dashboard"
    };
    
    navigate(dashboardPaths[role]);
  };

  // Check for token on app load and on location change
  useEffect(() => {
    const checkAuth = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const user = getUserFromToken(token);
          
          if (user) {
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: { user, token },
            });
            console.log('User authenticated from token:', user);
            
            // If user is on login or register page but already authenticated, redirect them
            if (['/login', '/register', '/organizer/register', '/'].includes(location.pathname)) {
              console.log('User already logged in, redirecting to dashboard');
              redirectToRoleBasedDashboard(user.role);
            }
          } else {
            // Token is invalid
            console.log('Invalid token, logging out');
            localStorage.removeItem('token');
            dispatch({ type: 'LOGOUT' });
          }
        } catch (error) {
          console.error('Error checking authentication:', error);
          localStorage.removeItem('token');
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, [location.pathname]);

  const login = (user: User, token: string) => {
    console.log('Login successful:', user);
    
    // Save token to localStorage
    localStorage.setItem('token', token);
    
    // Update state
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: { user, token },
    });

    toast({
      title: "Login successful",
      description: `Welcome back, ${user.name}!`,
    });
    
    // Redirect to the appropriate dashboard based on user role
    redirectToRoleBasedDashboard(user.role);
  };

  const logout = () => {
    console.log('Logging out');
    
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Update state
    dispatch({ type: 'LOGOUT' });
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ state, login, logout, redirectToRoleBasedDashboard }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper hook to check if user has a specific role
export const useHasRole = (roles: UserRole | UserRole[]) => {
  const { state } = useAuth();
  const rolesToCheck = Array.isArray(roles) ? roles : [roles];
  
  // Make sure we have a user with a role before checking
  if (!state.isAuthenticated || !state.user || !state.user.role) {
    return false;
  }
  
  // Debug log to help troubleshoot role issues
  console.log(`Checking roles: User has ${state.user.role}, needs one of ${rolesToCheck.join(', ')}`);
  
  return rolesToCheck.includes(state.user.role);
};
