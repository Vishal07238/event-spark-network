
import { useToast } from '@/hooks/use-toast';

/**
 * Parses incoming WebSocket message data
 * @param data - Raw data from WebSocket
 * @returns Parsed data object or original data if parsing fails
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
 * Calculates backoff time for reconnection attempts using exponential strategy
 * @param baseInterval - Base interval in milliseconds
 * @param attemptNumber - Current reconnection attempt number
 * @returns Calculated backoff time in milliseconds
 */
export function calculateBackoffTime(baseInterval: number, attemptNumber: number): number {
  return baseInterval * Math.pow(1.5, attemptNumber - 1);
}

/**
 * Shows a connection error toast with a descriptive message and action
 * @param toast - Toast function from useToast hook
 */
export function showConnectionErrorToast(toast: ReturnType<typeof useToast>['toast']): void {
  toast({
    title: "Connection error",
    description: "Failed to establish a real-time connection. Some features may be limited.",
    variant: "destructive",
    duration: 5000,
  });
}

/**
 * Shows a maximum reconnection attempts reached toast with recovery options
 * @param toast - Toast function from useToast hook
 */
export function showMaxReconnectAttemptsToast(toast: ReturnType<typeof useToast>['toast']): void {
  toast({
    title: "Connection failed",
    description: "Maximum reconnect attempts reached. Please check your internet connection and try again.",
    variant: "destructive",
    duration: 7000,
  });
}

/**
 * Shows a network status change toast
 * @param toast - Toast function from useToast hook
 * @param isOnline - Whether the network is online
 */
export function showNetworkStatusToast(toast: ReturnType<typeof useToast>['toast'], isOnline: boolean): void {
  if (isOnline) {
    toast({
      title: "Network connected",
      description: "Your internet connection has been restored. Reconnecting...",
      duration: 3000,
    });
  } else {
    toast({
      title: "Network disconnected",
      description: "You are currently offline. Real-time updates will resume when your connection is restored.",
      variant: "destructive",
      duration: 5000,
    });
  }
}

/**
 * Helper to determine if a WebSocket error is recoverable
 * @param event - WebSocket error event
 * @returns Whether the error is likely recoverable
 */
export function isRecoverableError(event: Event): boolean {
  // Check for common recoverable error types
  if (event instanceof ErrorEvent) {
    // Network timeout or temporary disconnection errors are recoverable
    return event.message.includes('timeout') || 
           event.message.includes('network') ||
           event.message.includes('connection');
  }
  return true; // Default to assuming error is recoverable
}

/**
 * Returns human-readable description for WebSocket close codes
 * @param code - WebSocket close code
 * @returns Human-readable description of the close reason
 */
export function getCloseReasonText(code: number): string {
  switch (code) {
    case 1000:
      return "Normal closure";
    case 1001:
      return "Server going down or browser navigating away";
    case 1002:
      return "Protocol error";
    case 1003:
      return "Unsupported data";
    case 1004:
      return "Reserved";
    case 1005:
      return "No status received";
    case 1006:
      return "Abnormal closure, possibly network issue";
    case 1007:
      return "Invalid frame payload data";
    case 1008:
      return "Policy violation";
    case 1009:
      return "Message too big";
    case 1010:
      return "Missing extension";
    case 1011:
      return "Internal server error";
    case 1012:
      return "Service restart";
    case 1013:
      return "Try again later";
    case 1014:
      return "Bad gateway";
    case 1015:
      return "TLS handshake failure";
    default:
      return "Unknown close reason";
  }
}
