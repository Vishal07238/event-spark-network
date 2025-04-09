import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useMessaging } from "@/hooks/useMessaging";
import { getAllEvents } from "@/utils/auth";

export default function VolunteerMessages() {
  const { state } = useAuth();
  const { messages, getThreads } = useMessaging();
  const [searchQuery, setSearchQuery] = useState("");
  const [eventNotifications, setEventNotifications] = useState([]);
  
  const threads = getThreads();
  
  const filteredThreads = threads.filter(thread => {
    const otherParticipantId = thread.participants.find(id => id !== state.user?.id);
    const otherParticipantName = otherParticipantId ? thread.participantNames[otherParticipantId] : "";
    return otherParticipantName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  useEffect(() => {
    if (!state.user) return;
    
    const events = getAllEvents();
    
    const registeredEvents = events.filter(event => 
      event.registeredUsers?.includes(state.user.id)
    );
    
    const notifications = registeredEvents.map(event => ({
      id: `event-${event.id}`,
      name: event.title,
      avatar: event.image || "/placeholder.svg",
      lastMessage: `You are registered for the "${event.title}" event on ${event.date}. Please check your tasks for any assigned responsibilities.`,
      time: new Date().toLocaleDateString(),
      unread: 0,
      type: "event"
    }));
    
    setEventNotifications(notifications);
  }, [state.user]);

  const conversations = [
    ...eventNotifications,
    {
      id: 1,
      name: "Beach Cleanup Team",
      avatar: "/placeholder.svg",
      lastMessage: "Don't forget to bring sunscreen to the event tomorrow!",
      time: "10:32 AM",
      unread: 2,
      type: "event"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      avatar: "/placeholder.svg",
      lastMessage: "Thanks for volunteering! Looking forward to working with you.",
      time: "Yesterday",
      unread: 0,
      type: "organizer"
    }
  ];

  return (
    <DashboardLayout userType="volunteer">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-6">Messages</h1>
        
        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="events">Event Notifications</TabsTrigger>
              <TabsTrigger value="organizers">Organizers</TabsTrigger>
            </TabsList>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search messages..." 
                className="pl-10 w-64" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <TabsContent value="all" className="mt-0">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-lg">Recent Conversations</CardTitle>
                <CardDescription>Manage your conversations with event organizers and teams</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {conversations.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-20" />
                      <p>No messages or notifications yet</p>
                    </div>
                  ) : (
                    conversations.map((conversation) => (
                      <div 
                        key={conversation.id}
                        className="flex items-center p-4 hover:bg-accent/50 cursor-pointer transition-colors"
                      >
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarImage src={conversation.avatar} alt={conversation.name} />
                          <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-width-0">
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center">
                              <p className="font-medium truncate">{conversation.name}</p>
                              {conversation.type === "event" ? (
                                <Badge variant="outline" className="ml-2">Event</Badge>
                              ) : (
                                <Badge variant="outline" className="ml-2">Organizer</Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">{conversation.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                        </div>
                        
                        {conversation.unread > 0 && (
                          <Badge className="ml-2">{conversation.unread}</Badge>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="events" className="mt-0">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-lg">Event Notifications</CardTitle>
                <CardDescription>Updates about events you've registered for</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {eventNotifications.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-20" />
                      <p>You haven't registered for any events yet</p>
                      <Button variant="outline" className="mt-4" onClick={() => window.location.href = "/events"}>
                        Browse Events
                      </Button>
                    </div>
                  ) : (
                    eventNotifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className="flex items-center p-4 hover:bg-accent/50 cursor-pointer transition-colors"
                      >
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarImage src={notification.avatar} alt={notification.name} />
                          <AvatarFallback>{notification.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-width-0">
                          <div className="flex justify-between items-center mb-1">
                            <p className="font-medium truncate">{notification.name}</p>
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.lastMessage}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="organizers" className="mt-0">
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-medium mb-2">Organizer Messages</h3>
                <p className="text-muted-foreground mb-4">
                  You have {threads.length} active conversations with event organizers.
                </p>
                <Button>View Organizer Messages</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
