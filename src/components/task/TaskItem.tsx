
import React from "react";
import { Task } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { completeTask } from "@/utils/taskManagement";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface TaskItemProps {
  task: Task;
  onTaskComplete: () => void;
}

const TaskItem = ({ task, onTaskComplete }: TaskItemProps) => {
  const { state } = useAuth();
  const { toast } = useToast();
  
  const handleMarkComplete = () => {
    if (!state.user) return;
    
    const completedTask = completeTask(task.id, state.user.id);
    
    if (completedTask) {
      toast({
        title: "Task completed",
        description: "Great job! The task has been marked as completed.",
        variant: "default",
      });
      
      onTaskComplete();
    } else {
      toast({
        title: "Error",
        description: "Failed to mark task as completed. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const formattedDate = task.dueDate ? format(new Date(task.dueDate), 'PPP') : 'No due date';
  
  return (
    <div className="flex items-start space-x-4 py-4 border-b last:border-0">
      {task.status === "completed" ? (
        <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
      ) : (
        <Circle className="h-6 w-6 text-muted-foreground shrink-0 mt-0.5" />
      )}
      
      <div className="flex-1 min-width-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <div>
            <h4 className="font-medium">{task.title}</h4>
            <p className="text-sm text-muted-foreground">
              {task.eventTitle ? `Event: ${task.eventTitle}` : 'General Task'}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"}
            >
              {task.priority} priority
            </Badge>
            
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              {formattedDate}
            </div>
            
            {task.status === "pending" && task.assignedTo === state.user?.id && (
              <Button 
                size="sm" 
                variant="outline" 
                className="ml-auto flex items-center gap-1"
                onClick={handleMarkComplete}
              >
                <CheckCircle2 className="h-4 w-4" />
                Mark as Completed
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
