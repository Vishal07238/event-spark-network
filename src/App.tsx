
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
