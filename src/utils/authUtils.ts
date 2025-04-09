
// This would be an environment variable in a real app
export const JWT_SECRET = 'your-secret-key-would-be-in-env-file';

// Storage keys
export const USERS_STORAGE_KEY = 'volunteer_hub_users';
export const EVENTS_STORAGE_KEY = 'volunteer_hub_events';
export const TASKS_STORAGE_KEY = 'volunteer_hub_tasks';
export const MESSAGES_STORAGE_KEY = 'volunteer_hub_messages';
export const REPORTS_STORAGE_KEY = 'volunteer_hub_reports';
export const VOLUNTEERS_STORAGE_KEY = 'volunteer_hub_volunteers';

// List of authorized organizer emails
export const AUTHORIZED_ORGANIZER_EMAILS = [
  'organizer@example.com',
  // Add other authorized organizer emails here
];

// Simple browser-compatible JWT implementation for demo purposes
export const createToken = (payload: any): string => {
  // In a real app, you would use a proper JWT library like jose
  // This is a simplified implementation for demo purposes
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = btoa(
    JSON.stringify({ data: `${header}.${encodedPayload}`, secret: JWT_SECRET })
  );
  
  return `${header}.${encodedPayload}.${signature}`;
};

export const parseToken = (token: string): any | null => {
  try {
    // In a real app, you would verify the signature
    // This is a simplified implementation for demo purposes
    const [, payload] = token.split('.');
    return JSON.parse(atob(payload));
  } catch (error) {
    console.error('Token parsing failed:', error);
    return null;
  }
};

// Initialize localStorage with mock data if it doesn't exist
export const initializeLocalStorage = (storageKey: string, initialData: any) => {
  if (!localStorage.getItem(storageKey)) {
    console.log(`Initializing localStorage with data for ${storageKey}`);
    localStorage.setItem(storageKey, JSON.stringify(initialData));
  }
};

// Get data from localStorage
export const getStorageData = (storageKey: string): Array<any> => {
  return JSON.parse(localStorage.getItem(storageKey) || '[]');
};

// Save data to localStorage
export const saveStorageData = (storageKey: string, data: Array<any>): void => {
  localStorage.setItem(storageKey, JSON.stringify(data));
};
