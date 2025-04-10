
import { motion } from "framer-motion";
import { Loader, RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WebSocketStatus } from "@/hooks/websocket/types";

interface RealtimeStatusProps {
  isRealtimeEnabled: boolean;
  realtimeStatus: WebSocketStatus;
  toggleRealtime: () => void;
  forceReconnect: () => void;
  lastUpdate: Date | null;
}

export default function RealtimeStatus({
  isRealtimeEnabled = false,
  realtimeStatus = 'closed',
  toggleRealtime = () => {},
  forceReconnect = () => {},
  lastUpdate = null
}: RealtimeStatusProps) {
  // Format timestamp for display
  const formatLastUpdate = () => {
    if (!lastUpdate) return "Never";
    
    const now = new Date();
    const diff = now.getTime() - lastUpdate.getTime();
    
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    return lastUpdate.toLocaleTimeString();
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        <div className="text-sm text-muted-foreground mr-2">
          Last update: {formatLastUpdate()}
        </div>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => forceReconnect()}
          aria-label="Refresh data"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <Button 
        variant={isRealtimeEnabled ? "default" : "outline"}
        size="sm"
        onClick={toggleRealtime}
        className="relative"
      >
        {isRealtimeEnabled ? (
          <>
            <span className="mr-2">Live Updates</span>
            {realtimeStatus === 'connecting' ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : realtimeStatus === 'open' ? (
              <motion.div
                className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            ) : (
              <WifiOff className="h-4 w-4" />
            )}
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4 mr-2" />
            <span>Enable Live</span>
          </>
        )}
      </Button>
    </div>
  );
}
