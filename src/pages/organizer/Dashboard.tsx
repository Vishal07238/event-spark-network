
import { useEffect, useState } from "react";
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  ListPlus,
  BarChart,
  FileEdit,
  Trash2,
  PlusCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Event } from "@/types/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function OrganizerDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);

  // Get user info
  const organizerId = state.user?.id;
  const organizerName = state.user?.name;

  // Fetch events created by this organizer
  const { 
    data: myEvents = [], 
    isLoading: isLoadingEvents,
    error 
  } = useQuery({
    queryKey: ['organizer-events', organizerId],
    queryFn: async () => {
      if (!organizerId) return [];
      const allEvents = await api.events.getAll();
      return allEvents.filter((event: Event) => event.organizerId === organizerId);
    },
    enabled: !!organizerId
  });

  useEffect(() => {
    // Simulate loading state for animations
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error loading events",
        description: "Unable to load your events. Please try again later."
      });
    }
    
    return () => clearTimeout(timer);
  }, [error, toast]);

  const handleCreateEvent = () => {
    navigate("/organizer/events/create");
  };

  const handleManageEvent = (eventId: number) => {
    navigate(`/organizer/events/${eventId}`);
  };

  const stats = [
    { label: "Organized Events", value: myEvents.length, icon: Calendar },
    { label: "Volunteer Signups", value: myEvents.reduce((sum, event) => sum + (event.participants || 0), 0), icon: Users },
    { label: "Upcoming Events", value: myEvents.filter(e => e.status === "upcoming").length, icon: Clock },
    { label: "Completed Events", value: myEvents.filter(e => e.status === "completed").length, icon: CheckCircle2 }
  ];

  return (
    <DashboardLayout userType="organizer">
      <div className="space-y-8">
        {/* Greeting section */}
        <div className={`transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {organizerName || "Organizer"}</h1>
          <p className="text-muted-foreground">
            Manage your volunteer events and organizations from one place.
          </p>
        </div>

        {/* Stats section */}
        <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 transition-all duration-500 delay-100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          {stats.map((stat, i) => (
            <Card key={i} className="border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex flex-col">
                    {isLoadingEvents ? (
                      <>
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-4 w-24 mt-1" />
                      </>
                    ) : (
                      <>
                        <span className="text-2xl font-bold">{stat.value}</span>
                        <span className="text-sm text-muted-foreground">{stat.label}</span>
                      </>
                    )}
                  </div>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main content */}
        <div className="grid gap-6 md:grid-cols-6">
          {/* My Events */}
          <Card className={`col-span-6 border shadow-sm transition-all duration-500 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>My Events</CardTitle>
                <CardDescription>Manage the events you've organized</CardDescription>
              </div>
              <Button onClick={handleCreateEvent}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingEvents ? (
                // Loading skeleton
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 p-4 border rounded-lg">
                      <Skeleton className="h-16 w-16 rounded-md" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-2/3" />
                        <Skeleton className="h-4 w-1/3" />
                        <div className="flex gap-2">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : myEvents.length === 0 ? (
                <div className="text-center p-8">
                  <div className="mx-auto bg-muted w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No events created yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first volunteer event to start managing volunteers
                  </p>
                  <Button onClick={handleCreateEvent}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Your First Event
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myEvents.map((event, i) => (
                    <div 
                      key={event.id} 
                      className="relative p-4 border rounded-lg flex flex-col sm:flex-row gap-4 animate-fade-in bg-card hover:bg-accent/30 transition-colors"
                      style={{ animationDelay: `${i * 150}ms` }}
                    >
                      <div className="relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 overflow-hidden rounded-md">
                        <img 
                          src={event.image} 
                          alt={event.title} 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <h4 className="font-semibold text-lg">{event.title}</h4>
                          <Badge variant={event.status === "upcoming" ? "default" : "secondary"} className="w-fit mt-1 sm:mt-0">
                            {event.status === "upcoming" ? "Upcoming" : "Completed"}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 mt-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-1 h-4 w-4" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="mr-1 h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="mr-1 h-4 w-4" />
                            <span>{event.participants || 0} volunteers</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="sm:self-center flex gap-2 mt-2 sm:mt-0">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleManageEvent(event.id)}
                        >
                          <FileEdit className="h-4 w-4 mr-1" />
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
