
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Circle, Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function VolunteerTasks() {
  // Mock tasks data
  const tasks = [
    {
      id: 1,
      title: "Register attendees at the entrance",
      event: "Beach Cleanup",
      dueDate: "August 15, 2023",
      priority: "high",
      status: "pending",
    },
    {
      id: 2,
      title: "Distribute cleaning supplies to volunteers",
      event: "Beach Cleanup",
      dueDate: "August 15, 2023",
      priority: "medium",
      status: "pending",
    },
    {
      id: 3,
      title: "Coordinate social media coverage",
      event: "Food Drive",
      dueDate: "August 20, 2023",
      priority: "low",
      status: "pending",
    },
    {
      id: 4,
      title: "Assist with food sorting and packaging",
      event: "Food Drive",
      dueDate: "August 20, 2023",
      priority: "medium",
      status: "completed",
    },
    {
      id: 5,
      title: "Help with event setup",
      event: "Animal Shelter Support",
      dueDate: "September 18, 2023",
      priority: "high",
      status: "completed",
    }
  ];

  const pendingTasks = tasks.filter(task => task.status === "pending");
  const completedTasks = tasks.filter(task => task.status === "completed");

  const TaskItem = ({ task }) => (
    <div className="flex items-start space-x-4 py-4 border-b last:border-0">
      {task.status === "completed" ? (
        <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
      ) : (
        <Circle className="h-6 w-6 text-muted-foreground shrink-0 mt-0.5" />
      )}
      
      <div className="flex-1 min-width-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <div>
            <h4 className="font-medium">{task.title}</h4>
            <p className="text-sm text-muted-foreground">Event: {task.event}</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"}
            >
              {task.priority} priority
            </Badge>
            
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              {task.dueDate}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout userType="volunteer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
          <p className="text-muted-foreground">
            Manage your tasks for upcoming and past volunteer events
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span>
                <span className="font-medium">{pendingTasks.length}</span> pending tasks
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
              <span>
                <span className="font-medium">{completedTasks.length}</span> completed
              </span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Pending Tasks</CardTitle>
                <CardDescription>
                  Tasks you need to complete for your upcoming events
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingTasks.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">You don't have any pending tasks</p>
                    <Button variant="outline">Browse Events</Button>
                  </div>
                ) : (
                  <div>
                    {pendingTasks.map(task => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="completed" className="mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Completed Tasks</CardTitle>
                <CardDescription>
                  Tasks you have already completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                {completedTasks.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">You haven't completed any tasks yet</p>
                  </div>
                ) : (
                  <div>
                    {completedTasks.map(task => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="all" className="mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>All Tasks</CardTitle>
                <CardDescription>
                  Overview of all your tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tasks.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">You don't have any tasks</p>
                    <Button variant="outline">Browse Events</Button>
                  </div>
                ) : (
                  <div>
                    {tasks.map(task => (
                      <TaskItem key={task.id} task={task} />
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
