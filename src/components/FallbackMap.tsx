import { useState } from 'react';
import { 
  Building,
  Waves,
  AlertTriangle,
  Plus,
  Minus
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { DisasterReport } from '../types';
import { cn } from '../lib/utils';

interface FallbackMapProps {
  reports: DisasterReport[];
  onMarkerClick?: (r: DisasterReport) => void;
  selectedReportId?: string;
  className?: string;
}

export function FallbackMap({ reports, onMarkerClick, selectedReportId, className }: FallbackMapProps) {
  const [zoom, setZoom] = useState(1);
  
  return (
    <div className={cn("relative w-full h-full bg-slate-100 overflow-hidden rounded-xl border-2 border-slate-200", className)}>
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20" 
        style={{ 
          backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', 
          backgroundSize: `${20 * zoom}px ${20 * zoom}px` 
        }} 
      />
      
      {/* Simulated Map Features */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[200%] h-[200%] rotate-12 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-full h-4 bg-slate-400" />
          <div className="absolute top-1/2 left-0 w-full h-4 bg-slate-400" />
          <div className="absolute top-0 left-1/2 w-4 h-full bg-slate-400" />
        </div>
      </div>

      {/* Markers */}
      <div className="absolute inset-0">
        {reports.map((report) => {
          const x = ((report.location.lng + 180) % 360) / 3.6;
          const y = ((90 - report.location.lat) % 180) / 1.8;
          
          const maxSeverity = report.problems.some(p => p.severity === 'High') ? 'High' : 
                            report.problems.some(p => p.severity === 'Medium') ? 'Medium' : 'Safe';

          const mainProblem = report.problems[0];
          let label = mainProblem?.type || "Incident";
          if (maxSeverity === 'High') label += " (HEAVY)";
          else if (maxSeverity === 'Medium') label += " (MODERATE)";

          const isSelected = selectedReportId === report.id;

          return (
            <motion.div
              key={report.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={cn(
                "absolute z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1",
                isSelected ? "z-20" : "z-10"
              )}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <motion.button
                whileHover={{ scale: 1.2 }}
                onClick={() => onMarkerClick?.(report)}
                className={cn(
                  "relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white shadow-lg transition-all",
                  maxSeverity === 'High' ? "bg-red-500" : maxSeverity === 'Medium' ? "bg-amber-500" : "bg-emerald-500",
                  isSelected && "ring-4 ring-white scale-125"
                )}
              >
                {report.problems[0]?.type.includes('Flood') ? <Waves className="h-4 w-4 text-white" /> :
                 report.problems[0]?.type.includes('Building') ? <Building className="h-4 w-4 text-white" /> :
                 <AlertTriangle className="h-4 w-4 text-white" />}
                
                {maxSeverity === 'High' && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                )}
              </motion.button>
              <div className={cn(
                "bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded border shadow-xs text-[8px] font-bold whitespace-nowrap uppercase transition-all",
                isSelected ? "scale-110 border-slate-400" : "opacity-70"
              )}>
                {label}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => setZoom(z => Math.min(z + 0.5, 3))}>
          <Plus className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => setZoom(z => Math.max(z - 0.5, 0.5))}>
          <Minus className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded border shadow-xs text-[8px] font-mono text-muted-foreground">
        SIMULATED MAP
      </div>
    </div>
  );
}
