
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { createTask, getAllTasks, updateTask, completeTask } from '@/utils/auth';
import { Task } from '@/types/auth';

export function useTaskManagement() {
  const { state } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTasks();
  }, [state.user]);

  const loadTasks = async () => {
    if (!state.user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const allTasks = getAllTasks();
      
      // Filter tasks based on user role
      const filteredTasks = state.user.role === 'organizer'
        ? allTasks.filter((task: Task) => task.createdBy === state.user?.id)
        : allTasks.filter((task: Task) => task.assignedTo === state.user?.id);
      
      setTasks(filteredTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tasks',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'createdBy' | 'createdAt' | 'status' | 'updatedAt' | 'completedAt'>) => {
    if (!state.user || state.user.role !== 'organizer') {
      toast({
        title: 'Permission denied',
        description: 'Only organizers can create tasks',
        variant: 'destructive',
      });
      return null;
    }

    try {
      const newTask = createTask(taskData, state.user.id);
      setTasks(prev => [...prev, newTask]);
      toast({
        title: 'Success',
        description: 'Task created successfully',
      });
      return newTask;
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: 'Error',
        description: 'Failed to create task',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateTaskStatus = async (taskId: string, status: 'pending' | 'in-progress' | 'completed' | 'cancelled') => {
    if (!state.user) return null;

    try {
      const updatedTask = updateTask(taskId, { status });
      if (!updatedTask) return null;

      setTasks(prev => prev.map(task => task.id === taskId ? updatedTask : task));
      toast({
        title: 'Success',
        description: `Task status updated to ${status}`,
      });
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task status',
        variant: 'destructive',
      });
      return null;
    }
  };

  const markTaskComplete = async (taskId: string) => {
    if (!state.user) return null;

    try {
      const completedTaskResult = completeTask(taskId, state.user.id);
      if (!completedTaskResult) return null;

      setTasks(prev => prev.map(task => task.id === taskId ? completedTaskResult : task));
      toast({
        title: 'Success',
        description: 'Task marked as completed',
      });
      return completedTaskResult;
    } catch (error) {
      console.error('Error completing task:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete task',
        variant: 'destructive',
      });
      return null;
    }
  };

  const assignTask = async (taskId: string, assigneeId: string, assigneeName: string) => {
    if (!state.user || state.user.role !== 'organizer') {
      toast({
        title: 'Permission denied',
        description: 'Only organizers can assign tasks',
        variant: 'destructive',
      });
      return null;
    }

    try {
      const updatedTask = updateTask(taskId, { 
        assignedTo: assigneeId,
        assigneeName: assigneeName 
      });
      
      if (!updatedTask) return null;

      setTasks(prev => prev.map(task => task.id === taskId ? updatedTask : task));
      toast({
        title: 'Success',
        description: `Task assigned to ${assigneeName}`,
      });
      return updatedTask;
    } catch (error) {
      console.error('Error assigning task:', error);
      toast({
        title: 'Error',
        description: 'Failed to assign task',
        variant: 'destructive',
      });
      return null;
    }
  };

  const getTasksByStatus = () => {
    const pending = tasks.filter(task => task.status === 'pending');
    const inProgress = tasks.filter(task => task.status === 'in-progress');
    const completed = tasks.filter(task => task.status === 'completed');
    const cancelled = tasks.filter(task => task.status === 'cancelled');
    
    return { pending, inProgress, completed, cancelled };
  };

  return {
    tasks,
    loading,
    addTask,
    updateTaskStatus,
    markTaskComplete,
    assignTask,
    refreshTasks: loadTasks,
    getTasksByStatus
  };
}
