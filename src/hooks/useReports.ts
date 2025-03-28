
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { generateReport, getOrganizerReports } from '@/utils/auth';

export function useReports() {
  const { state } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadReports = async () => {
    if (!state.user || state.user.role !== 'organizer') {
      toast({
        title: 'Permission denied',
        description: 'Only organizers can access reports',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const organizerReports = getOrganizerReports(state.user.id);
      setReports(organizerReports);
    } catch (error) {
      console.error('Error loading reports:', error);
      toast({
        title: 'Error',
        description: 'Failed to load reports',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createReport = async (reportType: string, filters?: any) => {
    if (!state.user || state.user.role !== 'organizer') {
      toast({
        title: 'Permission denied',
        description: 'Only organizers can generate reports',
        variant: 'destructive',
      });
      return null;
    }

    setLoading(true);
    try {
      const report = generateReport(reportType, state.user.id, filters);
      setReports(prev => [...prev, report]);
      toast({
        title: 'Success',
        description: `${reportType} report generated successfully`,
      });
      return report;
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate report',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const exportReportToCsv = (reportId: string) => {
    const report = reports.find((r: any) => r.id === reportId);
    if (!report) {
      toast({
        title: 'Error',
        description: 'Report not found',
        variant: 'destructive',
      });
      return;
    }

    // Simplified CSV export (in a real app, you'd use a library)
    try {
      let csvContent = '';
      const reportData = report.data;
      
      // Determine what type of data we're exporting
      if (reportData.events) {
        csvContent = 'ID,Title,Date,Location,Participants\n';
        reportData.events.forEach((event: any) => {
          csvContent += `${event.id},"${event.title}","${event.date}","${event.location}",${event.participants}\n`;
        });
      } else if (reportData.volunteers) {
        csvContent = 'ID,Name,Email,Registration Date\n';
        reportData.volunteers.forEach((volunteer: any) => {
          csvContent += `${volunteer.id},"${volunteer.name}","${volunteer.email}","${volunteer.createdAt}"\n`;
        });
      } else if (reportData.tasks) {
        csvContent = 'ID,Title,Status,Priority,Due Date\n';
        reportData.tasks.forEach((task: any) => {
          csvContent += `${task.id},"${task.title}","${task.status}","${task.priority}","${task.dueDate || ''}"\n`;
        });
      }
      
      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `report-${report.type}-${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Export successful',
        description: 'Report downloaded as CSV',
      });
    } catch (error) {
      console.error('Error exporting report:', error);
      toast({
        title: 'Error',
        description: 'Failed to export report',
        variant: 'destructive',
      });
    }
  };

  return {
    reports,
    loading,
    loadReports,
    createReport,
    exportReportToCsv
  };
}
