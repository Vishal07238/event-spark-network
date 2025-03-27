
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
