
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Event } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

type EventFetchingOptions = {
  organizerId?: string;
  volunteerId?: string;
  enabled?: boolean;
};

export function useEventsFetching(options: EventFetchingOptions = {}) {
  const [lastError, setLastError] = useState<Error | null>(null);
  const { toast } = useToast();
  
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
    refetchInterval: options.enabled === false ? 30000 : false, // Poll only if realtime is disabled
    retry: 3, // Retry failed requests up to 3 times
    staleTime: 60000, // Consider data fresh for 1 minute
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
  
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
  
  return {
    events,
    isLoading,
    error: error || lastError,
    refetch: refreshEvents,
    lastError
  };
}
