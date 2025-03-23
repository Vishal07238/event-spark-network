
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
    return createEvent(eventData, organizerId);
  },
  
  update: async (eventId: number, eventData: any, organizerId: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return updateEvent(eventId, eventData, organizerId);
  },
  
  delete: async (eventId: number, organizerId: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return deleteEvent(eventId, organizerId);
  },
  
  register: async (eventId: number, userId: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    return registerForEvent(eventId, userId);
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
