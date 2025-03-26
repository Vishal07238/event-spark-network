
import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Generate the best back link based on the current path
  const getBestBackLink = () => {
    const path = location.pathname;
    
    // If it's an organizer path, go back to organizer dashboard
    if (path.includes('/organizer')) {
      return '/organizer/dashboard';
    }
    
    // If it's a volunteer path, go back to volunteer dashboard
    if (path.includes('/volunteer')) {
      return '/volunteer/dashboard';
    }
    
    // If it's an admin path, go back to admin dashboard
    if (path.includes('/admin')) {
      return '/admin/dashboard';
    }
    
    // Default to home
    return '/';
  };
  
  const bestBackLink = getBestBackLink();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 animate-fade-in">
        <div className="relative mx-auto w-24 h-24 mb-8">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
          <div className="relative bg-background border-2 border-primary rounded-full w-full h-full flex items-center justify-center">
            <span className="text-3xl font-bold text-primary">404</span>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
        
        <p className="text-muted-foreground">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        
        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </Button>
          
          <Button 
            onClick={() => navigate(bestBackLink)}
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            {bestBackLink === '/' ? 'Home' : 'Dashboard'}
          </Button>
        </div>
        
        <div className="mt-8 text-sm text-muted-foreground">
          <p>Looking for one of these pages?</p>
          <div className="mt-2 flex flex-wrap gap-2 justify-center">
            <Link to="/events" className="text-primary hover:underline">Events</Link>
            <Link to="/volunteer/dashboard" className="text-primary hover:underline">Volunteer Dashboard</Link>
            <Link to="/organizer/events" className="text-primary hover:underline">Organizer Events</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
