
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart, PieChart, Users, Calendar, ClipboardList, Loader, RefreshCw, WifiOff } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { useRealTimeEvents } from "@/hooks/useRealTimeEvents";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const { state } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Use our real-time hook for events data
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
    enabled: true
  });
  
  // Simulated data for admin dashboard
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "volunteer", status: "active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "organizer", status: "active" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "volunteer", status: "inactive" },
    { id: 4, name: "Alice Brown", email: "alice@example.com", role: "organizer", status: "pending" },
  ];
  
  const organizations = [
    { id: 1, name: "Green Earth Foundation", events: 12, volunteers: 45, status: "active" },
    { id: 2, name: "City Helpers", events: 8, volunteers: 32, status: "active" },
    { id: 3, name: "Animal Rescue", events: 15, volunteers: 53, status: "active" },
  ];
  
  // Use real events data for recent events
  const recentEvents = events.slice(0, 5).map(event => ({
    id: event.id,
    name: event.title,
    date: event.date,
    participants: event.participants,
    organization: event.organization
  }));

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
    <DashboardLayout userType="admin">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {state.user?.name || "Admin"}!</p>
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
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Organizations</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">56</div>
              <p className="text-xs text-muted-foreground">+3 new this month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : events.length}</div>
              <p className="text-xs text-muted-foreground">
                {events.filter(e => new Date(e.date) > new Date()).length} upcoming this week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Volunteer Hours</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,567</div>
              <p className="text-xs text-muted-foreground">+18% from previous quarter</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
                <CardDescription>
                  Overview of the most recent volunteer events across all organizations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : recentEvents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No events found.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Participants</TableHead>
                        <TableHead>Organization</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentEvents.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">{event.name}</TableCell>
                          <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                          <TableCell>{event.participants}</TableCell>
                          <TableCell>{event.organization}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  {isLoading ? "Loading..." : `Showing ${recentEvents.length} of ${events.length} total events.`}
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and manage all users in the system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="capitalize">{user.role}</TableCell>
                        <TableCell>
                          <Badge className={`${
                            user.status === 'active' ? 'bg-green-500' : 
                            user.status === 'inactive' ? 'bg-gray-500' : 
                            'bg-amber-500'
                          }`}>
                            {user.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Showing {users.length} of 1,234 total users.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="organizations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Organization Management</CardTitle>
                <CardDescription>
                  View and manage all organizations in the system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Events</TableHead>
                      <TableHead>Volunteers</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organizations.map((org) => (
                      <TableRow key={org.id}>
                        <TableCell className="font-medium">{org.name}</TableCell>
                        <TableCell>{org.events}</TableCell>
                        <TableCell>{org.volunteers}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">
                            {org.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Showing {organizations.length} of 56 total organizations.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
