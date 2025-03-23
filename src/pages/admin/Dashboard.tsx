
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart, PieChart, Users, Calendar, ClipboardList } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
}

const StatsCard = ({ title, value, description, icon }: StatsCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-4 w-4 text-muted-foreground">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default function AdminDashboard() {
  const { state } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  
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
  
  const recentEvents = [
    { id: 1, name: "Beach Cleanup", date: "2023-08-15", participants: 42, organization: "Green Earth Foundation" },
    { id: 2, name: "Food Drive", date: "2023-08-10", participants: 28, organization: "City Helpers" },
    { id: 3, name: "Dog Walking Day", date: "2023-08-05", participants: 15, organization: "Animal Rescue" },
  ];

  useEffect(() => {
    // Welcome message
    toast({
      title: "Welcome to Admin Dashboard",
      description: "You have 3 new user registrations today.",
    });
  }, []);

  return (
    <DashboardLayout userType="admin">
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {state.user?.name || "Admin"}!</p>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard 
            title="Total Users" 
            value="1,234" 
            description="+12% from last month" 
            icon={<Users className="h-4 w-4" />} 
          />
          <StatsCard 
            title="Organizations" 
            value="56" 
            description="+3 new this month" 
            icon={<ClipboardList className="h-4 w-4" />} 
          />
          <StatsCard 
            title="Events" 
            value="278" 
            description="32 upcoming this week" 
            icon={<Calendar className="h-4 w-4" />} 
          />
          <StatsCard 
            title="Volunteer Hours" 
            value="12,567" 
            description="+18% from previous quarter" 
            icon={<BarChart className="h-4 w-4" />} 
          />
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
                        <TableCell>{event.date}</TableCell>
                        <TableCell>{event.participants}</TableCell>
                        <TableCell>{event.organization}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Showing {recentEvents.length} of 278 total events.
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
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' : 
                            user.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.status}
                          </span>
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
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            {org.status}
                          </span>
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
