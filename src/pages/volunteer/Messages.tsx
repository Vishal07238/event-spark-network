
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function VolunteerMessages() {
  // Mock conversations data
  const conversations = [
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
    },
    {
      id: 3,
      name: "Animal Shelter Volunteers",
      avatar: "/placeholder.svg",
      lastMessage: "The training session has been rescheduled to next Tuesday.",
      time: "2 days ago",
      unread: 0,
      type: "event"
    },
    {
      id: 4,
      name: "Mark Williams",
      avatar: "/placeholder.svg",
      lastMessage: "Could you please confirm your availability for the weekend event?",
      time: "3 days ago",
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
              <TabsTrigger value="events">Event Groups</TabsTrigger>
              <TabsTrigger value="organizers">Organizers</TabsTrigger>
            </TabsList>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-10 w-64" />
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
                  {conversations.map((conversation) => (
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
                              <Badge variant="outline" className="ml-2">Group</Badge>
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
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="events" className="mt-0">
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-medium mb-2">Event Group Chats</h3>
                <p className="text-muted-foreground mb-4">
                  You are currently part of 2 event group chats.
                </p>
                <Button>View Event Groups</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="organizers" className="mt-0">
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-medium mb-2">Organizer Messages</h3>
                <p className="text-muted-foreground mb-4">
                  You have 2 active conversations with event organizers.
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
