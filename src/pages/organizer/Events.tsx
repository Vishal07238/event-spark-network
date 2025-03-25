
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Search, MapPin, Plus, Edit, Trash2, Users, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function OrganizerEvents() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  
  // Form state for creating/editing an event
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    organization: "",
    image: ""
  });
  
  // Create/Edit mode
  const [editMode, setEditMode] = useState<{ active: boolean; eventId?: number }>({ 
    active: false 
  });
  
  // Query to get organizer's events
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['organizer-events'],
    queryFn: async () => {
      // In a real app, this would filter by organizer ID from the API
      const allEvents = await api.events.getAll();
      return allEvents.filter(event => event.organizerId === state.user?.id);
    }
  });
  
  // Filter events based on search query
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Mutation for creating an event
  const createEventMutation = useMutation({
    mutationFn: async (eventData: any) => {
      if (!state.user?.id) throw new Error("User not authenticated");
      return api.events.create(eventData, state.user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizer-events'] });
      toast({
        title: "Event created successfully",
        description: "Your new event has been added.",
      });
      resetForm();
    },
    onError: () => {
      toast({
        title: "Failed to create event",
        description: "There was an error creating your event. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Mutation for updating an event
  const updateEventMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      if (!state.user?.id) throw new Error("User not authenticated");
      return api.events.update(id, data, state.user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizer-events'] });
      toast({
        title: "Event updated successfully",
        description: "Your event has been updated.",
      });
      resetForm();
    },
    onError: () => {
      toast({
        title: "Failed to update event",
        description: "There was an error updating your event. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Mutation for deleting an event
  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: number) => {
      if (!state.user?.id) throw new Error("User not authenticated");
      return api.events.delete(eventId, state.user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizer-events'] });
      toast({
        title: "Event deleted",
        description: "The event has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to delete event",
        description: "There was an error deleting the event. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Open dialog for editing an event
  const handleEditEvent = (event: any) => {
    setEventForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      organization: event.organization,
      image: event.image
    });
    setEditMode({ active: true, eventId: event.id });
    setIsDialogOpen(true);
  };
  
  // Open dialog for creating a new event
  const handleNewEvent = () => {
    resetForm();
    setEditMode({ active: false });
    setIsDialogOpen(true);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!eventForm.title || !eventForm.description || !eventForm.date || !eventForm.location) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (editMode.active && editMode.eventId) {
      // Update existing event
      updateEventMutation.mutate({ 
        id: editMode.eventId, 
        data: eventForm 
      });
    } else {
      // Create new event
      createEventMutation.mutate(eventForm);
    }
    
    setIsDialogOpen(false);
  };
  
  // Reset form state
  const resetForm = () => {
    setEventForm({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      organization: "",
      image: ""
    });
  };
  
  // Confirm event deletion
  const confirmDelete = (eventId: number) => {
    if (window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      deleteEventMutation.mutate(eventId);
    }
  };

  return (
    <DashboardLayout userType="organizer">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Events Management</h1>
            <p className="text-muted-foreground">
              Create and manage your volunteer events
            </p>
          </div>
          <Button onClick={handleNewEvent}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Event
          </Button>
        </div>
        
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events by name or location..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Events table */}
        <Card>
          <CardHeader className="p-4">
            <CardTitle>Your Events</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "No events found matching your search." : "You don't have any events yet."}
                </p>
                {!searchQuery && (
                  <Button onClick={handleNewEvent}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Event
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Volunteers</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{event.date}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">{event.time}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{event.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{event.participants}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          event.status === "upcoming" ? "bg-blue-50 text-blue-700 border-blue-200" :
                          event.status === "active" ? "bg-green-50 text-green-700 border-green-200" :
                          "bg-gray-50 text-gray-700 border-gray-200"
                        }>
                          {event.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleEditEvent(event)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => confirmDelete(event.id)} 
                          >
                            <Trash2 className="h-4 w-4" />
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
      </div>
      
      {/* Create/Edit Event Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editMode.active ? "Edit Event" : "Create New Event"}
            </DialogTitle>
            <DialogDescription>
              {editMode.active 
                ? "Update your event details below."
                : "Fill in the details to create a new volunteer event."}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Event Title *
                </label>
                <Input
                  id="title"
                  name="title"
                  value={eventForm.title}
                  onChange={handleInputChange}
                  placeholder="Beach Cleanup"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="organization" className="text-sm font-medium">
                  Organization *
                </label>
                <Input
                  id="organization"
                  name="organization"
                  value={eventForm.organization}
                  onChange={handleInputChange}
                  placeholder="Ocean Conservancy"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description *
              </label>
              <Textarea
                id="description"
                name="description"
                value={eventForm.description}
                onChange={handleInputChange}
                placeholder="Describe your event..."
                rows={3}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium">
                  Date *
                </label>
                <Input
                  id="date"
                  name="date"
                  type="text"
                  value={eventForm.date}
                  onChange={handleInputChange}
                  placeholder="August 15, 2023"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="time" className="text-sm font-medium">
                  Time
                </label>
                <Input
                  id="time"
                  name="time"
                  type="text"
                  value={eventForm.time}
                  onChange={handleInputChange}
                  placeholder="9:00 AM - 12:00 PM"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">
                Location *
              </label>
              <Input
                id="location"
                name="location"
                value={eventForm.location}
                onChange={handleInputChange}
                placeholder="Venice Beach, CA"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium">
                Image URL
              </label>
              <Input
                id="image"
                name="image"
                value={eventForm.image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {createEventMutation.isPending || updateEventMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {editMode.active ? "Update Event" : "Create Event"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
