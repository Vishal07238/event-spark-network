
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WEBSOCKET_URL } from '@/services/api';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useWebSocketEvents } from '@/hooks/useWebSocketEvents';
import { useEventsFetching } from '@/hooks/useEventsFetching';
import { useCustomEventListeners } from '@/hooks/useCustomEventListeners';

export function useRealTimeEvents(options: { 
  enabled?: boolean;
  organizerId?: string;
  volunteerId?: string;
} = {}) {
  const { toast } = useToast();
  const [realtimeEnabled, setRealtimeEnabled] = useState(options.enabled !== false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  // Get WebSocket event handlers
  const wsEventHandlers = useWebSocketEvents();
  
  // Enhanced WebSocket connection
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
      reconnectAttempts: 10,
      reconnectInterval: 1000,
      heartbeatInterval: 15000,
      onMessage: (data) => {
        wsEventHandlers.onMessage(data);
        setLastUpdate(new Date());
      },
      onOpen: (event) => {
        wsEventHandlers.onOpen(event);
      },
      onError: wsEventHandlers.onError,
      onClose: (event) => {
        wsEventHandlers.onClose(event);
      }
    }
  );
  
  // Fetch events with React Query
  const { 
    events, 
    isLoading, 
    error, 
    refetch 
  } = useEventsFetching({
    organizerId: options.organizerId,
    volunteerId: options.volunteerId,
    enabled: !realtimeEnabled
  });
  
  // Set up custom event listeners (window events)
  useCustomEventListeners(realtimeEnabled);
  
  // Update lastUpdate timestamp when events are refreshed manually
  useEffect(() => {
    const updateTimestamp = () => {
      setLastUpdate(new Date());
    };
    
    // Listen for the 'query-updated' event
    window.addEventListener('query-updated', updateTimestamp);
    
    return () => {
      window.removeEventListener('query-updated', updateTimestamp);
    };
  }, []);
  
  // Enhanced toggle real-time updates
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
    error,
    refetch,
    realtimeStatus: wsStatus,
    isRealtimeEnabled: realtimeEnabled,
    toggleRealtime,
    forceReconnect,
    isRealtimeConnected: isConnected,
    lastUpdate
  };
}
