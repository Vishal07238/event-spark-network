
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
}

export function useWebSocket(url: string, options: UseWebSocketOptions = {}) {
  const [status, setStatus] = useState<WebSocketStatus>('closed');
  const [data, setData] = useState<any>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = options.reconnectAttempts || 5;
  const reconnectInterval = options.reconnectInterval || 3000;
  const { toast } = useToast();
  const reconnectTimerRef = useRef<number | null>(null);
  const connectingRef = useRef(false);

  // Enhanced connection function with better error handling
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
        if (options.onOpen) options.onOpen(event);
      };
      
      ws.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data);
          setData(parsedData);
          if (options.onMessage) options.onMessage(parsedData);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
          setData(event.data);
          if (options.onMessage) options.onMessage(event.data);
        }
      };
      
      ws.onclose = (event) => {
        console.log('WebSocket connection closed. Code:', event.code, 'Reason:', event.reason);
        setStatus('closed');
        connectingRef.current = false;
        if (options.onClose) options.onClose(event);
        
        // Attempt to reconnect if not explicitly closed and within retry limits
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          console.log(`Reconnect attempt ${reconnectAttemptsRef.current} of ${maxReconnectAttempts} in ${reconnectInterval}ms`);
          
          // Clear any existing reconnect timer
          if (reconnectTimerRef.current !== null) {
            clearTimeout(reconnectTimerRef.current);
          }
          
          reconnectTimerRef.current = window.setTimeout(() => {
            connect();
          }, reconnectInterval);
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
  }, [url, options, reconnectInterval, maxReconnectAttempts, toast]);
  
  // Enhanced disconnect with better cleanup
  const disconnect = useCallback(() => {
    console.log('Disconnecting WebSocket...');
    
    // Clear any reconnection timers
    if (reconnectTimerRef.current !== null) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    
    // Reset connection state variables
    reconnectAttemptsRef.current = 0;
    connectingRef.current = false;
    
    // Close the socket if it exists
    if (socketRef.current) {
      try {
        // Only actually close if it's not already closed
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
  
  const send = useCallback((data: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const message = typeof data === 'object' ? JSON.stringify(data) : data;
      console.log('Sending WebSocket message:', message);
      socketRef.current.send(message);
      return true;
    }
    console.warn('Cannot send message, WebSocket is not connected');
    return false;
  }, []);
  
  // Connect on mount if autoConnect is enabled (default is true)
  useEffect(() => {
    if (options.autoConnect !== false) {
      connect();
    }
    
    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [connect, disconnect, options.autoConnect]);
  
  return {
    status,
    data,
    connect,
    disconnect,
    send,
    isConnected: status === 'open'
  };
}
