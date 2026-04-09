import { DisasterReport, Alert } from '../types';

const REPORTS_KEY = 'disaster_assist_reports';
const ALERTS_KEY = 'disaster_assist_alerts';

export const storage = {
  getReports: (): DisasterReport[] => {
    const data = localStorage.getItem(REPORTS_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveReport: (report: DisasterReport) => {
    const reports = storage.getReports();
    reports.unshift(report);
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  },
  updateReport: (updatedReport: DisasterReport) => {
    const reports = storage.getReports();
    const index = reports.findIndex(r => r.id === updatedReport.id);
    if (index !== -1) {
      reports[index] = updatedReport;
      localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
    }
  },
  getAlerts: (): Alert[] => {
    const data = localStorage.getItem(ALERTS_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveAlert: (alert: Alert) => {
    const alerts = storage.getAlerts();
    alerts.unshift(alert);
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts.slice(0, 50))); // Keep last 50
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
  },
  clearAll: () => {
    localStorage.removeItem(REPORTS_KEY);
    localStorage.removeItem(ALERTS_KEY);
  }
};
