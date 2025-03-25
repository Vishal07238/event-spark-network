
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EventsHeaderProps {
  realtimeEnabled?: boolean;
  toggleRealtime?: () => void;
  realtimeStatus?: 'connecting' | 'open' | 'closed' | 'error';
}

export default function EventsHeader({ 
  realtimeEnabled, 
  toggleRealtime,
  realtimeStatus
}: EventsHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <header className="bg-accent py-8">
      <div className="container max-w-6xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Volunteer Events</h1>
            <p className="text-muted-foreground mt-2">
              Find opportunities to make a difference in your community
            </p>
          </div>
          
          {toggleRealtime && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={realtimeEnabled} 
                      onCheckedChange={toggleRealtime} 
                      id="realtime-mode"
                    />
                    <label 
                      htmlFor="realtime-mode" 
                      className="text-sm cursor-pointer flex items-center"
                    >
                      {realtimeEnabled ? (
                        <>
                          <Wifi className="h-4 w-4 mr-1" />
                          <span>Live Updates</span>
                        </>
                      ) : (
                        <>
                          <WifiOff className="h-4 w-4 mr-1" />
                          <span>Updates Paused</span>
                        </>
                      )}
                      
                      {realtimeEnabled && realtimeStatus && (
                        <Badge 
                          variant="outline" 
                          className={`ml-2 ${
                            realtimeStatus === 'open' 
                              ? 'bg-green-50 text-green-700 border-green-200' 
                              : realtimeStatus === 'connecting'
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                          }`}
                        >
                          {realtimeStatus === 'open' ? 'Connected' : 
                           realtimeStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
                        </Badge>
                      )}
                    </label>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {realtimeEnabled 
                    ? "You'll receive instant updates when new events are posted"
                    : "Turn on to receive instant updates when new events are posted"
                  }
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </header>
  );
}
