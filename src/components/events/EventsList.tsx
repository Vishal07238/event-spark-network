
import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wifi, Clock, Loader } from "lucide-react";
import { WebSocketStatus } from "@/hooks/websocket/types";
import { motion, AnimatePresence } from "framer-motion";

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
  realtimeStatus?: WebSocketStatus;
}

export default function EventsList({ 
  filteredEvents, 
  isRealtimeEnabled, 
  realtimeStatus = 'closed' 
}: EventsListProps) {
  const [newEvents, setNewEvents] = useState<number[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Handle initial load animation
  useEffect(() => {
    if (filteredEvents.length > 0 && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [filteredEvents, isInitialLoad]);

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
          <AlertDescription className="flex items-center">
            <span>Live updates are enabled. New events will appear automatically.</span>
            {realtimeStatus === 'connecting' && (
              <div className="ml-2 flex items-center text-amber-500">
                <Loader className="h-3 w-3 mr-1 animate-spin" />
                <span className="text-xs">Connecting...</span>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-6">
        <AnimatePresence mode="popLayout">
          {filteredEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={isInitialLoad ? { opacity: 0, y: 20 } : { opacity: 1 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ 
                duration: 0.3,
                delay: isInitialLoad ? Math.random() * 0.3 : 0 
              }}
              layout
              className={newEvents.includes(event.id) ? "animate-pulse" : ""}
            >
              <EventCard 
                event={event}
                isNew={newEvents.includes(event.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
