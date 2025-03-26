
import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, Home, RefreshCw, Search } from "lucide-react";

export default function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();
  const [attemptedPath, setAttemptedPath] = useState("");
  const [suggestedRoutes, setSuggestedRoutes] = useState<string[]>([]);
  
  useEffect(() => {
    // Log the 404 error
    const path = location.pathname;
    setAttemptedPath(path);
    console.error("404 Error: User attempted to access non-existent route:", path);
    
    // Generate suggested routes based on the attempted path
    generateSuggestions(path);
  }, [location.pathname]);
  
  // Generate route suggestions based on the attempted path
  const generateSuggestions = (path: string) => {
    const suggestions: string[] = [];
    
    // Common routes
    const commonRoutes = [
      '/events',
      '/volunteer/dashboard',
      '/volunteer/events',
      '/volunteer/messages',
      '/volunteer/tasks',
      '/volunteer/profile',
      '/organizer/dashboard',
      '/organizer/events',
      '/admin/dashboard'
    ];
    
    // Try to make educated suggestions based on the path
    const pathSegments = path.split('/').filter(segment => segment);
    
    if (pathSegments.length > 0) {
      // Check for user type in path
      const userTypes = ['volunteer', 'organizer', 'admin'];
      
      // If first segment is a user type
      if (userTypes.includes(pathSegments[0])) {
        const userType = pathSegments[0];
        
        // Add dashboard as first suggestion
        suggestions.push(`/${userType}/dashboard`);
        
        // Add other routes for this user type
        commonRoutes
          .filter(route => route.startsWith(`/${userType}/`))
          .forEach(route => {
            if (!suggestions.includes(route)) {
              suggestions.push(route);
            }
          });
      } 
      // Check for other common paths
      else if (pathSegments[0] === 'events' && pathSegments.length > 1) {
        // If they tried to access a specific event with an invalid ID
        suggestions.push('/events');
      } else {
        // Try to find similar routes
        commonRoutes.forEach(route => {
          const routeSegments = route.split('/').filter(segment => segment);
          if (routeSegments.some(segment => 
            pathSegments.some(pathSegment => 
              segment.toLowerCase().includes(pathSegment.toLowerCase()) ||
              pathSegment.toLowerCase().includes(segment.toLowerCase())
            )
          )) {
            suggestions.push(route);
          }
        });
      }
    }
    
    // If no good suggestions were found, add default ones
    if (suggestions.length === 0) {
      suggestions.push('/');
      suggestions.push('/events');
      
      // Add user-specific dashboard if path contains user type
      userTypes.forEach(userType => {
        if (path.includes(userType)) {
          suggestions.push(`/${userType}/dashboard`);
        }
      });
    }
    
    // Remove duplicates and limit to 3 suggestions
    const uniqueSuggestions = [...new Set(suggestions)];
    setSuggestedRoutes(uniqueSuggestions.slice(0, 3));
  };

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
  
  // Handle retry current path
  const handleRetry = () => {
    window.location.href = location.pathname;
  };

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
        
        <Alert className="bg-accent/50 border-accent my-4">
          <Search className="h-4 w-4" />
          <AlertTitle>Attempted to access:</AlertTitle>
          <AlertDescription className="font-mono text-sm">
            {attemptedPath || location.pathname}
          </AlertDescription>
        </Alert>
        
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
          
          <Button
            onClick={handleRetry}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
        
        <div className="mt-8 text-sm text-muted-foreground">
          <p>Were you looking for one of these pages?</p>
          <div className="mt-2 flex flex-wrap gap-2 justify-center">
            {suggestedRoutes.map((route, index) => (
              <Link 
                key={index} 
                to={route} 
                className="text-primary hover:underline"
              >
                {route === '/' ? 'Home' : route.replace(/\//g, ' / ').trim()}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
