
import { Task } from '@/types/auth';
import { 
  initializeLocalStorage, 
  getStorageData, 
  saveStorageData, 
  TASKS_STORAGE_KEY 
} from './authUtils';

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
  return tasks.filter((task: Task) => task.assignedTo === userId);
};

// Create a task
export const createTask = (taskData: any, organizerId: string): Task => {
  const tasks = getAllTasks();
  const newTask = {
    ...taskData,
    id: `task-${Date.now()}`,
    createdBy: organizerId,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
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
