
import { User } from '@/types/auth';
import { 
  initializeLocalStorage, 
  getStorageData, 
  saveStorageData, 
  VOLUNTEERS_STORAGE_KEY 
} from './authUtils';
import { getUsers } from './userAuth';
import { getAllEvents } from './eventManagement';

// Initialize volunteers in localStorage if needed
const initializeVolunteers = () => {
  initializeLocalStorage(VOLUNTEERS_STORAGE_KEY, []);
};

// Get all volunteers
export const getAllVolunteers = (): User[] => {
  initializeVolunteers();
  const users = getUsers();
  return users.filter((u: any) => u.role === 'volunteer');
};

// Get volunteer by ID
export const getVolunteerById = (volunteerId: string): User | undefined => {
  const volunteers = getAllVolunteers();
  return volunteers.find((v: User) => v.id === volunteerId);
};

// Add volunteer to event
export const addVolunteerToEvent = (eventId: number, volunteerId: string): any => {
  const events = getAllEvents();
  const eventIndex = events.findIndex((e: any) => e.id === eventId);
  
  if (eventIndex === -1) return null;
  
  if (!events[eventIndex].volunteers) {
    events[eventIndex].volunteers = [];
  }
  
  if (!events[eventIndex].volunteers.includes(volunteerId)) {
    events[eventIndex].volunteers.push(volunteerId);
  }
  
  saveStorageData('volunteer_hub_events', events);
  return events[eventIndex];
};

// Get volunteers for a specific event
export const getVolunteersForEvent = (eventId: number): User[] => {
  const events = getAllEvents();
  const event = events.find((e: any) => e.id === eventId);
  
  if (!event || !event.volunteers) return [];
  
  return getAllVolunteers().filter((v: User) => event.volunteers.includes(v.id));
};
