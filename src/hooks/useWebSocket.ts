
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

  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) return;
    
    try {
      setStatus('connecting');
      const ws = new WebSocket(url);
      socketRef.current = ws;
      
      ws.onopen = (event) => {
        setStatus('open');
        reconnectAttemptsRef.current = 0;
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
        setStatus('closed');
        if (options.onClose) options.onClose(event);
        
        // Attempt to reconnect if not explicitly closed
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          setTimeout(() => connect(), reconnectInterval);
        }
      };
      
      ws.onerror = (event) => {
        setStatus('error');
        console.error('WebSocket error:', event);
        if (options.onError) options.onError(event);
        toast({
          title: "Connection error",
          description: "Failed to establish a real-time connection. Some features may be limited.",
          variant: "destructive",
        });
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setStatus('error');
    }
  }, [url, options, reconnectInterval, maxReconnectAttempts, toast]);
  
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close(1000, 'User initiated disconnect');
      socketRef.current = null;
    }
  }, []);
  
  const send = useCallback((data: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const message = typeof data === 'object' ? JSON.stringify(data) : data;
      socketRef.current.send(message);
      return true;
    }
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
