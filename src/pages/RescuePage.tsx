import { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Navigation, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2,
  Ambulance,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { storage } from '../lib/storage';
import { DisasterReport } from '../types';
import { cn } from '../lib/utils';
import { FallbackMap } from '../components/FallbackMap';

export default function RescuePage() {
  const [reports, setReports] = useState<DisasterReport[]>([]);
  const [allReports, setAllReports] = useState<DisasterReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<DisasterReport | null>(null);
  const [isDispatching, setIsDispatching] = useState(false);
  const [rescueStatus, setRescueStatus] = useState<'Idle' | 'Responding' | 'On Scene'>('Idle');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stored = storage.getReports();
    setAllReports(stored);
    setReports(stored.filter(r => r.problems.some(p => p.severity === 'High')));
  }, []);

  const handleDispatch = () => {
    setIsDispatching(true);
    setRescueStatus('Responding');
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setRescueStatus('On Scene');
          setIsDispatching(false);
          return 100;
        }
        return prev + 2;
      });
    }, 200);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Rescue Coordination</h1>
          <p className="text-muted-foreground">Dispatch rescue teams and track live response progress.</p>
        </div>
        <Badge variant={rescueStatus === 'Idle' ? 'outline' : 'default'} className={cn(
          rescueStatus === 'Responding' && "bg-blue-600 animate-pulse",
          rescueStatus === 'On Scene' && "bg-emerald-600"
        )}>
          {rescueStatus.toUpperCase()}
        </Badge>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Incident List */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">High Priority Incidents</h2>
          <div className="space-y-3">
            {reports.map((report) => (
              <Card 
                key={report.id}
                className={cn(
                  "cursor-pointer transition-all hover:border-red-500",
                  selectedReport?.id === report.id ? "border-red-500 ring-1 ring-red-500" : ""
                )}
                onClick={() => setSelectedReport(report)}
              >
                <CardContent className="p-4 flex gap-4">
                  <div className="h-16 w-16 rounded-lg overflow-hidden shrink-0">
                    <img src={report.image} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{report.problems[0]?.type}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {report.location.lat.toFixed(4)}, {report.location.lng.toFixed(4)}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <Badge variant="destructive" className="text-[10px] h-4">CRITICAL</Badge>
                      <span className="text-[10px] text-muted-foreground">{new Date(report.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {reports.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed rounded-xl">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No critical incidents pending.</p>
              </div>
            )}
          </div>
        </div>

        {/* Dispatch & Tracking Area */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {selectedReport ? (
              <motion.div
                key={selectedReport.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Card className="bg-slate-950 text-white border-none shadow-2xl overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Ambulance className="h-32 w-32" />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Navigation className="h-5 w-5 text-red-500" />
                      Rescue Mission: {selectedReport.id.slice(0, 8)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest text-slate-500">Estimated Time</p>
                        <p className="text-2xl font-bold">12 MIN</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest text-slate-500">Route Safety</p>
                        <p className="text-2xl font-bold text-emerald-400">94% SAFE</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Response Progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="h-10 w-10 rounded-full bg-red-600/20 flex items-center justify-center text-red-500">
                        <ShieldAlert className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold">Fastest Safe Route Available</p>
                        <p className="text-xs text-slate-400">Avoiding blocked roads at Sector 4 and Flood Zone B.</p>
                      </div>
                      <Button 
                        onClick={handleDispatch} 
                        disabled={isDispatching || rescueStatus === 'On Scene'}
                        className={cn(
                          "bg-red-600 hover:bg-red-700",
                          rescueStatus === 'On Scene' && "bg-emerald-600 hover:bg-emerald-700"
                        )}
                      >
                        {rescueStatus === 'Idle' && "Dispatch Team"}
                        {rescueStatus === 'Responding' && <Loader2 className="h-4 w-4 animate-spin" />}
                        {rescueStatus === 'On Scene' && "Team On Scene"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Map with Path Visualization */}
                <Card className="h-80 relative overflow-hidden">
                  <FallbackMap 
                    reports={allReports} 
                    selectedReportId={selectedReport.id}
                    className="h-full border-none rounded-none"
                  />
                  
                  {/* Path Overlay */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
                    <motion.path
                      d="M 40 216 L 120 216 L 120 100 L 300 100 L 300 40"
                      fill="none"
                      stroke="#dc2626"
                      strokeWidth="4"
                      strokeDasharray="10,5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: progress / 100 }}
                    />
                  </svg>
                  
                  {/* Moving Vehicle */}
                  <motion.div 
                    className="absolute z-40"
                    style={{ 
                      left: progress < 25 ? `${40 + (progress * 3.2)}px` : 
                            progress < 50 ? '120px' : 
                            progress < 85 ? `${120 + ((progress - 50) * 5.1)}px` : '300px',
                      top: progress < 25 ? '216px' : 
                           progress < 50 ? `${216 - ((progress - 25) * 4.6)}px` : 
                           progress < 85 ? '100px' : `${100 - ((progress - 85) * 4)}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div className="bg-white p-1 rounded-full shadow-2xl border-2 border-red-600">
                      <Ambulance className="h-6 w-6 text-red-600" />
                    </div>
                  </motion.div>

                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full border shadow-lg z-50">
                    <Clock className="h-3 w-3 text-red-600" />
                    <span className="text-[10px] font-bold">ETA: {Math.max(0, 12 - Math.floor(progress / 8))} MIN</span>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <div className="h-full min-h-[500px] flex flex-col gap-4">
                <div className="flex-1 relative">
                  <FallbackMap 
                    reports={allReports} 
                    onMarkerClick={setSelectedReport}
                    selectedReportId={selectedReport?.id}
                    className="h-full"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-slate-900/80 to-transparent text-white rounded-b-xl">
                    <h3 className="text-lg font-bold">Strategic Response Map</h3>
                    <p className="text-xs text-slate-200">Select a critical incident from the list or map to initiate rescue operations.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <Card className="bg-slate-50 border-slate-200">
                    <CardContent className="p-4 text-center">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Active Teams</p>
                      <p className="text-xl font-bold">12</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-50 border-slate-200">
                    <CardContent className="p-4 text-center">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Avg Response</p>
                      <p className="text-xl font-bold">8.5m</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-50 border-slate-200">
                    <CardContent className="p-4 text-center">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Success Rate</p>
                      <p className="text-xl font-bold text-emerald-600">98%</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
