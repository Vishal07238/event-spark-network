
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
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  // Enhanced WebSocket connection with improved error handling
  const { 
    status: wsStatus, 
    isConnected, 
    connect, 
    disconnect, 
    reconnect,
    send 
  } = useWebSocket(
    WEBSOCKET_URL, 
    {
      autoConnect: realtimeEnabled,
      reconnectAttempts: 10, // Increased from 5 to 10
      reconnectInterval: 1000, // Decreased for faster recovery
      heartbeatInterval: 15000, // 15-second heartbeat
      onMessage: (data) => {
        // Process WebSocket messages and update event cache
        console.log('WebSocket message received:', data);
        queryClient.invalidateQueries({ queryKey: ['events'] });
        setLastUpdate(new Date());
        
        // Show toast for specific event types if we can identify them
        if (data && data.type) {
          switch(data.type) {
            case 'event_created':
              toast({
                title: "New event created",
                description: data.title || "A new volunteer opportunity is available!",
              });
              break;
            case 'event_updated':
              toast({
                title: "Event updated",
                description: data.title ? `"${data.title}" has been updated` : "An event has been updated with new information.",
              });
              break;
            case 'event_deleted':
              toast({
                title: "Event cancelled",
                description: data.title ? `"${data.title}" has been cancelled` : "An event has been cancelled or removed.",
              });
              break;
          }
        }
      },
      onOpen: () => {
        console.log('Real-time connection established');
        toast({
          title: "Real-time connected",
          description: "You'll receive live updates to events.",
        });
        setLastError(null); // Clear any previous errors
      },
      onError: (event) => {
        console.error('WebSocket error:', event);
        toast({
          title: "Connection issue",
          description: "Having trouble with real-time updates. Trying to reconnect...",
          variant: "destructive",
        });
      },
      onClose: (event) => {
        console.log('WebSocket closed:', event);
        if (event.code !== 1000 && realtimeEnabled) {
          toast({
            title: "Connection lost",
            description: "Real-time updates disconnected. Reconnecting...",
            variant: "destructive",
          });
        }
      }
    }
  );
  
  // Standard query to get events with enhanced caching and error handling
  const { 
    data: events = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['events', options],
    queryFn: async () => {
      try {
        console.log('Fetching events with options:', options);
        const allEvents = await api.events.getAll();
        console.log('Fetched events count:', allEvents.length);
        
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
    retry: 3, // Retry failed requests up to 3 times
    staleTime: 60000, // Consider data fresh for 1 minute
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
  
  // Listen for custom events (simulating WebSocket in this demo)
  useEffect(() => {
    if (!realtimeEnabled) return;
    
    const handleEventCreated = () => {
      console.log('Event created detected');
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setLastUpdate(new Date());
      toast({
        title: "New event created",
        description: "A new volunteer opportunity is available!",
      });
    };
    
    const handleEventUpdated = () => {
      console.log('Event updated detected');
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setLastUpdate(new Date());
      toast({
        title: "Event updated",
        description: "An event has been updated with new information.",
      });
    };
    
    const handleEventDeleted = () => {
      console.log('Event deleted detected');
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setLastUpdate(new Date());
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
  
  // Enhanced toggle real-time updates with improved connection handling
  const toggleRealtime = useCallback(() => {
    setRealtimeEnabled(prev => {
      const newValue = !prev;
      console.log('Toggling realtime to:', newValue);
      
      if (newValue) {
        // If enabling, connect immediately
        connect();
        toast({
          title: "Live updates enabled",
          description: "You'll now receive real-time updates for events.",
        });
      } else {
        // If disabling, disconnect cleanly
        disconnect();
        toast({
          title: "Live updates disabled",
          description: "You'll no longer receive real-time updates for events.",
        });
      }
      return newValue;
    });
  }, [connect, disconnect, toast]);
  
  // Force a manual refresh with better error handling
  const refreshEvents = useCallback(async () => {
    try {
      console.log('Manually refreshing events');
      toast({
        title: "Refreshing events",
        description: "Fetching the latest events...",
      });
      
      const result = await refetch();
      
      if (result.isError) {
        throw result.error;
      }
      
      setLastUpdate(new Date());
      toast({
        title: "Events refreshed",
        description: "The events list has been updated.",
      });
      
      return true;
    } catch (err) {
      console.error('Error refreshing events:', err);
      setLastError(err instanceof Error ? err : new Error('Unknown error'));
      toast({
        title: "Refresh failed",
        description: "Could not refresh events. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, [refetch, toast]);
  
  // Function to force reconnection of WebSocket
  const forceReconnect = useCallback(() => {
    if (!realtimeEnabled) {
      toast({
        title: "Live updates disabled",
        description: "Enable live updates first before reconnecting.",
      });
      return;
    }
    
    toast({
      title: "Reconnecting",
      description: "Attempting to reestablish real-time connection...",
    });
    
    reconnect();
  }, [reconnect, realtimeEnabled, toast]);
  
  return {
    events,
    isLoading,
    error: error || lastError,
    refetch: refreshEvents,
    realtimeStatus: wsStatus,
    isRealtimeEnabled: realtimeEnabled,
    toggleRealtime,
    forceReconnect,
    isRealtimeConnected: isConnected,
    lastUpdate
  };
}
