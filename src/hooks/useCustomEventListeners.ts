
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { EVENT_TYPES } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export function useCustomEventListeners(enabled: boolean) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!enabled) return;
    
    const handleEventCreated = () => {
      console.log('Event created detected');
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "New event created",
        description: "A new volunteer opportunity is available!",
      });
    };
    
    const handleEventUpdated = () => {
      console.log('Event updated detected');
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Event updated",
        description: "An event has been updated with new information.",
      });
    };
    
    const handleEventDeleted = () => {
      console.log('Event deleted detected');
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
  }, [queryClient, enabled, toast]);
}
