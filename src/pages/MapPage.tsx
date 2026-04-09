import { useState, useEffect } from 'react';
import { 
  Search, 
  Layers, 
  MapPin, 
  Navigation, 
  Info,
  Building,
  Waves,
  AlertTriangle,
  Activity,
  Plus,
  Minus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { storage } from '../lib/storage';
import { DisasterReport } from '../types';
import { cn } from '../lib/utils';
import { FallbackMap } from '../components/FallbackMap';

export default function MapPage() {
  const [reports, setReports] = useState<DisasterReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<DisasterReport | null>(null);

  useEffect(() => {
    setReports(storage.getReports());
  }, []);

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Disaster Intelligence Map</h1>
          <p className="text-sm text-muted-foreground">Real-time visualization of reported incidents and risk zones.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Layers className="mr-2 h-4 w-4" /> Layers
          </Button>
          <Button variant="outline" size="sm">
            <Navigation className="mr-2 h-4 w-4" /> Recenter
          </Button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Map Area */}
        <div className="flex-1 relative">
          <FallbackMap reports={reports} onMarkerClick={setSelectedReport} />
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl border shadow-lg space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Risk Levels</p>
            <div className="flex items-center gap-2 text-xs">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span>Critical Risk</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <span>Medium Risk</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <span>Safe Zone</span>
            </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <AnimatePresence>
          {selectedReport && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-80 space-y-4 overflow-y-auto pr-2"
            >
              <Card>
                <img src={selectedReport.image} className="w-full aspect-video object-cover rounded-t-lg" />
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">Incident Details</CardTitle>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedReport(null)}>
                      <Plus className="h-4 w-4 rotate-45" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-4">
                  <div className="space-y-2">
                    {selectedReport.problems.map((p, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="font-medium">{p.type}</span>
                        <Badge variant="outline" className={cn(
                          p.severity === 'High' ? "text-red-600" : "text-amber-600"
                        )}>
                          {p.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{selectedReport.location.lat.toFixed(4)}, {selectedReport.location.lng.toFixed(4)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Activity className="h-3 w-3" />
                      <span>Reported via {selectedReport.source}</span>
                    </div>
                  </div>

                  <Button className="w-full bg-red-600 hover:bg-red-700" size="sm">
                    Dispatch Rescue
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-red-50 border-red-100">
                <CardContent className="p-4 flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-red-800">CRITICAL ZONE ALERT</p>
                    <p className="text-[10px] text-red-700 mt-1">
                      Multiple reports in this area indicate a high probability of structural collapse.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
