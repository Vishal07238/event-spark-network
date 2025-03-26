
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, BarChart, Clock, CalendarCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { Event } from "@/types/auth";

export default function OrganizerDashboard() {
  const navigate = useNavigate();
  const { state } = useAuth();
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalVolunteers: 0,
    upcomingEvents: 0,
    completedEvents: 0
  });
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        if (!state.user?.id) return;

        // Fetch events created by this organizer
        const allEvents = await api.events.getAll();
        const organizerEvents = allEvents.filter((event: Event) => 
          event.organizerId === state.user?.id
        );

        // Calculate stats
        const upcomingEvents = organizerEvents.filter((event: Event) => 
          event.status === "upcoming"
        );
        
        const completedEvents = organizerEvents.filter((event: Event) => 
          event.status === "completed"
        );

        // Count total unique volunteers
        const uniqueVolunteers = new Set();
        organizerEvents.forEach((event: Event) => {
          if (event.registeredUsers) {
            event.registeredUsers.forEach(userId => uniqueVolunteers.add(userId));
          }
        });

        // Sort events by date (newest first) and take the most recent ones
        const sortedEvents = [...organizerEvents].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ).slice(0, 5);

        setStats({
          totalEvents: organizerEvents.length,
          totalVolunteers: uniqueVolunteers.size,
          upcomingEvents: upcomingEvents.length,
          completedEvents: completedEvents.length
        });

        setRecentEvents(sortedEvents);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [state.user?.id]);

  return (
    <DashboardLayout userType="organizer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome, {state.user?.name || "Organizer"}
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your volunteer events and activities
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Events
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">
                Events you've created
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Volunteers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVolunteers}</div>
              <p className="text-xs text-muted-foreground">
                People helping in your events
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Upcoming Events
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
              <p className="text-xs text-muted-foreground">
                Events scheduled in the future
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Events
              </CardTitle>
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedEvents}</div>
              <p className="text-xs text-muted-foreground">
                Successfully finished events
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="recent-events" className="space-y-4">
          <TabsList>
            <TabsTrigger value="recent-events">Recent Events</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent-events" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
                <CardDescription>
                  Your most recently created events
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <p>Loading events...</p>
                  </div>
                ) : recentEvents.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4">You haven't created any events yet.</p>
                    <Button onClick={() => navigate("/organizer/events")}>
                      Create Your First Event
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div className="space-y-1">
                          <p className="font-medium">{event.title}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{event.date}</span>
                            <span>•</span>
                            <span>{event.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={
                            event.status === "upcoming" ? "bg-blue-50 text-blue-700 border-blue-200" :
                            event.status === "active" ? "bg-green-50 text-green-700 border-green-200" :
                            "bg-gray-50 text-gray-700 border-gray-200"
                          }>
                            {event.status}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{event.participants}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-4 text-center">
                      <Button variant="outline" onClick={() => navigate("/organizer/events")}>
                        View All Events
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Event Analytics</CardTitle>
                <CardDescription>
                  Insights about your events and volunteer engagement
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <BarChart className="mx-auto h-16 w-16 text-muted-foreground" />
                    <p className="mt-2 text-lg font-medium">Analytics Coming Soon</p>
                    <p className="text-sm text-muted-foreground">
                      Detailed analytics for your events will be available here soon.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
