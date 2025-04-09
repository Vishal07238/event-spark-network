
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { UserRole } from "@/types/auth";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OrganizerRegister from "./pages/OrganizerRegister";
import NotFound from "./pages/NotFound";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";

// Volunteer pages
import VolunteerDashboard from "./pages/volunteer/Dashboard";
import VolunteerEvents from "./pages/volunteer/Events";
import VolunteerMessages from "./pages/volunteer/Messages";
import VolunteerTasks from "./pages/volunteer/Tasks";
import VolunteerProfile from "./pages/volunteer/Profile";

// Organizer pages
import OrganizerEvents from "./pages/organizer/Events";
import OrganizerDashboard from "./pages/organizer/Dashboard";
import OrganizerMessages from "./pages/organizer/Messages";
import OrganizerVolunteers from "./pages/organizer/Volunteers";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";

// Auth-aware wrapper that handles redirects
const AuthNavigationHandler = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useAuth();
  
  const redirectToRoleBasedDashboard = (role: UserRole) => {
    const dashboardPaths = {
      volunteer: "/volunteer/dashboard",
      organizer: "/organizer/dashboard",
      admin: "/admin/dashboard"
    };
    
    navigate(dashboardPaths[role]);
  };
  
  useEffect(() => {
    if (state.isAuthenticated && state.user) {
      if (['/login', '/register', '/organizer/register', '/'].includes(location.pathname)) {
        console.log('User already logged in, redirecting to dashboard');
        redirectToRoleBasedDashboard(state.user.role);
      }
    }
  }, [state.isAuthenticated, state.user, location.pathname]);
  
  return <>{children}</>;
};

// Animation wrapper for route transitions
const AnimationWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransistionStage] = useState("animate-fade-in");

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransistionStage("animate-fade-out");
      setTimeout(() => {
        setTransistionStage("animate-fade-in");
        setDisplayLocation(location);
      }, 300);
    }
  }, [location, displayLocation]);

  return (
    <div className={`${transitionStage}`}>
      {children}
    </div>
  );
};

// Routes wrapper component
const AppRoutes = () => {
  return (
    <AnimationWrapper>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/organizer/register" element={<OrganizerRegister />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        
        {/* Volunteer routes */}
        <Route 
          path="/volunteer/dashboard" 
          element={
            <ProtectedRoute allowedRoles={["volunteer"]}>
              <VolunteerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/volunteer/events" 
          element={
            <ProtectedRoute allowedRoles={["volunteer"]}>
              <VolunteerEvents />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/volunteer/messages" 
          element={
            <ProtectedRoute allowedRoles={["volunteer"]}>
              <VolunteerMessages />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/volunteer/tasks" 
          element={
            <ProtectedRoute allowedRoles={["volunteer"]}>
              <VolunteerTasks />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/volunteer/profile" 
          element={
            <ProtectedRoute allowedRoles={["volunteer"]}>
              <VolunteerProfile />
            </ProtectedRoute>
          } 
        />
        
        {/* Organizer routes */}
        <Route 
          path="/organizer/dashboard" 
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <OrganizerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/organizer/events" 
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <OrganizerEvents />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/organizer/messages" 
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <OrganizerMessages />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/organizer/volunteers" 
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <OrganizerVolunteers />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimationWrapper>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthNavigationHandler>
            <AppRoutes />
          </AuthNavigationHandler>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
