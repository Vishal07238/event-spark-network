
import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  WebSocketStatus, 
  UseWebSocketOptions, 
  UseWebSocketReturn 
} from './types';
import {
  parseWebSocketData,
  calculateBackoffTime,
  showConnectionErrorToast,
  showMaxReconnectAttemptsToast,
  showNetworkStatusToast
} from './websocket-utils';

/**
 * Core WebSocket hook that provides real-time communication capabilities
 * with enhanced error handling, reconnection logic, and performance optimizations.
 * 
 * @param url - WebSocket endpoint URL
 * @param options - Configuration options for the WebSocket connection
 * @returns WebSocket connection state and control methods
 */
export function useWebSocketCore(url: string, options: UseWebSocketOptions = {}): UseWebSocketReturn {
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
  
  // Message buffering for performance optimization
  const messageBufferRef = useRef<any[]>([]);
  const isBufferingRef = useRef<boolean>(false);
  const flushIntervalRef = useRef<number | null>(null);
  const bufferSizeRef = useRef<number>(0);
  const MAX_BUFFER_SIZE = options.maxBufferSize || 50;
  const FLUSH_INTERVAL = options.flushInterval || 300; // ms
  
  // Connection pool reference (for future implementation)
  const connectionPoolRef = useRef<Map<string, WebSocket>>(new Map());

  /**
   * Flushes the message buffer, processing all queued messages at once
   * to optimize performance and reduce UI updates
   */
  const flushMessageBuffer = useCallback(() => {
    if (messageBufferRef.current.length === 0) {
      isBufferingRef.current = false;
      return;
    }
    
    console.log(`Flushing ${messageBufferRef.current.length} buffered WebSocket messages`);
    
    // Process all messages in buffer at once
    const allMessages = [...messageBufferRef.current];
    messageBufferRef.current = [];
    bufferSizeRef.current = 0;
    
    // Group similar message types
    const messagesByType: Record<string, any[]> = {};
    
    allMessages.forEach(msg => {
      const type = msg?.type || 'unknown';
      if (!messagesByType[type]) {
        messagesByType[type] = [];
      }
      messagesByType[type].push(msg);
    });
    
    // Set the most recent message as current data
    if (allMessages.length > 0) {
      setData(allMessages[allMessages.length - 1]);
    }
    
    // Call onMessage for each type with grouped messages
    if (options.onMessage) {
      Object.entries(messagesByType).forEach(([type, messages]) => {
        // Only for types with multiple messages, pass the array
        if (messages.length > 1) {
          options.onMessage?.({
            type: `${type}_batch`,
            messages: messages,
            count: messages.length
          });
        } else {
          // For single messages, pass normally
          options.onMessage?.(messages[0]);
        }
      });
    }
    
    isBufferingRef.current = false;
  }, [options]);

  /**
   * Buffers incoming WebSocket messages for batch processing
   * to reduce UI updates and improve performance
   */
  const bufferMessage = useCallback((message: any) => {
    messageBufferRef.current.push(message);
    bufferSizeRef.current += 1;
    
    // Start buffering if not already
    if (!isBufferingRef.current) {
      isBufferingRef.current = true;
      flushIntervalRef.current = window.setTimeout(flushMessageBuffer, FLUSH_INTERVAL);
    }
    
    // Force flush if buffer size exceeds maximum
    if (bufferSizeRef.current >= MAX_BUFFER_SIZE) {
      if (flushIntervalRef.current) {
        clearTimeout(flushIntervalRef.current);
        flushIntervalRef.current = null;
      }
      flushMessageBuffer();
    }
  }, [flushMessageBuffer, FLUSH_INTERVAL, MAX_BUFFER_SIZE]);

  /**
   * Sends a heartbeat message to keep the connection alive
   */
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

  /**
   * Handles incoming WebSocket messages with buffering for performance
   */
  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const parsedData = parseWebSocketData(event.data);
      
      // Handle heartbeat responses immediately without buffering
      if (parsedData && parsedData.type === 'heartbeat_response') {
        console.log('Heartbeat acknowledged');
        return;
      }
      
      // Buffer regular messages for batch processing
      bufferMessage(parsedData);
    } catch (error) {
      console.error('Failed to process WebSocket message:', error);
      setData(event.data);
      
      if (options.onMessage) {
        options.onMessage(event.data);
      }
    }
  }, [options, bufferMessage]);

  /**
   * Enhanced connection function with better error handling, heartbeat, and connection pooling
   */
  const connect = useCallback(() => {
    // Prevent multiple concurrent connection attempts
    if (socketRef.current?.readyState === WebSocket.OPEN || connectingRef.current) return;
    
    try {
      connectingRef.current = true;
      setStatus('connecting');
      console.log('Connecting to WebSocket:', url);
      
      // Check connection pool first (future optimization)
      if (connectionPoolRef.current.has(url) && 
          connectionPoolRef.current.get(url)?.readyState === WebSocket.OPEN) {
        console.log('Using existing connection from pool');
        socketRef.current = connectionPoolRef.current.get(url) || null;
        setStatus('open');
        reconnectAttemptsRef.current = 0;
        connectingRef.current = false;
        return;
      }
      
      const ws = new WebSocket(url);
      socketRef.current = ws;
      
      ws.onopen = (event) => {
        console.log('WebSocket connection established');
        setStatus('open');
        reconnectAttemptsRef.current = 0;
        connectingRef.current = false;
        
        // Add to connection pool for future reuse
        connectionPoolRef.current.set(url, ws);
        
        // Set up heartbeat after successful connection
        if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
        heartbeatTimerRef.current = window.setInterval(sendHeartbeat, heartbeatInterval);
        
        if (options.onOpen) options.onOpen(event);
      };
      
      ws.onmessage = handleMessage;
      
      ws.onclose = (event) => {
        console.log('WebSocket connection closed. Code:', event.code, 'Reason:', event.reason);
        setStatus('closed');
        connectingRef.current = false;
        
        // Remove from connection pool
        connectionPoolRef.current.delete(url);
        
        // Clear heartbeat timer
        if (heartbeatTimerRef.current) {
          clearInterval(heartbeatTimerRef.current);
          heartbeatTimerRef.current = null;
        }
        
        // Clear any pending message flush
        if (flushIntervalRef.current) {
          clearTimeout(flushIntervalRef.current);
          flushIntervalRef.current = null;
          // Make sure to flush any remaining messages
          if (messageBufferRef.current.length > 0) {
            flushMessageBuffer();
          }
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
          const backoffTime = calculateBackoffTime(reconnectInterval, reconnectAttemptsRef.current);
          console.log(`Using backoff time of ${backoffTime}ms`);
          
          reconnectTimerRef.current = window.setTimeout(() => {
            connect();
          }, backoffTime);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          showMaxReconnectAttemptsToast(toast);
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
      showConnectionErrorToast(toast);
    }
  }, [url, options, reconnectInterval, maxReconnectAttempts, toast, heartbeatInterval, sendHeartbeat, status, handleMessage, flushMessageBuffer]);
  
  /**
   * Enhanced disconnect with better cleanup of resources
   */
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
    
    // Clear message buffer and flush timer
    if (flushIntervalRef.current !== null) {
      clearTimeout(flushIntervalRef.current);
      flushIntervalRef.current = null;
    }
    
    // Flush any remaining messages before disconnecting
    if (messageBufferRef.current.length > 0) {
      flushMessageBuffer();
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
  }, [flushMessageBuffer]);
  
  /**
   * Enhanced send with better error handling, status checking, and queuing for offline scenarios
   */
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
  
  /**
   * Force reconnection - useful for handling errors or network changes
   */
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
      showNetworkStatusToast(toast, true);
      reconnect();
    };
    
    const handleOffline = () => {
      console.log('Network went offline, disconnecting...');
      showNetworkStatusToast(toast, false);
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
  }, [connect, disconnect, options.autoConnect, reconnect, toast]);
  
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
