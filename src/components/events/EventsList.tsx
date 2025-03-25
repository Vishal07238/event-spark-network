
import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wifi } from "lucide-react";

interface EventsListProps {
  filteredEvents: Array<{
    id: number;
    title: string;
    organization: string;
    date: string;
    time: string;
    location: string;
    participants: number;
    status: string;
    description: string;
    image: string;
  }>;
  isRealtimeEnabled?: boolean;
}

export default function EventsList({ filteredEvents, isRealtimeEnabled }: EventsListProps) {
  const [newEvents, setNewEvents] = useState<number[]>([]);

  // Highlight newly added events
  useEffect(() => {
    const eventIds = filteredEvents.map(event => event.id);
    
    // Store previous event IDs for comparison
    const prevEventIds = JSON.parse(localStorage.getItem('prevEventIds') || '[]');
    
    // Find new events (present in current but not in previous)
    const newlyAddedEvents = eventIds.filter(id => !prevEventIds.includes(id));
    
    if (newlyAddedEvents.length > 0) {
      setNewEvents(newlyAddedEvents);
      
      // Clear highlights after 5 seconds
      const timer = setTimeout(() => {
        setNewEvents([]);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
    
    // Save current events for next comparison
    localStorage.setItem('prevEventIds', JSON.stringify(eventIds));
  }, [filteredEvents]);
  
  if (filteredEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No events found matching your search criteria.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {isRealtimeEnabled && (
        <Alert className="bg-primary/5 border-primary/20">
          <Wifi className="h-4 w-4 text-primary" />
          <AlertDescription>
            Live updates are enabled. New events will appear automatically.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-6">
        {filteredEvents.map((event) => (
          <EventCard 
            key={event.id} 
            event={event}
            isNew={newEvents.includes(event.id)}
          />
        ))}
      </div>
    </div>
  );
}
