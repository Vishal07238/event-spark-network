
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";

// Volunteer pages
import VolunteerDashboard from "./pages/volunteer/Dashboard";
import VolunteerEvents from "./pages/volunteer/Events";
import VolunteerMessages from "./pages/volunteer/Messages";
import VolunteerTasks from "./pages/volunteer/Tasks";
import VolunteerProfile from "./pages/volunteer/Profile";

// Placeholder components for new routes
const OrganizerDashboard = () => <div>Organizer Dashboard (Coming Soon)</div>;
const AdminDashboard = () => <div>Admin Dashboard (Coming Soon)</div>;

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
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        
        {/* Volunteer routes */}
        <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
        <Route path="/volunteer/events" element={<VolunteerEvents />} />
        <Route path="/volunteer/messages" element={<VolunteerMessages />} />
        <Route path="/volunteer/tasks" element={<VolunteerTasks />} />
        <Route path="/volunteer/profile" element={<VolunteerProfile />} />
        
        {/* Organizer routes */}
        <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
        
        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimationWrapper>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
