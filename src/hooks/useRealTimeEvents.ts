
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
  const [lastError, setLastError] = useState<Error | null>(null);
  
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
        
        // Filter by volunteerId if provided (for events a volunteer has registered for)
        if (options.volunteerId) {
          return allEvents.filter((event: Event) => 
            event.registeredUsers?.includes(options.volunteerId as string)
          );
        }
        
        return allEvents;
      } catch (err) {
        console.error('Error fetching events:', err);
        setLastError(err instanceof Error ? err : new Error('Unknown error'));
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
  
  // Handle WebSocket for real-time updates with improved error handling
  const { status: wsStatus, isConnected, connect, disconnect } = useWebSocket(
    WEBSOCKET_URL, 
    {
      autoConnect: realtimeEnabled,
      reconnectAttempts: 5, // Try to reconnect up to 5 times
      reconnectInterval: 2000, // Wait 2 seconds between retry attempts
      onMessage: (data) => {
        // Process WebSocket messages and update event cache
        console.log('WebSocket message received:', data);
        queryClient.invalidateQueries({ queryKey: ['events'] });
      },
      onOpen: () => {
        toast({
          title: "Real-time connected",
          description: "You'll receive live updates to events.",
        });
        setLastError(null); // Clear any previous errors
      },
      onError: (event) => {
        console.error('WebSocket error:', event);
        toast({
          title: "Connection error",
          description: "Having trouble with real-time updates. Trying to reconnect...",
          variant: "destructive",
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
  
  // Toggle real-time updates with improved connection handling
  const toggleRealtime = useCallback(() => {
    setRealtimeEnabled(prev => {
      const newValue = !prev;
      if (newValue) {
        // If enabling, connect immediately
        connect();
      } else {
        // If disabling, disconnect cleanly
        disconnect();
      }
      return newValue;
    });
  }, [connect, disconnect]);
  
  // Force a manual refresh
  const refreshEvents = useCallback(async () => {
    try {
      await refetch();
      toast({
        title: "Events refreshed",
        description: "The events list has been updated.",
      });
    } catch (err) {
      console.error('Error refreshing events:', err);
      toast({
        title: "Refresh failed",
        description: "Could not refresh events. Please try again.",
        variant: "destructive",
      });
    }
  }, [refetch, toast]);
  
  return {
    events,
    isLoading,
    error: error || lastError,
    refetch: refreshEvents,
    realtimeStatus: wsStatus,
    isRealtimeEnabled: realtimeEnabled,
    toggleRealtime,
    isRealtimeConnected: isConnected
  };
}
