
import { Task } from '@/types/auth';
import { 
  initializeLocalStorage, 
  getStorageData, 
  saveStorageData, 
  TASKS_STORAGE_KEY 
} from './authUtils';
import { getEventById } from './eventManagement';

// Initialize tasks in localStorage if needed
const initializeTasks = () => {
  initializeLocalStorage(TASKS_STORAGE_KEY, []);
};

// Get all tasks
export const getAllTasks = (): Task[] => {
  initializeTasks();
  return getStorageData(TASKS_STORAGE_KEY);
};

// Get tasks for a specific user
export const getUserTasks = (userId: string): Task[] => {
  const tasks = getAllTasks();
  return tasks.filter((task: Task) => task.assignedTo === userId)
    .map(task => {
      // Add eventTitle to tasks with eventId for better display
      if (task.eventId && !task.eventTitle) {
        const event = getEventById(task.eventId);
        if (event) {
          task.eventTitle = event.title;
        }
      }
      return task;
    });
};

// Create a task
export const createTask = (taskData: any, organizerId: string): Task => {
  const tasks = getAllTasks();
  
  const newTask: Task = {
    ...taskData,
    id: `task-${Date.now()}`,
    createdBy: organizerId,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  // If task is related to an event, fetch and add event title
  if (newTask.eventId) {
    const event = getEventById(newTask.eventId);
    if (event) {
      newTask.eventTitle = event.title;
    }
  }
  
  tasks.push(newTask);
  saveStorageData(TASKS_STORAGE_KEY, tasks);
  return newTask;
};

// Update a task
export const updateTask = (taskId: string, taskData: any): Task | null => {
  const tasks = getAllTasks();
  const taskIndex = tasks.findIndex((t: Task) => t.id === taskId);
  
  if (taskIndex === -1) return null;
  
  // Update task data
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...taskData,
    updatedAt: new Date().toISOString()
  };
  
  saveStorageData(TASKS_STORAGE_KEY, tasks);
  return tasks[taskIndex];
};

// Complete a task
export const completeTask = (taskId: string, userId: string): Task | null => {
  const tasks = getAllTasks();
  const taskIndex = tasks.findIndex((t: Task) => t.id === taskId);
  
  if (taskIndex === -1) return null;
  
  // Check if the task is assigned to this user
  if (tasks[taskIndex].assignedTo !== userId) return null;
  
  // Mark task as completed
  tasks[taskIndex].status = 'completed';
  tasks[taskIndex].completedAt = new Date().toISOString();
  
  saveStorageData(TASKS_STORAGE_KEY, tasks);
  return tasks[taskIndex];
};

// Get tasks created by a specific organizer
export const getOrganizerTasks = (organizerId: string): Task[] => {
  const tasks = getAllTasks();
  return tasks.filter((task: Task) => task.createdBy === organizerId);
};

// Get completed tasks for a user
export const getUserCompletedTasks = (userId: string): Task[] => {
  const tasks = getAllTasks();
  return tasks.filter((task: Task) => 
    task.assignedTo === userId && task.status === 'completed'
  );
};
