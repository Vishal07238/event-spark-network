
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart, Users, Calendar, Loader, RefreshCw, WifiOff } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { useRealTimeEvents } from "@/hooks/useRealTimeEvents";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

export default function OrganizerDashboard() {
  const { state } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const organizerId = state.user?.id;
  
  // Use our real-time hook for events data with the organizer's ID
  const {
    events,
    isLoading,
    error,
    realtimeStatus,
    isRealtimeEnabled,
    toggleRealtime,
    forceReconnect,
    lastUpdate,
  } = useRealTimeEvents({ 
    enabled: true,
    organizerId 
  });
  
  // Track stats for the dashboard
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    completedEvents: 0,
    totalParticipants: 0,
    registrationRate: 0
  });
  
  // Calculate dashboard stats based on events data
  useEffect(() => {
    if (events.length > 0) {
      const now = new Date();
      const upcoming = events.filter(event => new Date(event.date) > now);
      const completed = events.filter(event => 
        new Date(event.date) < now || event.status === 'completed'
      );
      
      const totalParticipants = events.reduce(
        (sum, event) => sum + (event.participants || 0), 
        0
      );
      
      const avgCapacity = events.length > 0 
        ? events.reduce((sum, event) => sum + (event.capacity || 0), 0) / events.length 
        : 0;
      
      const registrationRate = avgCapacity > 0 
        ? (totalParticipants / (avgCapacity * events.length)) * 100 
        : 0;
      
      setStats({
        totalEvents: events.length,
        upcomingEvents: upcoming.length,
        completedEvents: completed.length,
        totalParticipants,
        registrationRate: Math.round(registrationRate)
      });
    }
  }, [events]);
  
  // Format timestamp for display
  const formatLastUpdate = () => {
    if (!lastUpdate) return "Never";
    
    const now = new Date();
    const diff = now.getTime() - lastUpdate.getTime();
    
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    return lastUpdate.toLocaleTimeString();
  };
  
  return (
    <DashboardLayout userType="organizer">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Organizer Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {state.user?.name || "Organizer"}!</p>
          </div>
          
          {/* Real-time connection status indicator */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="text-sm text-muted-foreground mr-2">
                Last update: {formatLastUpdate()}
              </div>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => forceReconnect()}
                aria-label="Refresh data"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              variant={isRealtimeEnabled ? "default" : "outline"}
              size="sm"
              onClick={toggleRealtime}
              className="relative"
            >
              {isRealtimeEnabled ? (
                <>
                  <span className="mr-2">Live Updates</span>
                  {realtimeStatus === 'connecting' ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : realtimeStatus === 'open' ? (
                    <motion.div
                      className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  ) : (
                    <WifiOff className="h-4 w-4" />
                  )}
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 mr-2" />
                  <span>Enable Live</span>
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : stats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">Events you've organized</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : stats.upcomingEvents}</div>
              <p className="text-xs text-muted-foreground">Events scheduled</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : stats.totalParticipants}</div>
              <p className="text-xs text-muted-foreground">Volunteers registered</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Registration Rate</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : `${stats.registrationRate}%`}</div>
              <Progress
                value={stats.registrationRate}
                className="h-2 mt-2"
                aria-label="Registration rate"
              />
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>
                  A list of your upcoming volunteer events.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : events.filter(e => new Date(e.date) > new Date()).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No upcoming events found. Create a new event to get started.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Registrations</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events
                        .filter(event => new Date(event.date) > new Date())
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .map((event) => (
                          <TableRow key={event.id}>
                            <TableCell className="font-medium">{event.title}</TableCell>
                            <TableCell>
                              {new Date(event.date).toLocaleDateString()} at {event.time}
                            </TableCell>
                            <TableCell>{event.location}</TableCell>
                            <TableCell>{event.participants} registered</TableCell>
                            <TableCell>
                              <Badge className={
                                event.status === 'active' ? 'bg-green-500' : 
                                event.status === 'cancelled' ? 'bg-red-500' : 'bg-amber-500'
                              }>
                                {event.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  {events.filter(e => new Date(e.date) > new Date()).length} upcoming events
                </div>
                <Button>Create New Event</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="past" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Past Events</CardTitle>
                <CardDescription>
                  History of your completed volunteer events.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : events.filter(e => new Date(e.date) <= new Date()).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No past events found.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Participants</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events
                        .filter(event => new Date(event.date) <= new Date())
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((event) => (
                          <TableRow key={event.id}>
                            <TableCell className="font-medium">{event.title}</TableCell>
                            <TableCell>
                              {new Date(event.date).toLocaleDateString()} at {event.time}
                            </TableCell>
                            <TableCell>{event.location}</TableCell>
                            <TableCell>{event.participants}</TableCell>
                            <TableCell>
                              <Badge className={
                                event.status === 'completed' ? 'bg-green-500' : 
                                event.status === 'cancelled' ? 'bg-red-500' : 'bg-amber-500'
                              }>
                                {event.status === 'active' ? 'completed' : event.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Event Analytics</CardTitle>
                <CardDescription>
                  Performance metrics for your volunteer events.
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <p>Analytics visualization coming soon</p>
                    <p className="text-sm">We're working on detailed charts and insights</p>
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
