
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, useHasRole } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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
    // Only show toast if authentication has been checked (not loading)
    if (!state.isLoading) {
      if (!state.isAuthenticated) {
        toast({
          title: "Authentication required",
          description: "Please log in to access this page",
          variant: "destructive",
        });
      } else if (!hasRequiredRole) {
        // Don't show access denied if still checking role
        toast({
          title: "Access denied",
          description: `You need ${allowedRoles.join(" or ")} access to view this page`,
          variant: "destructive",
        });
      }
    }
  }, [state.isLoading, state.isAuthenticated, hasRequiredRole, toast, allowedRoles]);

  // Show loading state
  if (state.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!state.isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // Authenticated but doesn't have the required role - redirect to home
  if (!hasRequiredRole) {
    console.log("User role:", state.user?.role, "Required roles:", allowedRoles);
    return <Navigate to="/" replace />;
  }

  // Authenticated and has the required role - render children
  return <>{children}</>;
};

export default ProtectedRoute;
