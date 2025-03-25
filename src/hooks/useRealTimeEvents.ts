
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, EVENT_TYPES, WEBSOCKET_URL } from '@/services/api';
import { Event } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import { useWebSocket } from '@/hooks/useWebSocket';

export function useRealTimeEvents(options: { 
  enabled?: boolean;
  organizerId?: string;
  volunteerId?: string;
} = {}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [realtimeEnabled, setRealtimeEnabled] = useState(options.enabled !== false);
  
  // Standard query to get events
  const { 
    data: events = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['events', options],
    queryFn: async () => {
      try {
        const allEvents = await api.events.getAll();
        
        // Filter by organizerId if provided
        if (options.organizerId) {
          return allEvents.filter((event: Event) => event.organizerId === options.organizerId);
        }
        
        return allEvents;
      } catch (err) {
        console.error('Error fetching events:', err);
        toast({
          title: "Error fetching events",
          description: "Couldn't load events. Please try again later.",
          variant: "destructive",
        });
        return [];
      }
    },
    refetchInterval: realtimeEnabled ? false : 30000, // Poll only if realtime is disabled
  });
  
  // Handle WebSocket for real-time updates
  const { status: wsStatus, isConnected } = useWebSocket(
    WEBSOCKET_URL, 
    {
      autoConnect: realtimeEnabled,
      onMessage: (data) => {
        // In a real app, this would process actual WebSocket messages
        console.log('WebSocket message received:', data);
        queryClient.invalidateQueries({ queryKey: ['events'] });
      },
      onOpen: () => {
        toast({
          title: "Real-time connected",
          description: "You'll receive live updates to events.",
        });
      }
    }
  );
  
  // Listen for custom events (simulating WebSocket in this demo)
  useEffect(() => {
    if (!realtimeEnabled) return;
    
    const handleEventCreated = () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "New event created",
        description: "A new volunteer opportunity is available!",
      });
    };
    
    const handleEventUpdated = () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Event updated",
        description: "An event has been updated with new information.",
      });
    };
    
    const handleEventDeleted = () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Event cancelled",
        description: "An event has been cancelled or removed.",
      });
    };
    
    // Add event listeners
    window.addEventListener(EVENT_TYPES.EVENT_CREATED, handleEventCreated);
    window.addEventListener(EVENT_TYPES.EVENT_UPDATED, handleEventUpdated);
    window.addEventListener(EVENT_TYPES.EVENT_DELETED, handleEventDeleted);
    
    // Cleanup
    return () => {
      window.removeEventListener(EVENT_TYPES.EVENT_CREATED, handleEventCreated);
      window.removeEventListener(EVENT_TYPES.EVENT_UPDATED, handleEventUpdated);
      window.removeEventListener(EVENT_TYPES.EVENT_DELETED, handleEventDeleted);
    };
  }, [queryClient, realtimeEnabled, toast]);
  
  // Toggle real-time updates
  const toggleRealtime = useCallback(() => {
    setRealtimeEnabled(prev => !prev);
  }, []);
  
  return {
    events,
    isLoading,
    error,
    refetch,
    realtimeStatus: wsStatus,
    isRealtimeEnabled: realtimeEnabled,
    toggleRealtime,
    isRealtimeConnected: isConnected
  };
}
