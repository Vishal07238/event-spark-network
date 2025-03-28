
import { sendMessage, markMessageAsRead, getUserMessages } from '@/utils/auth';
import { Message } from '@/types/messaging';

export class MessagingService {
  private callbacks: Array<(message: Message) => void> = [];
  private intervalId: number | null = null;
  private userId: string | null = null;

  constructor() {
    // This simulates WebSocket functionality using localStorage
    this.intervalId = window.setInterval(() => {
      if (this.userId) {
        const messages = getUserMessages(this.userId);
        const unreadMessages = messages.filter((msg: Message) => !msg.isRead && msg.recipientId === this.userId);
        
        unreadMessages.forEach((message: Message) => {
          this.notifyListeners(message);
          markMessageAsRead(message.id);
        });
      }
    }, 3000) as unknown as number;
  }

  public setUserId(userId: string) {
    this.userId = userId;
  }

  public subscribe(callback: (message: Message) => void) {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  private notifyListeners(message: Message) {
    this.callbacks.forEach(callback => callback(message));
  }

  public sendMessage(message: Omit<Message, 'id' | 'timestamp' | 'isRead'>) {
    return sendMessage(message);
  }

  public getMessages(userId: string) {
    return getUserMessages(userId);
  }

  public disconnect() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const messagingService = new MessagingService();
