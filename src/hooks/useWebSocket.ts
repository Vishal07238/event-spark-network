
import { UseWebSocketOptions, UseWebSocketReturn } from './websocket/types';
import { useWebSocketCore } from './websocket/useWebSocketCore';

export type { WebSocketStatus } from './websocket/types';

/**
 * Primary hook for WebSocket functionality with performance optimizations
 * 
 * Provides real-time communication capabilities with:
 * - Message buffering for better performance
 * - Connection pooling to reuse connections
 * - Automatic reconnection with exponential backoff
 * - Heartbeat mechanism to detect disconnections
 * 
 * @param url - WebSocket endpoint URL
 * @param options - Configuration options for the connection
 * @returns WebSocket connection state and methods
 */
export function useWebSocket(url: string, options: UseWebSocketOptions = {}): UseWebSocketReturn {
  return useWebSocketCore(url, options);
}
