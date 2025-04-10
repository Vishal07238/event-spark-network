import React, { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Calendar, MapPin, Users, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getAllEvents, getUserRegisteredEvents } from "@/utils/eventManagement";
import { getUserTasks, getOrganizerTasks } from "@/utils/taskManagement";
import { Event, Task } from "@/types/auth";
import StatsCard from "@/components/dashboard/StatsCard";
import RealtimeStatus from "@/components/dashboard/RealtimeStatus";

export default function OrganizerDashboard() {
  const { state } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [registeredVolunteers, setRegisteredVolunteers] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!state.user) return;

    setIsLoading(true);

    // Get all events created by the organizer
    const organizerEvents = getAllEvents().filter(
      (event) => event.organizerId === state.user.id
    );
    setEvents(organizerEvents);

    // Get all tasks created by the organizer
    const organizerTasks = getOrganizerTasks(state.user.id);
    setTasks(organizerTasks);

    // Calculate the total number of registered volunteers across all events
    let totalVolunteers = 0;
    organizerEvents.forEach((event) => {
      if (event.registeredUsers) {
        totalVolunteers += event.registeredUsers.length;
      }
    });
    setRegisteredVolunteers(totalVolunteers);

    setIsLoading(false);
  }, [state.user]);

  // Calculate upcoming and past events
  const upcomingEvents = events.filter((event) => new Date(event.date) >= new Date());
  const pastEvents = events.filter((event) => new Date(event.date) < new Date());

  return (
    <DashboardLayout userType="organizer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Track events, tasks, and volunteer engagement.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Events"
            value={events.length.toString()}
            percentageIncrease={12}
            description="Total number of events created"
          />
          <StatsCard
            title="Upcoming Events"
            value={upcomingEvents.length.toString()}
            percentageIncrease={8}
            description="Number of events scheduled"
          />
          <StatsCard
            title="Volunteers Registered"
            value={registeredVolunteers.toString()}
            percentageIncrease={15}
            description="Total volunteers registered for events"
          />
          <StatsCard
            title="Tasks Assigned"
            value={tasks.length.toString()}
            percentageIncrease={5}
            description="Total tasks assigned to volunteers"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>
                Events you have scheduled and are yet to happen.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading...</p>
              ) : upcomingEvents.length === 0 ? (
                <p>No upcoming events.</p>
              ) : (
                <ul className="list-none space-y-4">
                  {upcomingEvents.map((event) => (
                    <li key={event.id} className="border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{event.title}</h3>
                        <Badge variant="outline">Upcoming</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        <Calendar className="h-4 w-4 inline-block mr-1" />
                        {event.date}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        <MapPin className="h-4 w-4 inline-block mr-1" />
                        {event.location}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Tasks</CardTitle>
              <CardDescription>
                Tasks assigned to volunteers for your events.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading...</p>
              ) : tasks.length === 0 ? (
                <p>No tasks assigned.</p>
              ) : (
                <ul className="list-none space-y-4">
                  {tasks.slice(0, 3).map((task) => (
                    <li key={task.id} className="border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{task.title}</h3>
                        <Badge variant="secondary">{task.priority} Priority</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        <Users className="h-4 w-4 inline-block mr-1" />
                        Assigned to: {task.assignedTo}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        <Clock className="h-4 w-4 inline-block mr-1" />
                        Due Date: {task.dueDate || "No due date"}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <RealtimeStatus />
        </div>
      </div>
    </DashboardLayout>
  );
}
