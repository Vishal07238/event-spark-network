import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

// WebSocket connection states
export type WebSocketStatus = 'connecting' | 'open' | 'closed' | 'error';

interface UseWebSocketOptions {
  onOpen?: (event: Event) => void;
  onMessage?: (data: any) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  autoConnect?: boolean;
  heartbeatInterval?: number;
}

export function useWebSocket(url: string, options: UseWebSocketOptions = {}) {
  const [status, setStatus] = useState<WebSocketStatus>('closed');
  const [data, setData] = useState<any>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = options.reconnectAttempts || 5;
  const reconnectInterval = options.reconnectInterval || 3000;
  const heartbeatInterval = options.heartbeatInterval || 30000; // Default 30s heartbeat
  const { toast } = useToast();
  const reconnectTimerRef = useRef<number | null>(null);
  const heartbeatTimerRef = useRef<number | null>(null);
  const connectingRef = useRef(false);

  // Send a heartbeat to keep the connection alive
  const sendHeartbeat = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      try {
        socketRef.current.send(JSON.stringify({ type: 'heartbeat' }));
        console.log('Heartbeat sent');
      } catch (err) {
        console.error('Failed to send heartbeat:', err);
      }
    }
  }, []);

  // Enhanced connection function with better error handling and heartbeat
  const connect = useCallback(() => {
    // Prevent multiple concurrent connection attempts
    if (socketRef.current?.readyState === WebSocket.OPEN || connectingRef.current) return;
    
    try {
      connectingRef.current = true;
      setStatus('connecting');
      console.log('Connecting to WebSocket:', url);
      
      const ws = new WebSocket(url);
      socketRef.current = ws;
      
      ws.onopen = (event) => {
        console.log('WebSocket connection established');
        setStatus('open');
        reconnectAttemptsRef.current = 0;
        connectingRef.current = false;
        
        // Set up heartbeat after successful connection
        if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
        heartbeatTimerRef.current = window.setInterval(sendHeartbeat, heartbeatInterval);
        
        if (options.onOpen) options.onOpen(event);
      };
      
      ws.onmessage = (event) => {
        try {
          // If message is a string, try to parse it as JSON
          let parsedData;
          if (typeof event.data === 'string') {
            try {
              parsedData = JSON.parse(event.data);
            } catch (e) {
              parsedData = event.data;
            }
          } else {
            parsedData = event.data;
          }
          
          // Handle heartbeat responses if needed
          if (parsedData && parsedData.type === 'heartbeat_response') {
            console.log('Heartbeat acknowledged');
            return;
          }
          
          setData(parsedData);
          if (options.onMessage) options.onMessage(parsedData);
        } catch (error) {
          console.error('Failed to process WebSocket message:', error);
          setData(event.data);
          if (options.onMessage) options.onMessage(event.data);
        }
      };
      
      ws.onclose = (event) => {
        console.log('WebSocket connection closed. Code:', event.code, 'Reason:', event.reason);
        setStatus('closed');
        connectingRef.current = false;
        
        // Clear heartbeat timer
        if (heartbeatTimerRef.current) {
          clearInterval(heartbeatTimerRef.current);
          heartbeatTimerRef.current = null;
        }
        
        if (options.onClose) options.onClose(event);
        
        // Attempt to reconnect if not explicitly closed (code 1000) and within retry limits
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          console.log(`Reconnect attempt ${reconnectAttemptsRef.current} of ${maxReconnectAttempts} in ${reconnectInterval}ms`);
          
          // Clear any existing reconnect timer
          if (reconnectTimerRef.current !== null) {
            clearTimeout(reconnectTimerRef.current);
          }
          
          // Use exponential backoff for retries
          const backoffTime = reconnectInterval * Math.pow(1.5, reconnectAttemptsRef.current - 1);
          console.log(`Using backoff time of ${backoffTime}ms`);
          
          reconnectTimerRef.current = window.setTimeout(() => {
            connect();
          }, backoffTime);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          toast({
            title: "Connection failed",
            description: "Maximum reconnect attempts reached. Please try again later.",
            variant: "destructive",
          });
        }
      };
      
      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setStatus('error');
        connectingRef.current = false;
        if (options.onError) options.onError(event);
      };
      
      // Add timeout to connection attempt
      const connectionTimeout = setTimeout(() => {
        if (status === 'connecting') {
          console.warn('Connection attempt timed out');
          ws.close(4000, 'Connection timeout');
        }
      }, 10000); // 10 second timeout
      
      // Clear the timeout when connection is established or fails
      return () => clearTimeout(connectionTimeout);
      
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setStatus('error');
      connectingRef.current = false;
      toast({
        title: "Connection error",
        description: "Failed to establish a real-time connection. Some features may be limited.",
        variant: "destructive",
      });
    }
  }, [url, options, reconnectInterval, maxReconnectAttempts, toast, heartbeatInterval, sendHeartbeat, status]);
  
  // Enhanced disconnect with better cleanup
  const disconnect = useCallback(() => {
    console.log('Disconnecting WebSocket...');
    
    // Clear timers
    if (reconnectTimerRef.current !== null) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    
    if (heartbeatTimerRef.current !== null) {
      clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }
    
    // Reset state variables
    reconnectAttemptsRef.current = 0;
    connectingRef.current = false;
    
    // Close socket if it exists
    if (socketRef.current) {
      try {
        // Only close if not already closed
        if (socketRef.current.readyState !== WebSocket.CLOSED && 
            socketRef.current.readyState !== WebSocket.CLOSING) {
          socketRef.current.close(1000, 'User initiated disconnect');
        }
      } catch (err) {
        console.error('Error while closing WebSocket:', err);
      }
      socketRef.current = null;
    }
    
    setStatus('closed');
  }, []);
  
  // Enhanced send with better error handling and status checking
  const send = useCallback((data: any) => {
    if (!socketRef.current) {
      console.warn('Cannot send message, WebSocket is not initialized');
      return false;
    }
    
    if (socketRef.current.readyState === WebSocket.CONNECTING) {
      console.warn('Cannot send message, WebSocket is still connecting');
      return false;
    }
    
    if (socketRef.current.readyState === WebSocket.CLOSING || 
        socketRef.current.readyState === WebSocket.CLOSED) {
      console.warn('Cannot send message, WebSocket is closing or closed');
      return false;
    }
    
    try {
      const message = typeof data === 'object' ? JSON.stringify(data) : data;
      console.log('Sending WebSocket message:', message);
      socketRef.current.send(message);
      return true;
    } catch (err) {
      console.error('Error sending message:', err);
      return false;
    }
  }, []);
  
  // Force reconnection - useful for handling errors or network changes
  const reconnect = useCallback(() => {
    console.log('Forcing reconnection...');
    disconnect();
    // Small delay before reconnecting
    setTimeout(() => {
      reconnectAttemptsRef.current = 0; // Reset attempts 
      connect();
    }, 100);
  }, [connect, disconnect]);
  
  // Connect on mount if autoConnect is enabled (default is true)
  useEffect(() => {
    if (options.autoConnect !== false) {
      connect();
    }
    
    // Handle network status changes
    const handleOnline = () => {
      console.log('Network came online, reconnecting...');
      reconnect();
    };
    
    const handleOffline = () => {
      console.log('Network went offline, disconnecting...');
      disconnect();
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Cleanup on unmount
    return () => {
      disconnect();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [connect, disconnect, options.autoConnect, reconnect]);
  
  return {
    status,
    data,
    connect,
    disconnect,
    reconnect,
    send,
    isConnected: status === 'open'
  };
}
