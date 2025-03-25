
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getAllTasks,
  getUserTasks,
  createTask,
  updateTask,
  completeTask
} from '@/utils/auth';

// Event types for WebSocket messages
export const EVENT_TYPES = {
  EVENT_CREATED: 'event_created',
  EVENT_UPDATED: 'event_updated',
  EVENT_DELETED: 'event_deleted',
  EVENT_REGISTRATION: 'event_registration'
};

// Mock WebSocket URL (in a real app, this would be a real WebSocket endpoint)
export const WEBSOCKET_URL = 'ws://localhost:8080/events';

// Events API
export const eventsApi = {
  getAll: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return getAllEvents();
  },
  
  getById: async (id: number) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return getEventById(id);
  },
  
  create: async (eventData: any, organizerId: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    const newEvent = createEvent(eventData, organizerId);
    
    // Simulate WebSocket broadcast
    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent(EVENT_TYPES.EVENT_CREATED, { 
        detail: { event: newEvent }
      }));
    }
    
    return newEvent;
  },
  
  update: async (eventId: number, eventData: any, organizerId: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    const updatedEvent = updateEvent(eventId, eventData, organizerId);
    
    // Simulate WebSocket broadcast
    if (window.dispatchEvent && updatedEvent) {
      window.dispatchEvent(new CustomEvent(EVENT_TYPES.EVENT_UPDATED, { 
        detail: { event: updatedEvent }
      }));
    }
    
    return updatedEvent;
  },
  
  delete: async (eventId: number, organizerId: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const result = deleteEvent(eventId, organizerId);
    
    // Simulate WebSocket broadcast
    if (window.dispatchEvent && result) {
      window.dispatchEvent(new CustomEvent(EVENT_TYPES.EVENT_DELETED, { 
        detail: { eventId }
      }));
    }
    
    return result;
  },
  
  register: async (eventId: number, userId: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    const result = registerForEvent(eventId, userId);
    
    // Simulate WebSocket broadcast
    if (window.dispatchEvent && result) {
      window.dispatchEvent(new CustomEvent(EVENT_TYPES.EVENT_REGISTRATION, { 
        detail: { event: result, userId }
      }));
    }
    
    return result;
  }
};

// Tasks API
export const tasksApi = {
  getAll: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return getAllTasks();
  },
  
  getForUser: async (userId: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return getUserTasks(userId);
  },
  
  create: async (taskData: any, organizerId: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return createTask(taskData, organizerId);
  },
  
  update: async (taskId: string, taskData: any) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return updateTask(taskId, taskData);
  },
  
  complete: async (taskId: string, userId: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    return completeTask(taskId, userId);
  }
};

// Export a unified API service
export const api = {
  events: eventsApi,
  tasks: tasksApi
};

export default api;
