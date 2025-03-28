
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getAllVolunteers, getVolunteerById, getVolunteersForEvent, addVolunteerToEvent } from '@/utils/auth';
import { User } from '@/types/auth';

export function useVolunteers() {
  const { state } = useAuth();
  const [volunteers, setVolunteers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadVolunteers();
  }, [state.user]);

  const loadVolunteers = async () => {
    if (!state.user || state.user.role !== 'organizer') {
      setVolunteers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const allVolunteers = getAllVolunteers();
      setVolunteers(allVolunteers);
    } catch (error) {
      console.error('Error loading volunteers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load volunteers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getEventVolunteers = (eventId: number) => {
    try {
      return getVolunteersForEvent(eventId);
    } catch (error) {
      console.error('Error getting event volunteers:', error);
      toast({
        title: 'Error',
        description: 'Failed to get event volunteers',
        variant: 'destructive',
      });
      return [];
    }
  };

  const assignVolunteerToEvent = async (eventId: number, volunteerId: string) => {
    if (!state.user || state.user.role !== 'organizer') {
      toast({
        title: 'Permission denied',
        description: 'Only organizers can assign volunteers',
        variant: 'destructive',
      });
      return null;
    }

    try {
      const result = addVolunteerToEvent(eventId, volunteerId);
      if (result) {
        toast({
          title: 'Success',
          description: 'Volunteer assigned to event',
        });
      }
      return result;
    } catch (error) {
      console.error('Error assigning volunteer:', error);
      toast({
        title: 'Error',
        description: 'Failed to assign volunteer',
        variant: 'destructive',
      });
      return null;
    }
  };

  const getVolunteerDetails = (volunteerId: string) => {
    try {
      return getVolunteerById(volunteerId);
    } catch (error) {
      console.error('Error getting volunteer details:', error);
      return null;
    }
  };

  return {
    volunteers,
    loading,
    loadVolunteers,
    getEventVolunteers,
    assignVolunteerToEvent,
    getVolunteerDetails
  };
}
