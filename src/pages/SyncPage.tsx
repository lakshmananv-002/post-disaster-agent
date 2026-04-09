import { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Wifi, 
  WifiOff, 
  Database, 
  CloudUpload,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { storage } from '../lib/storage';
import { DisasterReport } from '../types';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

export default function SyncPage() {
  const [reports, setReports] = useState<DisasterReport[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    setReports(storage.getReports());
    
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  const pendingReports = reports.filter(r => r.status === 'Pending');
  const syncedReports = reports.filter(r => r.status === 'Synced');

  const handleSync = async () => {
    if (!isOnline) {
      toast.error("Cannot sync: Device is offline");
      return;
    }

    setIsSyncing(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const updatedReports = reports.map(r => ({ ...r, status: 'Synced' as const }));
    updatedReports.forEach(r => storage.updateReport(r));
    setReports(updatedReports);
    
    setIsSyncing(false);
    toast.success("All data synchronized successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Data Synchronization</h1>
          <p className="text-muted-foreground">Manage offline data and cloud synchronization status.</p>
        </div>
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold",
          isOnline ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-amber-50 border-amber-200 text-amber-700"
        )}>
          {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
          {isOnline ? "ONLINE" : "OFFLINE"}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-slate-50 border-2 border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              Pending Sync
            </CardTitle>
            <CardDescription>Data stored locally waiting for internet connection.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-bold">{pendingReports.length}</div>
            <p className="text-xs text-muted-foreground">Reports captured during offline mode.</p>
            <Button 
              className="w-full" 
              disabled={pendingReports.length === 0 || !isOnline || isSyncing}
              onClick={handleSync}
            >
              {isSyncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CloudUpload className="mr-2 h-4 w-4" />}
              {isSyncing ? "Syncing..." : "Sync Now"}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50/30 border-emerald-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              Synced Data
            </CardTitle>
            <CardDescription>Data successfully uploaded to the central cloud database.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-bold">{syncedReports.length}</div>
            <p className="text-xs text-muted-foreground">Total reports available globally.</p>
            <Button variant="outline" className="w-full" asChild>
              <a href="/dashboard">View Dashboard</a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Sync Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.slice(0, 5).map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 rounded-lg border bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-white border flex items-center justify-center">
                    <Database className="h-4 w-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">{report.problems[0]?.type || "Disaster Report"}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(report.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <Badge variant={report.status === 'Synced' ? 'default' : 'secondary'} className="text-[10px]">
                  {report.status.toUpperCase()}
                </Badge>
              </div>
            ))}
            {reports.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm italic">
                No sync activity recorded.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {!isOnline && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800">
          <AlertCircle className="h-6 w-6 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-bold">Offline Mode Active</p>
            <p className="text-xs">Your data is being saved locally. Once you reconnect to the internet, you can sync your reports to the global dashboard.</p>
          </div>
        </div>
      )}
    </div>
  );
}
