
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

type WebSocketEventHandlers = {
  onMessage: (data: any) => void;
  onOpen: (event: Event) => void;
  onError: (event: Event) => void;
  onClose: (event: CloseEvent) => void;
};

export function useWebSocketEvents(): WebSocketEventHandlers {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const handleMessage = useCallback((data: any) => {
    // Process WebSocket messages and update event cache
    console.log('WebSocket message received:', data);
    queryClient.invalidateQueries({ queryKey: ['events'] });
    
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
  }, [queryClient, toast]);
  
  const handleOpen = useCallback((event: Event) => {
    console.log('Real-time connection established');
    toast({
      title: "Real-time connected",
      description: "You'll receive live updates to events.",
    });
  }, [toast]);
  
  const handleError = useCallback((event: Event) => {
    console.error('WebSocket error:', event);
    toast({
      title: "Connection issue",
      description: "Having trouble with real-time updates. Trying to reconnect...",
      variant: "destructive",
    });
  }, [toast]);
  
  const handleClose = useCallback((event: CloseEvent) => {
    console.log('WebSocket closed:', event);
    if (event.code !== 1000) {
      toast({
        title: "Connection lost",
        description: "Real-time updates disconnected. Reconnecting...",
        variant: "destructive",
      });
    }
  }, [toast]);
  
  return {
    onMessage: handleMessage,
    onOpen: handleOpen,
    onError: handleError,
    onClose: handleClose
  };
}
