
import { 
  initializeLocalStorage, 
  getStorageData, 
  saveStorageData, 
  REPORTS_STORAGE_KEY 
} from './authUtils';
import { getAllEvents } from './eventManagement';
import { getAllTasks } from './taskManagement';
import { getUsers } from './userAuth';

// Initialize reports in localStorage if needed
const initializeReports = () => {
  initializeLocalStorage(REPORTS_STORAGE_KEY, []);
};

// Generate and save a report
export const generateReport = (reportType: string, organizerId: string, filters?: any): any => {
  initializeReports();
  const reports = getStorageData(REPORTS_STORAGE_KEY);
  
  // Get data based on report type
  let reportData;
  switch (reportType) {
    case 'events':
      const events = getAllEvents().filter((e: any) => e.organizerId === organizerId);
      reportData = { events };
      break;
    case 'volunteers':
      const users = getUsers().filter((u: any) => u.role === 'volunteer');
      reportData = { volunteers: users };
      break;
    case 'tasks':
      const tasks = getAllTasks().filter((t: any) => t.createdBy === organizerId);
      reportData = { tasks };
      break;
    default:
      reportData = {};
  }
  
  // Create report object
  const newReport = {
    id: `report-${Date.now()}`,
    type: reportType,
    createdBy: organizerId,
    timestamp: new Date().toISOString(),
    data: reportData,
    filters
  };
  
  reports.push(newReport);
  saveStorageData(REPORTS_STORAGE_KEY, reports);
  return newReport;
};

// Get all reports for an organizer
export const getOrganizerReports = (organizerId: string): Array<any> => {
  initializeReports();
  const reports = getStorageData(REPORTS_STORAGE_KEY);
  return reports.filter((r: any) => r.createdBy === organizerId);
};
