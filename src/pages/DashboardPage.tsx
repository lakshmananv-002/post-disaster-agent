import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Users,
  Map as MapIcon,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { storage } from '../lib/storage';
import { DisasterReport } from '../types';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

export default function DashboardPage() {
  const [reports, setReports] = useState<DisasterReport[]>([]);
  
  useEffect(() => {
    setReports(storage.getReports());
  }, []);

  const stats = [
    {
      title: "Total Reports",
      value: reports.length,
      change: "+12%",
      trend: "up",
      icon: Activity,
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      title: "Critical Zones",
      value: reports.filter(r => r.problems.some(p => p.severity === 'High')).length,
      change: "+2",
      trend: "up",
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-100"
    },
    {
      title: "Rescue Teams",
      value: 48,
      change: "Active",
      trend: "neutral",
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-100"
    },
    {
      title: "Pending Sync",
      value: reports.filter(r => r.status === 'Pending').length,
      change: "-5",
      trend: "down",
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-100"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Global Dashboard</h1>
          <p className="text-muted-foreground">Real-time overview of disaster intelligence and response operations.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-slate-100 px-3 py-1.5 rounded-full">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          LIVE UPDATES ACTIVE
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div className={`flex items-center text-xs font-bold ${
                    stat.trend === 'up' ? 'text-red-600' : 
                    stat.trend === 'down' ? 'text-emerald-600' : 'text-slate-600'
                  }`}>
                    {stat.trend === 'up' && <TrendingUp className="mr-1 h-3 w-3" />}
                    {stat.trend === 'down' && <TrendingDown className="mr-1 h-3 w-3" />}
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Latest disaster detections from all sources.</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/map">View All on Map</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.slice(0, 5).map((report) => (
                <div key={report.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                  <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0 border">
                    <img src={report.image} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold truncate">{report.problems[0]?.type || "Unknown Incident"}</p>
                      <Badge variant={report.problems.some(p => p.severity === 'High') ? 'destructive' : 'secondary'} className="text-[10px]">
                        {report.problems.some(p => p.severity === 'High') ? 'CRITICAL' : 'STABLE'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-2.5 w-2.5" />
                        {report.location.lat.toFixed(4)}, {report.location.lng.toFixed(4)}
                      </p>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {new Date(report.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                    <Link to={`/analysis/${report.id}`}>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
              {reports.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto opacity-10 mb-2" />
                  <p>No reports available yet.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* High Risk Zones */}
        <Card>
          <CardHeader>
            <CardTitle>High Risk Zones</CardTitle>
            <CardDescription>Areas requiring immediate attention.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { area: "Sector 4 - Downtown", risk: 92, status: "Critical" },
              { area: "Zone B - Riverfront", risk: 85, status: "Critical" },
              { area: "East Highway - Block 2", risk: 74, status: "Warning" },
              { area: "Industrial Park", risk: 62, status: "Warning" }
            ].map((zone, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold">{zone.area}</span>
                  <span className={cn(
                    "font-bold",
                    zone.status === 'Critical' ? "text-red-600" : "text-amber-600"
                  )}>{zone.risk}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full",
                      zone.status === 'Critical' ? "bg-red-600" : "bg-amber-600"
                    )} 
                    style={{ width: `${zone.risk}%` }} 
                  />
                </div>
              </div>
            ))}
            <div className="pt-4">
              <Button asChild className="w-full" variant="outline">
                <Link to="/alerts">View All Alerts</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
