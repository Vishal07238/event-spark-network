
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, useHasRole } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = "/login",
}) => {
  const { state } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const hasRequiredRole = useHasRole(allowedRoles);

  useEffect(() => {
    if (!state.isLoading && !state.isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to access this page",
        variant: "destructive",
      });
    } else if (!state.isLoading && state.isAuthenticated && !hasRequiredRole) {
      toast({
        title: "Access denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      });
    }
  }, [state.isLoading, state.isAuthenticated, hasRequiredRole]);

  if (state.isLoading) {
    // Loading state
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!state.isAuthenticated) {
    // Not authenticated
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (!hasRequiredRole) {
    // Authenticated but doesn't have the required role
    return <Navigate to="/" replace />;
  }

  // Authenticated and has the required role
  return <>{children}</>;
};

export default ProtectedRoute;
