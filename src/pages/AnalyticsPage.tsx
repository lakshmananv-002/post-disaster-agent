import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Activity, 
  Calendar,
  Filter,
  Download,
  Waves,
  Building,
  Navigation,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { storage } from '../lib/storage';
import { DisasterReport } from '../types';
import { cn } from '../lib/utils';

export default function AnalyticsPage() {
  const [reports, setReports] = useState<DisasterReport[]>([]);
  
  useEffect(() => {
    setReports(storage.getReports());
  }, []);

  const disasterTypes = [
    { name: 'Flood', count: reports.filter(r => r.problems.some(p => p.type.includes('Flood'))).length, color: 'bg-blue-500', icon: Waves },
    { name: 'Building Damage', count: reports.filter(r => r.problems.some(p => p.type.includes('Building'))).length, color: 'bg-red-500', icon: Building },
    { name: 'Road Blocked', count: reports.filter(r => r.problems.some(p => p.type.includes('Road'))).length, color: 'bg-amber-500', icon: Navigation },
    { name: 'Earthquake', count: reports.filter(r => r.problems.some(p => p.type.includes('Earthquake'))).length, color: 'bg-purple-500', icon: Activity }
  ];

  const totalProblems = disasterTypes.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Disaster Analytics</h1>
          <p className="text-muted-foreground">Advanced data visualization and trend analysis for strategic planning.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" /> Last 30 Days
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Type Distribution */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Disaster Type Distribution</CardTitle>
            <CardDescription>Breakdown of reported incidents by category.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {disasterTypes.map((type, i) => (
                <div key={type.name} className="p-4 rounded-2xl border bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center text-white", type.color)}>
                      <type.icon className="h-5 w-5" />
                    </div>
                    <span className="text-2xl font-bold">{type.count}</span>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">{type.name}</p>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                      className={cn("h-full rounded-full", type.color)}
                      initial={{ width: 0 }}
                      animate={{ width: totalProblems > 0 ? `${(type.count / totalProblems) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Simulated Trend Chart */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Incident Trend (Weekly)</h3>
              <div className="h-48 flex items-end gap-2 px-2">
                {[45, 62, 51, 78, 92, 84, 75].map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <motion.div 
                      className="w-full bg-blue-500/20 hover:bg-blue-500/40 transition-colors rounded-t-lg relative group"
                      initial={{ height: 0 }}
                      animate={{ height: `${val}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {val}
                      </div>
                    </motion.div>
                    <span className="text-[10px] text-muted-foreground font-mono">D{i+1}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Trends */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Severity Trends</CardTitle>
              <CardDescription>Historical risk level analysis.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Average Severity</p>
                  <p className="text-2xl font-bold text-red-600">HIGH</p>
                </div>
                <TrendingUp className="h-8 w-8 text-red-500 opacity-20" />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between text-xs">
                  <span>Critical Incidents</span>
                  <span className="font-bold">64%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600 w-[64%]" />
                </div>
                
                <div className="flex justify-between text-xs">
                  <span>Stabilized Zones</span>
                  <span className="font-bold">36%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 w-[36%]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-950 text-white border-none">
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                AI Prediction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-slate-400 leading-relaxed">
                Based on current trends and weather patterns, the risk of secondary flooding in Sector 4 is expected to increase by <span className="text-amber-500 font-bold">18%</span> over the next 24 hours.
              </p>
              <Button variant="outline" size="sm" className="w-full text-white border-white/20 hover:bg-white/10 text-xs">
                View Predictive Model
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
