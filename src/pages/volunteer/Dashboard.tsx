
import { useEffect, useState } from "react";
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  CalendarClock,
  BarChart,
  CalendarCheck
} from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function VolunteerDashboard() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading state for animations
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Upcoming events data
  const upcomingEvents = [
    {
      id: 1,
      title: "Beach Cleanup",
      organization: "Ocean Conservancy",
      date: "Aug 15, 2023",
      time: "9:00 AM - 12:00 PM",
      location: "Venice Beach, CA",
      participants: 24,
      status: "confirmed",
      image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?q=80&w=100"
    },
    {
      id: 2,
      title: "Food Drive",
      organization: "Local Food Bank",
      date: "Aug 20, 2023",
      time: "1:00 PM - 4:00 PM",
      location: "Downtown Community Center",
      participants: 12,
      status: "pending",
      image: "https://images.unsplash.com/photo-1593113598332-cd59a0c3a9a4?q=80&w=100"
    }
  ];

  // Stats data
  const stats = [
    { label: "Hours Volunteered", value: 78, icon: Clock },
    { label: "Events Attended", value: 12, icon: CalendarCheck },
    { label: "Organizations", value: 5, icon: Users },
    { label: "Milestones", value: 8, icon: CheckCircle2 }
  ];

  // Tasks data
  const tasks = [
    { id: 1, title: "Submit availability for Beach Cleanup", completed: true },
    { id: 2, title: "Complete orientation training", completed: true },
    { id: 3, title: "Sign liability waiver for Food Drive", completed: false },
    { id: 4, title: "Update skill preferences", completed: false }
  ];

  return (
    <DashboardLayout userType="volunteer">
      <div className="space-y-8">
        {/* Greeting section */}
        <div className={`transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h1 className="text-3xl font-bold tracking-tight">Good morning, John</h1>
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
                    <span className="text-2xl font-bold">{stat.value}</span>
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
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
              <Button variant="outline" size="sm">View all</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event, i) => (
                  <div 
                    key={event.id} 
                    className={`relative p-4 border rounded-lg flex flex-col sm:flex-row gap-4 animate-fade-in bg-card hover:bg-accent/30 transition-colors`}
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
                      <Button size="sm">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
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
              </CardContent>
            </Card>

            {/* Impact tracker */}
            <Card className={`border shadow-sm transition-all duration-500 delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <CardHeader>
                <CardTitle>Impact Tracker</CardTitle>
                <CardDescription>Your contributions so far</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>Yearly Goal: 100 Hours</span>
                    <span className="font-semibold">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>Events Goal: 20 Events</span>
                    <span className="font-semibold">60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
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
            <div className="space-y-8">
              {[1, 2, 3].map((_, i) => (
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
                          ? "Completed 'Community Garden' event" 
                          : i === 1 
                            ? "Received a message from Local Food Bank" 
                            : "Earned 'Dedicated Volunteer' badge"}
                      </p>
                      <span className="text-xs text-muted-foreground ml-2">
                        {i === 0 ? "2 days ago" : i === 1 ? "1 week ago" : "2 weeks ago"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {i === 0 
                        ? "You volunteered for 4 hours and earned a completion certificate." 
                        : i === 1 
                          ? "Thank you for your interest in our upcoming food drive event..." 
                          : "You received this badge for attending 10+ events."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
