
import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Circle, Clock, Calendar, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getAllEvents, getUserTasks } from "@/utils/auth";
import { Event, Task } from "@/types/auth";
import { formatDistanceToNow } from "date-fns";
import TaskItem from "@/components/task/TaskItem";
import EventCompletionButton from "@/components/events/EventCompletionButton";
import { completeTask } from "@/utils/taskManagement";

export default function VolunteerTasks() {
  const { state } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load tasks and registered events
  useEffect(() => {
    if (!state.user) return;
    
    setIsLoading(true);
    
    // Get assigned tasks
    const userTasks = getUserTasks(state.user.id);
    setTasks(userTasks);
    
    // Get events the volunteer is registered for
    const events = getAllEvents();
    const userEvents = events.filter(event => 
      event.registeredUsers?.includes(state.user.id)
    );
    setRegisteredEvents(userEvents);
    
    setIsLoading(false);
  }, [state.user, refreshKey]);

  const handleTaskComplete = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleEventComplete = () => {
    setRefreshKey(prev => prev + 1);
  };

  // All activities (both tasks and registered events)
  const allActivities = [
    ...tasks.map(task => ({
      id: task.id,
      title: task.title,
      event: task.eventTitle || 'General Task',
      dueDate: task.dueDate || 'No due date',
      priority: task.priority,
      status: task.status,
      type: 'task',
      taskObject: task
    })),
    ...registeredEvents.map(event => ({
      id: `event-${event.id}`,
      title: `Attend ${event.title}`,
      event: event.title,
      dueDate: event.date,
      priority: 'medium',
      status: event.completedBy?.includes(state.user?.id) ? 'completed' : 'pending',
      type: 'event',
      eventObject: event
    }))
  ];

  const pendingActivities = allActivities.filter(activity => activity.status === "pending");
  const completedActivities = allActivities.filter(activity => activity.status === "completed");

  const ActivityItem = ({ activity }) => (
    <div className="flex items-start space-x-4 py-4 border-b last:border-0">
      {activity.status === "completed" ? (
        <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
      ) : (
        <Circle className="h-6 w-6 text-muted-foreground shrink-0 mt-0.5" />
      )}
      
      <div className="flex-1 min-width-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <div>
            <h4 className="font-medium">{activity.title}</h4>
            <p className="text-sm text-muted-foreground">Event: {activity.event}</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={activity.priority === "high" ? "destructive" : activity.priority === "medium" ? "default" : "secondary"}
            >
              {activity.priority} priority
            </Badge>
            
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              {activity.dueDate}
            </div>
            
            {activity.type === 'event' && (
              <Badge variant="outline" className="flex items-center gap-1">
                Event <ArrowUpRight className="h-3 w-3" />
              </Badge>
            )}
          </div>
        </div>
        
        {activity.status === "pending" && (
          <div className="mt-3">
            {activity.type === 'task' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  if (activity.taskObject && state.user) {
                    completeTask(activity.taskObject.id, state.user.id);
                    handleTaskComplete();
                  }
                }}
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Mark as Completed
              </Button>
            )}
            
            {activity.type === 'event' && activity.eventObject && (
              <EventCompletionButton 
                eventId={activity.eventObject.id} 
                onEventComplete={handleEventComplete} 
              />
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <DashboardLayout userType="volunteer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tasks & Events</h1>
          <p className="text-muted-foreground">
            Manage your tasks and upcoming registered events
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span>
                <span className="font-medium">{pendingActivities.length}</span> pending
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
              <span>
                <span className="font-medium">{completedActivities.length}</span> completed
              </span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All Activities</TabsTrigger>
            <TabsTrigger value="events">Registered Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Pending Tasks & Events</CardTitle>
                <CardDescription>
                  Tasks and events you need to complete
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">Loading...</p>
                  </div>
                ) : pendingActivities.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">You don't have any pending tasks or events</p>
                    <Button variant="outline" onClick={() => window.location.href = "/events"}>Browse Events</Button>
                  </div>
                ) : (
                  <div>
                    {pendingActivities.map(activity => (
                      <ActivityItem key={activity.id} activity={activity} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="completed" className="mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Completed Tasks & Events</CardTitle>
                <CardDescription>
                  Tasks and events you have already completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">Loading...</p>
                  </div>
                ) : completedActivities.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">You haven't completed any tasks or events yet</p>
                  </div>
                ) : (
                  <div>
                    {completedActivities.map(activity => (
                      <ActivityItem key={activity.id} activity={activity} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="all" className="mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>All Tasks & Events</CardTitle>
                <CardDescription>
                  Overview of all your tasks and events
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">Loading...</p>
                  </div>
                ) : allActivities.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">You don't have any tasks or events</p>
                    <Button variant="outline" onClick={() => window.location.href = "/events"}>Browse Events</Button>
                  </div>
                ) : (
                  <div>
                    {allActivities.map(activity => (
                      <ActivityItem key={activity.id} activity={activity} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="events" className="mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Registered Events</CardTitle>
                <CardDescription>
                  Events you have registered for
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">Loading...</p>
                  </div>
                ) : registeredEvents.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">You haven't registered for any events yet</p>
                    <Button onClick={() => window.location.href = "/events"}>Browse Events</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {registeredEvents.map(event => (
                      <div key={event.id} className="p-4 border rounded-lg">
                        <div className="flex items-start sm:items-center flex-col sm:flex-row sm:justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-lg">{event.title}</h3>
                            <p className="text-muted-foreground">{event.organization}</p>
                          </div>
                          <Badge variant={new Date(event.date) < new Date() ? "secondary" : "default"}>
                            {new Date(event.date) < new Date() ? "Past Event" : "Upcoming"}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {event.date} • {event.time}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Location:</span> {event.location}
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-4"
                          onClick={() => window.location.href = `/events/${event.id}`}
                        >
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
