
import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import RealtimeStatus from "@/components/dashboard/RealtimeStatus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Users, CalendarDays, Megaphone, Activity } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getAllEvents } from "@/utils/auth";

export default function OrganizerDashboard() {
  const { state } = useAuth();
  const [events, setEvents] = useState([]);
  const [isRealtimeEnabled, setIsRealtimeEnabled] = useState(true);
  const [realtimeStatus, setRealtimeStatus] = useState<'connecting' | 'open' | 'closed'>('connecting');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(new Date());
  const [dashboardView, setDashboardView] = useState('overview');

  // Simulate loading data
  useEffect(() => {
    const loadData = () => {
      try {
        const allEvents = getAllEvents();
        // Filter events for this organizer
        const organizerEvents = allEvents.filter((event: any) => 
          event.organizerId === state.user?.id
        );
        setEvents(organizerEvents);
        setLastUpdate(new Date());
      } catch (error) {
        console.error("Error loading events:", error);
      }
    };

    loadData();
    
    // Simulate realtime connection
    const timer = setTimeout(() => {
      setRealtimeStatus('open');
    }, 1500);

    return () => clearTimeout(timer);
  }, [state.user?.id]);

  // Stats calculations
  const totalEvents = events.length;
  const activeEvents = events.filter((event: any) => event.status === 'upcoming').length;
  const totalParticipants = events.reduce((sum: number, event: any) => sum + (event.participants || 0), 0);
  const averageParticipants = totalEvents > 0 ? Math.round(totalParticipants / totalEvents) : 0;

  const toggleRealtime = () => {
    setIsRealtimeEnabled(!isRealtimeEnabled);
    if (!isRealtimeEnabled) {
      setRealtimeStatus('connecting');
      setTimeout(() => setRealtimeStatus('open'), 1500);
    } else {
      setRealtimeStatus('closed');
    }
  };

  const forceReconnect = () => {
    if (isRealtimeEnabled) {
      setRealtimeStatus('connecting');
      setTimeout(() => {
        setRealtimeStatus('open');
        setLastUpdate(new Date());
      }, 1500);
    } else {
      setLastUpdate(new Date());
    }
  };

  return (
    <DashboardLayout userType="organizer">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Organizer Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {state.user?.name || 'Organizer'}!
            </p>
          </div>
          
          <RealtimeStatus 
            isRealtimeEnabled={isRealtimeEnabled}
            realtimeStatus={realtimeStatus}
            toggleRealtime={toggleRealtime}
            forceReconnect={forceReconnect}
            lastUpdate={lastUpdate}
          />
        </div>

        {/* Stats overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Events"
            value={totalEvents}
            icon={<CalendarIcon className="h-4 w-4" />}
            description="All events you've organized"
          />
          <StatsCard
            title="Active Events"
            value={activeEvents}
            icon={<Activity className="h-4 w-4" />}
            description="Events currently active"
            progress={totalEvents > 0 ? (activeEvents / totalEvents) * 100 : 0}
          />
          <StatsCard
            title="Total Participants"
            value={totalParticipants}
            icon={<Users className="h-4 w-4" />}
            description="All volunteers registered"
          />
          <StatsCard
            title="Avg. Participants"
            value={averageParticipants}
            icon={<CalendarDays className="h-4 w-4" />}
            description="Per event average"
          />
        </div>

        {/* Dashboard tabs */}
        <Tabs defaultValue={dashboardView} onValueChange={setDashboardView} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.length > 0 ? (
                    events.slice(0, 3).map((event: any) => (
                      <div key={event.id} className="flex items-center gap-4 p-3 rounded-lg border">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Megaphone className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{event.title}</h4>
                          <p className="text-sm text-muted-foreground">{event.organization} • {event.date}</p>
                        </div>
                        <div className="text-sm font-semibold">
                          {event.participants} Participants
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground p-4">
                      No events to display. Create your first event to get started.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="upcoming" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                {events.filter((event: any) => event.status === 'upcoming').length > 0 ? (
                  <div className="space-y-2">
                    {events
                      .filter((event: any) => event.status === 'upcoming')
                      .map((event: any) => (
                        <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-semibold">{event.title}</h4>
                            <p className="text-sm text-muted-foreground">{event.date} • {event.time}</p>
                          </div>
                          <div className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                            {event.participants} registered
                          </div>
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground p-4">
                    No upcoming events. Schedule your next event to engage volunteers.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Event Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Event performance metrics will appear here once you have more data.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
