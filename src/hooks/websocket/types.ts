
// WebSocket connection states
export type WebSocketStatus = 'connecting' | 'open' | 'closed' | 'error';

export interface UseWebSocketOptions {
  onOpen?: (event: Event) => void;
  onMessage?: (data: any) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  autoConnect?: boolean;
  heartbeatInterval?: number;
  // New options for performance optimization
  maxBufferSize?: number;        // Maximum messages to buffer before forcing flush
  flushInterval?: number;        // Time in ms to wait before flushing messages
  connectionPoolSize?: number;   // Max number of pooled connections
}

export interface UseWebSocketReturn {
  status: WebSocketStatus;
  data: any;
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
  send: (data: any) => boolean;
  isConnected: boolean;
}
