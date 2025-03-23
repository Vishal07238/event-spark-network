
import { ReactNode, useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { 
  Calendar, 
  Home, 
  Menu, 
  MessageSquare, 
  Bell, 
  ChevronRight, 
  User, 
  LogOut, 
  UserPlus, 
  ClipboardList, 
  BarChart, 
  Settings,
  X,
  Moon,
  Sun
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardLayoutProps {
  children: ReactNode;
  userType: "volunteer" | "organizer" | "admin";
}

export default function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { state, logout } = useAuth();
  
  // Navigation items based on user type
  const getNavItems = () => {
    const baseItems = [
      { 
        name: "Dashboard", 
        path: `/${userType}/dashboard`,
        icon: Home 
      },
      { 
        name: "Events", 
        path: `/${userType}/events`,
        icon: Calendar 
      },
      { 
        name: "Messages", 
        path: `/${userType}/messages`,
        icon: MessageSquare,
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
          icon: ClipboardList 
        },
        { 
          name: "Profile", 
          path: "/volunteer/profile",
          icon: User 
        },
      ];
    } else if (userType === "organizer") {
      return [
        ...baseItems,
        { 
          name: "Volunteers", 
          path: "/organizer/volunteers",
          icon: UserPlus
        },
        { 
          name: "Tasks", 
          path: "/organizer/tasks",
          icon: ClipboardList
        },
        { 
          name: "Reports", 
          path: "/organizer/reports",
          icon: BarChart
        },
      ];
    } else { // admin
      return [
        ...baseItems,
        { 
          name: "Users", 
          path: "/admin/users",
          icon: UserPlus
        },
        { 
          name: "Organizations", 
          path: "/admin/organizations",
          icon: ClipboardList
        },
        { 
          name: "Analytics", 
          path: "/admin/analytics",
          icon: BarChart
        },
        { 
          name: "Settings", 
          path: "/admin/settings",
          icon: Settings
        },
      ];
    }
  };
  
  const navItems = getNavItems();

  // Handle sidebar toggle
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  // Handle dark mode toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
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
                    <item.icon className="h-4 w-4" />
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

      {/* Main content */}
      <div className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        sidebarOpen ? "md:ml-64" : ""
      )}>
        {/* Top navigation bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b bg-background/95 backdrop-blur">
          <div className="flex items-center gap-2 px-4">
            {!sidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
          </div>
          
          <div className="ml-auto flex items-center gap-2 px-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-96 overflow-auto">
                  {[1, 2, 3].map((item) => (
                    <DropdownMenuItem key={item} className="cursor-pointer p-4">
                      <div className="flex items-start gap-4">
                        <div className="h-2 w-2 mt-1.5 rounded-full bg-primary" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">New event has been created</p>
                          <p className="text-xs text-muted-foreground">Beach Cleanup • Starting in 3 days</p>
                          <p className="text-xs text-muted-foreground">2 minutes ago</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer justify-center">
                  <Button variant="ghost" className="w-full" size="sm">
                    View all notifications
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
