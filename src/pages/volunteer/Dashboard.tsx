
import { useEffect, useState } from "react";
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  CalendarClock,
  BarChart,
  CalendarCheck,
  MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Event } from "@/types/auth";
import { Skeleton } from "@/components/ui/skeleton";

export default function VolunteerDashboard() {
  const navigate = useNavigate();
  const { state } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Get user info
  const volunteerId = state.user?.id;
  const volunteerName = state.user?.name;
  
  // Fetch events this volunteer has registered for
  const { 
    data: registeredEvents = [], 
    isLoading: isLoadingEvents 
  } = useQuery({
    queryKey: ['volunteer-events', volunteerId],
    queryFn: async () => {
      if (!volunteerId) return [];
      const allEvents = await api.events.getAll();
      return allEvents.filter((event: Event) => 
        event.registeredUsers?.includes(volunteerId)
      );
    },
    enabled: !!volunteerId
  });
  
  // Fetch tasks assigned to this volunteer
  const {
    data: assignedTasks = [],
    isLoading: isLoadingTasks
  } = useQuery({
    queryKey: ['volunteer-tasks', volunteerId],
    queryFn: async () => {
      if (!volunteerId) return [];
      return await api.tasks.getForUser(volunteerId);
    },
    enabled: !!volunteerId
  });

  useEffect(() => {
    // Simulate loading state for animations
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Calculate stats based on actual data
  const stats = [
    { 
      label: "Hours Volunteered", 
      value: isLoadingEvents ? "-" : registeredEvents.length * 3, // Assuming 3 hours per event 
      icon: Clock 
    },
    { 
      label: "Events Attended", 
      value: isLoadingEvents ? "-" : registeredEvents.length, 
      icon: CalendarCheck 
    },
    { 
      label: "Organizations", 
      value: isLoadingEvents ? "-" : [...new Set(registeredEvents.map(e => e.organization))].length, 
      icon: Users 
    },
    { 
      label: "Milestones", 
      value: isLoadingEvents ? "-" : Math.floor(registeredEvents.length / 2), // 1 milestone per 2 events
      icon: CheckCircle2 
    }
  ];

  // Tasks based on actual data
  const tasks = isLoadingTasks 
    ? [] 
    : assignedTasks.map(task => ({
        id: task.id,
        title: task.title,
        completed: task.status === 'completed'
      })).slice(0, 4); // Show max 4 tasks

  const completedTasks = !isLoadingTasks ? assignedTasks.filter(task => task.status === 'completed').length : 0;
  const totalTasks = !isLoadingTasks ? assignedTasks.length : 0;
  const hoursProgress = !isLoadingEvents ? (registeredEvents.length * 3) : 0; // 3 hours per event
  const eventsProgress = !isLoadingEvents ? registeredEvents.length : 0;

  const handleViewAllEvents = () => {
    navigate("/events");
  };

  const handleViewEventDetails = (eventId: number) => {
    navigate(`/events/${eventId}`);
  };

  // Get upcoming events (registered or not)
  const upcomingEvents = isLoadingEvents 
    ? [] 
    : registeredEvents.filter(event => event.status === "upcoming").slice(0, 2);

  return (
    <DashboardLayout userType="volunteer">
      <div className="space-y-8">
        {/* Greeting section */}
        <div className={`transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h1 className="text-3xl font-bold tracking-tight">Good morning, {volunteerName || "Volunteer"}</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your volunteer activities.
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
          {/* Upcoming events */}
          <Card className={`col-span-6 md:col-span-4 border shadow-sm transition-all duration-500 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Your next volunteer opportunities</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleViewAllEvents}>View all</Button>
            </CardHeader>
            <CardContent>
              {isLoadingEvents ? (
                // Loading skeleton
                <div className="space-y-4">
                  {[1, 2].map((i) => (
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
              ) : upcomingEvents.length === 0 ? (
                <div className="text-center p-8">
                  <div className="mx-auto bg-muted w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No upcoming events</h3>
                  <p className="text-muted-foreground mb-4">
                    You don't have any upcoming events. Explore volunteer opportunities and register for events.
                  </p>
                  <Button onClick={handleViewAllEvents}>Find Events</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingEvents.map((event, i) => (
                    <div 
                      key={event.id} 
                      className={`relative p-4 border rounded-lg flex flex-col sm:flex-row gap-4 animate-fade-in bg-card hover:bg-accent/30 transition-colors cursor-pointer`}
                      style={{ animationDelay: `${i * 150}ms` }}
                      onClick={() => handleViewEventDetails(event.id)}
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
                          <Badge variant={event.status === "confirmed" ? "default" : "secondary"} className="w-fit mt-1 sm:mt-0">
                            {event.status === "confirmed" ? "Confirmed" : "Pending"}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">{event.organization}</p>
                        
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 mt-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-1 h-4 w-4" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-4 w-4" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="mr-1 h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex items-center text-sm">
                          <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{event.participants} volunteers participating</span>
                        </div>
                      </div>
                      
                      <div className="sm:self-center mt-2 sm:mt-0">
                        <Button size="sm" onClick={(e) => {
                          e.stopPropagation();
                          handleViewEventDetails(event.id);
                        }}>View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tasks and progress */}
          <div className="col-span-6 md:col-span-2 space-y-6">
            {/* Tasks */}
            <Card className={`border shadow-sm transition-all duration-500 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <CardHeader>
                <CardTitle>Tasks</CardTitle>
                <CardDescription>Your pending tasks</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingTasks ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-4 flex-1" />
                      </div>
                    ))}
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="text-center p-4">
                    <p className="text-muted-foreground">No tasks assigned yet</p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {tasks.map((task, i) => (
                      <li 
                        key={task.id} 
                        className={`flex items-start p-3 border rounded-md animate-fade-in ${task.completed ? 'bg-primary/5' : 'bg-card'}`}
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        <div className="flex-shrink-0 mr-2">
                          <div className={`h-5 w-5 rounded-full border ${task.completed ? 'bg-primary border-primary' : 'border-muted-foreground/30'} flex items-center justify-center`}>
                            {task.completed && (
                              <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                            )}
                          </div>
                        </div>
                        <span className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Impact tracker */}
            <Card className={`border shadow-sm transition-all duration-500 delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <CardHeader>
                <CardTitle>Impact Tracker</CardTitle>
                <CardDescription>Your contributions so far</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingEvents ? (
                  <div className="space-y-4">
                    <div>
                      <div className="mb-1 flex justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                      <Skeleton className="h-2 w-full" />
                    </div>
                    <div>
                      <div className="mb-1 flex justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                      <Skeleton className="h-2 w-full" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="mb-1 flex justify-between text-sm">
                        <span>Yearly Goal: 100 Hours</span>
                        <span className="font-semibold">{hoursProgress}%</span>
                      </div>
                      <Progress value={hoursProgress} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="mb-1 flex justify-between text-sm">
                        <span>Events Goal: 20 Events</span>
                        <span className="font-semibold">{(eventsProgress/20)*100}%</span>
                      </div>
                      <Progress value={(eventsProgress/20)*100} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="mb-1 flex justify-between text-sm">
                        <span>Tasks Completed</span>
                        <span className="font-semibold">
                          {totalTasks > 0 ? Math.round((completedTasks/totalTasks)*100) : 0}%
                        </span>
                      </div>
                      <Progress value={totalTasks > 0 ? (completedTasks/totalTasks)*100 : 0} className="h-2" />
                    </div>
                    
                    <div className="pt-2">
                      <h4 className="text-sm font-medium mb-2">Recent recognitions</h4>
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-yellow-100 text-yellow-700">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trophy"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 22V8a4 4 0 0 1 4-4 4 4 0 0 1 4 4v14"/><path d="M8 22v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4"/></svg>
                        </div>
                        <div className="p-2 rounded-full bg-green-100 text-green-700">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-medal"><path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"/><path d="M11 12 5.5 2"/><path d="m13 12 5.5-10"/><circle cx="12" cy="17" r="5"/><path d="M12 18v-2h-.5"/></svg>
                        </div>
                        <div className="p-2 rounded-full bg-blue-100 text-blue-700">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-badge-check"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent activity */}
        <Card className={`border shadow-sm transition-all duration-500 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest volunteer activities</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingEvents ? (
              <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="w-1 h-20 mt-2" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : registeredEvents.length === 0 ? (
              <div className="text-center p-6">
                <p className="text-muted-foreground">No activity recorded yet</p>
              </div>
            ) : (
              <div className="space-y-8">
                {[...registeredEvents].slice(0, 3).map((event, i) => (
                  <div key={i} className="flex animate-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
                    <div className="flex flex-col items-center mr-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                        {i === 0 ? (
                          <CalendarCheck className="h-4 w-4" />
                        ) : i === 1 ? (
                          <MessageSquare className="h-4 w-4" />
                        ) : (
                          <BarChart className="h-4 w-4" />
                        )}
                      </div>
                      <div className="w-px h-full bg-border mt-2" />
                    </div>
                    
                    <div className="pb-8">
                      <div className="flex items-center mb-1">
                        <p className="text-sm font-medium">
                          {i === 0 
                            ? `Registered for '${event.title}' event` 
                            : i === 1 
                              ? `Received a message from ${event.organization}` 
                              : `Earned 'Volunteer' badge from ${event.organization}`}
                        </p>
                        <span className="text-xs text-muted-foreground ml-2">
                          {i === 0 ? "Recently" : i === 1 ? "1 week ago" : "2 weeks ago"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {i === 0 
                          ? `You've registered for the ${event.title} event on ${event.date}.` 
                          : i === 1 
                            ? `Thank you for your interest in our ${event.title} event...` 
                            : `You received this badge for participating in ${event.title}.`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
