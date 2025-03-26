
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const navigate = useNavigate();
  const { state } = useAuth();
  const userRole = state.user?.role || "visitor";

  // Common routes for all user types
  const commonRoutes = [
    { path: "/", label: "Home" },
    { path: "/events", label: "Events" },
    { path: "/login", label: "Login" },
    { path: "/register", label: "Register" }
  ];

  // Role-specific routes
  const roleSpecificRoutes: Record<string, { path: string; label: string }[]> = {
    volunteer: [
      { path: "/volunteer/dashboard", label: "Volunteer Dashboard" },
      { path: "/volunteer/events", label: "My Events" },
      { path: "/volunteer/tasks", label: "My Tasks" },
      { path: "/volunteer/profile", label: "My Profile" }
    ],
    organizer: [
      { path: "/organizer/dashboard", label: "Organizer Dashboard" },
      { path: "/organizer/events", label: "Manage Events" }
    ],
    admin: [
      { path: "/admin/dashboard", label: "Admin Dashboard" }
    ],
    visitor: []
  };

  // Get available routes based on user role
  const availableRoutes = [...commonRoutes, ...(roleSpecificRoutes[userRole] || [])];

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }
    
    // Filter available routes based on search query
    const filteredSuggestions = availableRoutes
      .filter(route => 
        route.label.toLowerCase().includes(value.toLowerCase()) ||
        route.path.toLowerCase().includes(value.toLowerCase())
      )
      .map(route => route.path);
    
    setSuggestions(filteredSuggestions);
  };

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (suggestions.length > 0) {
      navigate(suggestions[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      
      <p className="text-muted-foreground mb-8 max-w-md">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      
      <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for pages..."
          className="pl-10"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        
        {suggestions.length > 0 && (
          <div className="absolute w-full bg-background border rounded-md mt-1 shadow-md z-10">
            {suggestions.map((suggestion, index) => (
              <Link
                key={index}
                to={suggestion}
                className="block p-2 hover:bg-accent text-left"
              >
                {suggestion}
              </Link>
            ))}
          </div>
        )}
      </form>
      
      <div className="space-y-4">
        <Button onClick={() => navigate(-1)} variant="outline">
          Go Back
        </Button>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
