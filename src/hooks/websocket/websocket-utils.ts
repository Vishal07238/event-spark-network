
import { useToast } from '@/hooks/use-toast';

/**
 * Parses incoming WebSocket message data
 */
export function parseWebSocketData(data: any): any {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  }
  return data;
}

/**
 * Calculates backoff time for reconnection attempts
 */
export function calculateBackoffTime(baseInterval: number, attemptNumber: number): number {
  return baseInterval * Math.pow(1.5, attemptNumber - 1);
}

/**
 * Shows a connection error toast
 */
export function showConnectionErrorToast(toast: ReturnType<typeof useToast>['toast']): void {
  toast({
    title: "Connection error",
    description: "Failed to establish a real-time connection. Some features may be limited.",
    variant: "destructive",
  });
}

/**
 * Shows a maximum reconnection attempts reached toast
 */
export function showMaxReconnectAttemptsToast(toast: ReturnType<typeof useToast>['toast']): void {
  toast({
    title: "Connection failed",
    description: "Maximum reconnect attempts reached. Please try again later.",
    variant: "destructive",
  });
}
