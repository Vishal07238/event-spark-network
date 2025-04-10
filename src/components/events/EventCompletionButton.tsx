
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { markEventAsCompleted, hasUserCompletedEvent } from "@/utils/eventManagement";
import { useToast } from "@/hooks/use-toast";

interface EventCompletionButtonProps {
  eventId: number;
  onEventComplete: () => void;
}

const EventCompletionButton = ({ eventId, onEventComplete }: EventCompletionButtonProps) => {
  const { state } = useAuth();
  const { toast } = useToast();
  const [isCompleted, setIsCompleted] = React.useState(false);
  
  React.useEffect(() => {
    if (state.user) {
      const completed = hasUserCompletedEvent(eventId, state.user.id);
      setIsCompleted(completed);
    }
  }, [eventId, state.user]);
  
  const handleMarkComplete = () => {
    if (!state.user) return;
    
    const updatedEvent = markEventAsCompleted(eventId, state.user.id);
    
    if (updatedEvent) {
      setIsCompleted(true);
      toast({
        title: "Event completed",
        description: "Great job! The event has been marked as completed.",
        variant: "default",
      });
      
      onEventComplete();
    } else {
      toast({
        title: "Error",
        description: "Failed to mark event as completed. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (isCompleted) {
    return (
      <Button disabled variant="outline" className="flex items-center gap-1">
        <CheckCircle2 className="h-4 w-4 text-primary" />
        Completed
      </Button>
    );
  }
  
  return (
    <Button 
      variant="outline" 
      className="flex items-center gap-1"
      onClick={handleMarkComplete}
    >
      <CheckCircle2 className="h-4 w-4" />
      Mark as Completed
    </Button>
  );
};

export default EventCompletionButton;
