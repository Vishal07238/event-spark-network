
import { Event } from '@/types/auth';
import { 
  initializeLocalStorage, 
  getStorageData, 
  saveStorageData, 
  EVENTS_STORAGE_KEY 
} from './authUtils';

// Initialize events in localStorage if needed
const initializeEvents = () => {
  // Mock initial events data
  const initialEvents = [
    {
      id: 1,
      title: "Beach Cleanup",
      organization: "Ocean Conservancy",
      date: "August 15, 2023",
      time: "9:00 AM - 12:00 PM",
      location: "Venice Beach, CA",
      participants: 24,
      status: "upcoming",
      description: "Join us for a beach cleanup event to help preserve our coastal ecosystems.",
      image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?q=80&w=300",
      organizerId: "org-1",
      registeredUsers: [],
      volunteers: []
    },
    {
      id: 2,
      title: "Food Drive",
      organization: "Local Food Bank",
      date: "August 20, 2023",
      time: "1:00 PM - 4:00 PM",
      location: "Downtown Community Center",
      participants: 12,
      status: "upcoming",
      description: "Help collect and distribute food to families in need.",
      image: "https://images.unsplash.com/photo-1593113598332-cd59a0c3a9a4?q=80&w=300",
      organizerId: "org-1",
      registeredUsers: [],
      volunteers: []
    },
  ];
  
  initializeLocalStorage(EVENTS_STORAGE_KEY, initialEvents);
};

// Get all events
export const getAllEvents = (): Event[] => {
  initializeEvents();
  return getStorageData(EVENTS_STORAGE_KEY);
};

// Get event by ID
export const getEventById = (id: number): Event | null => {
  const events = getAllEvents();
  return events.find((event: Event) => event.id === id) || null;
};

// Create a new event
export const createEvent = (eventData: any, organizerId: string): Event => {
  const events = getAllEvents();
  const newEvent = {
    ...eventData,
    id: Date.now(),
    participants: 0,
    status: 'upcoming',
    organizerId,
    registeredUsers: [],
    volunteers: []
  };
  
  events.push(newEvent);
  saveStorageData(EVENTS_STORAGE_KEY, events);
  return newEvent;
};

// Update an event
export const updateEvent = (eventId: number, eventData: any, organizerId: string): Event | null => {
  const events = getAllEvents();
  const eventIndex = events.findIndex((e: Event) => e.id === eventId);
  
  if (eventIndex === -1) return null;
  
  // Check if the user is the organizer of this event
  if (events[eventIndex].organizerId !== organizerId) return null;
  
  // Update event data
  events[eventIndex] = {
    ...events[eventIndex],
    ...eventData
  };
  
  saveStorageData(EVENTS_STORAGE_KEY, events);
  return events[eventIndex];
};

// Delete an event
export const deleteEvent = (eventId: number, organizerId: string): boolean => {
  const events = getAllEvents();
  const eventIndex = events.findIndex((e: Event) => e.id === eventId);
  
  if (eventIndex === -1) return false;
  
  // Check if the user is the organizer of this event
  if (events[eventIndex].organizerId !== organizerId) return false;
  
  // Remove the event
  events.splice(eventIndex, 1);
  saveStorageData(EVENTS_STORAGE_KEY, events);
  return true;
};

// Register for an event
export const registerForEvent = (eventId: number, userId: string): Event | null => {
  const events = getAllEvents();
  const eventIndex = events.findIndex((e: Event) => e.id === eventId);
  
  if (eventIndex === -1) return null;
  
  // Initialize arrays if they don't exist
  if (!events[eventIndex].registeredUsers) {
    events[eventIndex].registeredUsers = [];
  }
  
  // Check if user is already registered
  if (events[eventIndex].registeredUsers.includes(userId)) {
    return events[eventIndex]; // Already registered
  }
  
  // Update participants count
  events[eventIndex].participants += 1;
  
  // Store registered user
  events[eventIndex].registeredUsers.push(userId);
  
  // Add to volunteers list as well
  if (!events[eventIndex].volunteers) {
    events[eventIndex].volunteers = [];
  }
  if (!events[eventIndex].volunteers.includes(userId)) {
    events[eventIndex].volunteers.push(userId);
  }
  
  saveStorageData(EVENTS_STORAGE_KEY, events);
  return events[eventIndex];
};

// Get events a user is registered for
export const getUserRegisteredEvents = (userId: string): Event[] => {
  const events = getAllEvents();
  return events.filter((event: Event) => 
    event.registeredUsers?.includes(userId)
  );
};

// Check if a user is registered for an event
export const isUserRegisteredForEvent = (eventId: number, userId: string): boolean => {
  const event = getEventById(eventId);
  if (!event || !event.registeredUsers) return false;
  return event.registeredUsers.includes(userId);
};
