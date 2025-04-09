
import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Mail, UserPlus, Filter, Calendar, Phone, AtSign, Loader2 } from "lucide-react";
import { useVolunteers } from "@/hooks/useVolunteers";
import { getAllEvents, getVolunteersForEvent } from "@/utils/auth";
import { User, Event } from "@/types/auth";

export default function OrganizerVolunteers() {
  const { state } = useAuth();
  const { volunteers, loading, assignVolunteerToEvent } = useVolunteers();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [eventVolunteers, setEventVolunteers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isAssigning, setIsAssigning] = useState(false);
  const { toast } = useToast();

  // Load events
  useEffect(() => {
    if (state.user?.id) {
      try {
        const allEvents = getAllEvents();
        // Filter events for this organizer
        const organizerEvents = allEvents.filter((event: Event) => 
          event.organizerId === state.user?.id
        );
        setEvents(organizerEvents);
      } catch (error) {
        console.error("Error loading events:", error);
      }
    }
  }, [state.user?.id]);

  // Load volunteers for selected event
  useEffect(() => {
    if (selectedEvent) {
      try {
        const volunteers = getVolunteersForEvent(selectedEvent.id);
        setEventVolunteers(volunteers);
      } catch (error) {
        console.error("Error loading event volunteers:", error);
      }
    }
  }, [selectedEvent]);

  // Handle event selection
  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  // Handle volunteer assignment
  const handleAssignVolunteer = async (volunteer: User) => {
    if (!selectedEvent) return;
    
    setIsAssigning(true);
    try {
      const result = await assignVolunteerToEvent(selectedEvent.id, volunteer.id);
      if (result) {
        toast({
          title: "Volunteer assigned",
          description: `${volunteer.name} has been assigned to ${selectedEvent.title}.`,
        });
        // Refresh event volunteers
        const updatedVolunteers = getVolunteersForEvent(selectedEvent.id);
        setEventVolunteers(updatedVolunteers);
      }
    } catch (error) {
      console.error("Error assigning volunteer:", error);
      toast({
        title: "Assignment failed",
        description: "Failed to assign volunteer to event.",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  // Filter volunteers based on search query
  const filteredVolunteers = volunteers.filter(volunteer => 
    volunteer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    volunteer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (volunteer.mobile && volunteer.mobile.includes(searchQuery))
  );

  // Volunteers already assigned to the selected event
  const assignedVolunteerIds = eventVolunteers.map(v => v.id);

  return (
    <DashboardLayout userType="organizer">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Volunteers</h1>
            <p className="text-muted-foreground">
              Manage volunteers and assign them to events
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search volunteers by name, email or phone..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="all">All Volunteers</TabsTrigger>
            <TabsTrigger value="events">Volunteers by Event</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>Volunteer Directory</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredVolunteers.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      No volunteers found matching your search.
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact Information</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVolunteers.map((volunteer) => (
                        <TableRow key={volunteer.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback>{volunteer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{volunteer.name}</p>
                                <Badge variant="outline" className="mt-1">Volunteer</Badge>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center">
                                <AtSign className="mr-2 h-4 w-4 text-muted-foreground" />
                                <span>{volunteer.email}</span>
                              </div>
                              {volunteer.mobile && (
                                <div className="flex items-center">
                                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                                  <span>{volunteer.mobile}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(volunteer.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  // Using mailto link for now
                                  window.location.href = `mailto:${volunteer.email}`;
                                }}
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => {
                                  if (events.length === 0) {
                                    toast({
                                      title: "No events found",
                                      description: "You don't have any events to assign volunteers to.",
                                      variant: "destructive",
                                    });
                                    return;
                                  }
                                  if (events.length === 1) {
                                    setSelectedEvent(events[0]);
                                    setIsDialogOpen(true);
                                  } else {
                                    toast({
                                      title: "Select an event",
                                      description: "Please use the 'Volunteers by Event' tab to assign this volunteer.",
                                      variant: "default",
                                    });
                                    setActiveTab("events");
                                  }
                                }}
                              >
                                <UserPlus className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>Volunteers by Event</CardTitle>
              </CardHeader>
              <CardContent>
                {events.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      You don't have any events yet.
                    </p>
                    <Button
                      onClick={() => window.location.href = "/organizer/events"}
                    >
                      Create Your First Event
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.map((event) => (
                      <Card key={event.id} className="overflow-hidden">
                        <div
                          className="h-32 bg-cover bg-center"
                          style={{ 
                            backgroundImage: event.image ? `url(${event.image})` : "url('https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=300')" 
                          }}
                        />
                        <CardContent className="p-4">
                          <h3 className="font-bold text-lg">{event.title}</h3>
                          <div className="flex items-center mt-2 text-sm text-muted-foreground">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>{event.date}</span>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div>
                              <Badge variant="outline" className="mr-2">
                                {event.participants} volunteers
                              </Badge>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleEventSelect(event)}
                            >
                              Manage
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Assign volunteers dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedEvent ? `Manage Volunteers: ${selectedEvent.title}` : "Manage Volunteers"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <Tabs defaultValue="current">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="current">Current Volunteers</TabsTrigger>
                <TabsTrigger value="add">Add Volunteers</TabsTrigger>
              </TabsList>
              
              <TabsContent value="current" className="mt-4">
                {eventVolunteers.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">
                      No volunteers assigned to this event yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {eventVolunteers.map(volunteer => (
                      <div key={volunteer.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>{volunteer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{volunteer.name}</p>
                            <p className="text-sm text-muted-foreground">{volunteer.email}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            window.location.href = `mailto:${volunteer.email}?subject=Regarding ${selectedEvent?.title}`;
                          }}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="add" className="mt-4">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search volunteers..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {filteredVolunteers.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">
                        No volunteers found matching your search.
                      </p>
                    </div>
                  ) : (
                    filteredVolunteers.map(volunteer => (
                      <div key={volunteer.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>{volunteer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{volunteer.name}</p>
                            <p className="text-sm text-muted-foreground">{volunteer.email}</p>
                          </div>
                        </div>
                        <Button
                          variant={assignedVolunteerIds.includes(volunteer.id) ? "outline" : "default"}
                          size="sm"
                          disabled={assignedVolunteerIds.includes(volunteer.id) || isAssigning}
                          onClick={() => handleAssignVolunteer(volunteer)}
                        >
                          {isAssigning ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : assignedVolunteerIds.includes(volunteer.id) ? (
                            "Assigned"
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Assign
                            </>
                          )}
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
