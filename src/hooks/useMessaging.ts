
import { useState, useEffect } from 'react';
import { messagingService } from '@/services/messaging';
import { Message } from '@/types/messaging';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';

export function useMessaging() {
  const { state } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState<Message | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!state.user) return;

    // Set the user ID in the messaging service
    messagingService.setUserId(state.user.id);

    // Load initial messages
    loadMessages();

    // Subscribe to new messages
    const unsubscribe = messagingService.subscribe((message) => {
      setNewMessage(message);
      setMessages(prev => [...prev, message]);
      
      toast({
        title: `New message from ${message.senderName}`,
        description: message.subject || message.content.substring(0, 50) + (message.content.length > 50 ? '...' : ''),
      });
    });

    return () => {
      unsubscribe();
      messagingService.disconnect();
    };
  }, [state.user, toast]);

  const loadMessages = async () => {
    if (!state.user) return;
    
    setLoading(true);
    try {
      const userMessages = messagingService.getMessages(state.user.id);
      setMessages(userMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (recipientId: string, recipientName: string, content: string, subject?: string) => {
    if (!state.user) return null;
    
    try {
      const message = await messagingService.sendMessage({
        senderId: state.user.id,
        senderName: state.user.name,
        recipientId,
        recipientName,
        content,
        subject
      });
      
      setMessages(prev => [...prev, message]);
      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  };

  // Group messages by thread (conversation between two users)
  const getThreads = () => {
    const threads = new Map();
    
    messages.forEach(message => {
      const otherUser = message.senderId === state.user?.id ? message.recipientId : message.senderId;
      const otherUserName = message.senderId === state.user?.id ? message.recipientName : message.senderName;
      
      const threadId = [state.user?.id, otherUser].sort().join('-');
      
      if (!threads.has(threadId)) {
        threads.set(threadId, {
          id: threadId,
          participants: [state.user?.id, otherUser],
          participantNames: {
            [state.user?.id || '']: state.user?.name || '',
            [otherUser]: otherUserName
          },
          messages: [],
          lastMessageTime: '',
          unreadCount: 0
        });
      }
      
      const thread = threads.get(threadId);
      thread.messages.push(message);
      
      // Update last message time
      if (!thread.lastMessageTime || new Date(message.timestamp) > new Date(thread.lastMessageTime)) {
        thread.lastMessageTime = message.timestamp;
      }
      
      // Count unread messages
      if (message.recipientId === state.user?.id && !message.isRead) {
        thread.unreadCount++;
      }
    });
    
    // Sort threads by last message time (newest first)
    return Array.from(threads.values()).sort((a, b) => 
      new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    );
  };

  return {
    messages,
    loading,
    newMessage,
    sendMessage,
    refreshMessages: loadMessages,
    getThreads
  };
}
