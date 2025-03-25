
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Event } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

export type EventFilters = {
  search?: string;
  location?: string;
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
  status?: string;
};

export function useEvents(initialFilters: EventFilters = {}) {
  const [filters, setFilters] = useState<EventFilters>(initialFilters);
  const { toast } = useToast();
  
  // Fetch events with React Query
  const { 
    data: events = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
      try {
        const allEvents = await api.events.getAll();
        
        // Apply filters
        return allEvents.filter((event: Event) => {
          // Search filter (title, description, organization, location)
          if (filters.search && !((
            event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            event.description.toLowerCase().includes(filters.search.toLowerCase()) ||
            event.organization.toLowerCase().includes(filters.search.toLowerCase()) ||
            event.location.toLowerCase().includes(filters.search.toLowerCase())
          ))) {
            return false;
          }
          
          // Location filter
          if (filters.location && !event.location.toLowerCase().includes(filters.location.toLowerCase())) {
            return false;
          }
          
          // Date range filter
          if (filters.dateRange?.from || filters.dateRange?.to) {
            const eventDate = new Date(event.date);
            
            if (filters.dateRange.from && eventDate < filters.dateRange.from) {
              return false;
            }
            
            if (filters.dateRange.to && eventDate > filters.dateRange.to) {
              return false;
            }
          }
          
          // Status filter
          if (filters.status && event.status !== filters.status) {
            return false;
          }
          
          return true;
        });
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
    refetchInterval: 30000, // Poll for updates every 30 seconds
  });
  
  // Function to update filters
  const updateFilters = (newFilters: Partial<EventFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  // Function to reset all filters
  const resetFilters = () => {
    setFilters({});
  };
  
  return {
    events,
    isLoading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refetch
  };
}
