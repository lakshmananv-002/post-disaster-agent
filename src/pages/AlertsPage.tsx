import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Bell, 
  Waves, 
  Building, 
  Navigation, 
  Activity,
  Clock,
  MapPin,
  ShieldAlert,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';

export default function AlertsPage() {
  const alerts = [
    {
      id: '1',
      type: 'Flood Warning',
      message: 'Rapid water level rise detected in Sector 7. Immediate evacuation recommended for low-lying areas.',
      severity: 'High',
      timestamp: Date.now() - 1000 * 60 * 15,
      icon: Waves,
      location: 'Sector 7 - Riverfront'
    },
    {
      id: '2',
      type: 'Structural Risk',
      message: 'Multiple reports of building cracks in the Industrial Zone following the recent tremor.',
      severity: 'High',
      timestamp: Date.now() - 1000 * 60 * 45,
      icon: Building,
      location: 'Industrial Zone'
    },
    {
      id: '3',
      type: 'Road Blockage',
      message: 'Main highway blocked by debris at KM 42. Rescue teams rerouted.',
      severity: 'Medium',
      timestamp: Date.now() - 1000 * 60 * 120,
      icon: Navigation,
      location: 'East Highway KM 42'
    },
    {
      id: '4',
      type: 'Seismic Activity',
      message: 'Minor aftershock detected. Magnitude 3.2. No immediate damage reported.',
      severity: 'Safe',
      timestamp: Date.now() - 1000 * 60 * 180,
      icon: Activity,
      location: 'Regional'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Active Alerts</h1>
          <p className="text-muted-foreground">Critical disaster warnings and emergency notifications.</p>
        </div>
        <Button variant="outline" size="sm">
          <Bell className="mr-2 h-4 w-4" /> Notification Settings
        </Button>
      </div>

      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={cn(
              "border-l-4",
              alert.severity === 'High' ? "border-l-red-500 bg-red-50/30" : 
              alert.severity === 'Medium' ? "border-l-amber-500 bg-amber-50/30" : "border-l-blue-500 bg-blue-50/30"
            )}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center shrink-0",
                    alert.severity === 'High' ? "bg-red-100 text-red-600" : 
                    alert.severity === 'Medium' ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                  )}>
                    <alert.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold">{alert.type}</h3>
                      <Badge variant={alert.severity === 'High' ? 'destructive' : 'secondary'}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{alert.message}</p>
                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        <Clock className="h-3 w-3" />
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        <MapPin className="h-3 w-3" />
                        {alert.location}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Info className="mr-1 h-3 w-3" /> Details
                  </Button>
                  <Button size="sm" className={cn(
                    "text-xs",
                    alert.severity === 'High' ? "bg-red-600 hover:bg-red-700" : ""
                  )}>
                    <ShieldAlert className="mr-1 h-3 w-3" /> Take Action
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="rounded-2xl bg-slate-900 p-8 text-white text-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Emergency Broadcast System</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            All alerts are automatically broadcasted to local emergency channels and mobile devices within the affected radius.
          </p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          Broadcast Manual Alert
        </Button>
      </div>
    </div>
  );
}
