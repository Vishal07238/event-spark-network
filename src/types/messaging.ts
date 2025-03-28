
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  subject?: string;
}

export interface MessageThread {
  id: string;
  participants: string[];
  messages: Message[];
  lastMessageTime: string;
  unreadCount: number;
}
