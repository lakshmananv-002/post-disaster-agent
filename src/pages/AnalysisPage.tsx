import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Map as MapIcon, 
  ShieldAlert, 
  ArrowLeft,
  CheckCircle2,
  Clock,
  Building,
  Waves,
  Navigation,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { storage } from '../lib/storage';
import { DisasterReport, Severity } from '../types';
import { cn } from '../lib/utils';

const severityColors: Record<Severity, string> = {
  High: "bg-red-500",
  Medium: "bg-amber-500",
  Safe: "bg-emerald-500"
};

const severityTextColors: Record<Severity, string> = {
  High: "text-red-500",
  Medium: "text-amber-500",
  Safe: "text-emerald-500"
};

const problemIcons: Record<string, any> = {
  "Flood": Waves,
  "Building Damage": Building,
  "Road Blocked": Navigation,
  "Earthquake Damage": Activity
};

export default function AnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<DisasterReport | null>(null);

  useEffect(() => {
    if (id) {
      const reports = storage.getReports();
      const found = reports.find(r => r.id === id);
      if (found) setReport(found);
    }
  }, [id]);

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertTriangle className="h-12 w-12 text-muted-foreground" />
        <p className="text-xl font-medium">Report not found</p>
        <Button asChild variant="outline">
          <Link to="/upload">Back to Upload</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link to="/upload">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Badge variant={report.status === 'Synced' ? 'default' : 'secondary'}>
            {report.status === 'Synced' ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <Clock className="mr-1 h-3 w-3" />}
            {report.status}
          </Badge>
          <Badge variant="outline">{report.source}</Badge>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Left: Image and Info */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <img src={report.image} alt="Disaster" className="w-full aspect-video object-cover" />
            <CardHeader>
              <CardTitle className="text-lg">Incident Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Timestamp</span>
                <span className="font-medium">{new Date(report.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Coordinates</span>
                <span className="font-medium">{report.location.lat.toFixed(6)}, {report.location.lng.toFixed(6)}</span>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button asChild className="flex-1" variant="outline">
              <Link to="/map">
                <MapIcon className="mr-2 h-4 w-4" /> View on Map
              </Link>
            </Button>
            <Button asChild className="flex-1 bg-red-600 hover:bg-red-700">
              <Link to="/rescue">
                <ShieldAlert className="mr-2 h-4 w-4" /> Dispatch Rescue
              </Link>
            </Button>
          </div>
        </div>

        {/* Right: AI Analysis Results */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">AI Multi-Problem Detection</h2>
            <p className="text-muted-foreground">The system has identified the following critical issues in the analyzed image.</p>
          </div>

          <div className="space-y-4">
            {report.problems.map((problem, index) => {
              const Icon = problemIcons[problem.type] || AlertTriangle;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={cn(
                    "border-l-4",
                    problem.severity === 'High' ? "border-l-red-500" : 
                    problem.severity === 'Medium' ? "border-l-amber-500" : "border-l-emerald-500"
                  )}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={cn(
                        "h-12 w-12 rounded-lg flex items-center justify-center",
                        problem.severity === 'High' ? "bg-red-100 text-red-600" : 
                        problem.severity === 'Medium' ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                      )}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold">{problem.type}</h3>
                          <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", 
                            problem.severity === 'High' ? "bg-red-100 text-red-700" : 
                            problem.severity === 'Medium' ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                          )}>
                            {problem.severity.toUpperCase()}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={cn("h-full transition-all duration-1000", severityColors[problem.severity])} 
                              style={{ width: `${problem.confidence}%` }} 
                            />
                          </div>
                          <span className="text-xs font-mono text-muted-foreground">{problem.confidence}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <Card className="bg-slate-950 text-white border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-red-500" />
                Recommended Action
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400">
                {report.problems.some(p => p.severity === 'High') 
                  ? "CRITICAL: Immediate evacuation required. Dispatch heavy rescue teams and medical support to the coordinates immediately."
                  : "WARNING: Monitor area closely. Dispatch assessment team to verify road access and structural integrity."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
