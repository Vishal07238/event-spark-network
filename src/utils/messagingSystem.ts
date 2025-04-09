
import { 
  initializeLocalStorage, 
  getStorageData, 
  saveStorageData, 
  MESSAGES_STORAGE_KEY 
} from './authUtils';

// Initialize messages in localStorage if needed
const initializeMessages = () => {
  initializeLocalStorage(MESSAGES_STORAGE_KEY, []);
};

// Get all messages
export const getAllMessages = (): Array<any> => {
  initializeMessages();
  return getStorageData(MESSAGES_STORAGE_KEY);
};

// Get messages for a specific user
export const getUserMessages = (userId: string): Array<any> => {
  const messages = getAllMessages();
  return messages.filter((message: any) => message.senderId === userId || message.recipientId === userId);
};

// Create a new message
export const sendMessage = (messageData: any): any => {
  const messages = getAllMessages();
  const newMessage = {
    ...messageData,
    id: `msg-${Date.now()}`,
    timestamp: new Date().toISOString(),
    isRead: false
  };
  
  messages.push(newMessage);
  saveStorageData(MESSAGES_STORAGE_KEY, messages);
  return newMessage;
};

// Mark message as read
export const markMessageAsRead = (messageId: string): any => {
  const messages = getAllMessages();
  const messageIndex = messages.findIndex((m: any) => m.id === messageId);
  
  if (messageIndex === -1) return null;
  
  messages[messageIndex].isRead = true;
  saveStorageData(MESSAGES_STORAGE_KEY, messages);
  return messages[messageIndex];
};
