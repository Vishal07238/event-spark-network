
import { UseWebSocketOptions, UseWebSocketReturn } from './websocket/types';
import { useWebSocketCore } from './websocket/useWebSocketCore';

export type { WebSocketStatus } from './websocket/types';

export function useWebSocket(url: string, options: UseWebSocketOptions = {}): UseWebSocketReturn {
  return useWebSocketCore(url, options);
}
