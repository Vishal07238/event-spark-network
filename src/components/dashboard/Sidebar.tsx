
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  X, 
  ChevronRight, 
  LogOut, 
  User, 
  Settings, 
  Moon, 
  Sun,
  Home,
  Calendar,
  MessageSquare,
  ClipboardList,
  UserPlus,
  BarChart
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth";
import { NavItem } from "@/types/navigation";

interface SidebarProps {
  userType: "volunteer" | "organizer" | "admin";
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isMobile: boolean;
  isDarkMode: boolean;
  setIsDarkMode: (darkMode: boolean) => void;
}

export default function Sidebar({ 
  userType, 
  sidebarOpen, 
  setSidebarOpen, 
  isMobile,
  isDarkMode,
  setIsDarkMode
}: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, logout } = useAuth();
  
  // Get navigation items based on user type
  const getNavItems = () => {
    const baseItems = [
      { 
        name: "Dashboard", 
        path: `/${userType}/dashboard`,
        icon: "Home" 
      },
      { 
        name: "Events", 
        path: `/${userType}/events`,
        icon: "Calendar" 
      },
      { 
        name: "Messages", 
        path: `/${userType}/messages`,
        icon: "MessageSquare",
        badge: 3
      },
    ];
    
    // Add role-specific menu items
    if (userType === "volunteer") {
      return [
        ...baseItems,
        { 
          name: "My Tasks", 
          path: "/volunteer/tasks",
          icon: "ClipboardList" 
        },
        { 
          name: "Profile", 
          path: "/volunteer/profile",
          icon: "User" 
        },
      ];
    } else if (userType === "organizer") {
      return [
        ...baseItems,
        { 
          name: "Volunteers", 
          path: "/organizer/volunteers",
          icon: "UserPlus"
        },
        { 
          name: "Tasks", 
          path: "/organizer/tasks",
          icon: "ClipboardList"
        },
        { 
          name: "Reports", 
          path: "/organizer/reports",
          icon: "BarChart"
        },
      ];
    } else { // admin
      return [
        ...baseItems,
        { 
          name: "Users", 
          path: "/admin/users",
          icon: "UserPlus"
        },
        { 
          name: "Organizations", 
          path: "/admin/organizations",
          icon: "ClipboardList"
        },
        { 
          name: "Analytics", 
          path: "/admin/analytics",
          icon: "BarChart"
        },
        { 
          name: "Settings", 
          path: "/admin/settings",
          icon: "Settings"
        },
      ];
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get user name and initials
  const userName = state.user?.name || 
    (userType === "volunteer" ? "John Doe" : 
     userType === "organizer" ? "Event Organizer" : "Admin User");
  
  const userInitials = userName.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  const navItems = getNavItems();

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r shadow-sm transition-transform duration-300 ease-in-out",
      isMobile && !sidebarOpen && "-translate-x-full"
    )}>
      <div className="flex h-full flex-col">
        {/* Sidebar header */}
        <div className="h-16 flex items-center gap-2 border-b px-6">
          <span className="font-semibold tracking-tight text-lg">VolunteerHub</span>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    location.pathname === item.path 
                      ? "bg-primary text-primary-foreground" 
                      : "text-foreground/70 hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <NavItemIcon name={item.icon} />
                  <span>{item.name}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar footer */}
        <div className="border-t p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-start px-2 py-6"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt={userName} />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-medium">
                      {userName}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {userType}
                    </span>
                  </div>
                  <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate(`/${userType}/profile`)}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/${userType}/settings`)}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsDarkMode(!isDarkMode)}>
                {isDarkMode ? (
                  <>
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Dark Mode</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

// Helper component to dynamically render the correct icon
const NavItemIcon = ({ name }: { name: string }) => {
  const icons = {
    Home,
    Calendar,
    MessageSquare,
    ClipboardList,
    User,
    UserPlus,
    BarChart,
    Settings
  };

  const Icon = icons[name as keyof typeof icons];
  return Icon ? <Icon className="h-4 w-4" /> : null;
};
