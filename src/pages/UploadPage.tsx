import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Upload as UploadIcon, 
  Plane, 
  Globe, 
  X, 
  CheckCircle2, 
  Loader2,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { storage } from '../lib/storage';
import { analyzeDisasterImage } from '../lib/gemini';
import { DisasterReport } from '../types';
import { cn } from '../lib/utils';

export default function UploadPage() {
  const navigate = useNavigate();
  const [source, setSource] = useState<'Camera' | 'Upload' | 'Drone' | 'Satellite' | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [droneFeedActive, setDroneFeedActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Drone simulation timer
  useEffect(() => {
    let interval: any;
    if (droneFeedActive) {
      interval = setInterval(() => {
        // Simulate drone capturing image
        const mockDroneImages = [
          'https://picsum.photos/seed/flood1/800/600',
          'https://picsum.photos/seed/damage1/800/600',
          'https://picsum.photos/seed/road1/800/600'
        ];
        const randomImage = mockDroneImages[Math.floor(Math.random() * mockDroneImages.length)];
        setImage(randomImage);
        toast.info("Live Drone Feed: New image captured");
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [droneFeedActive]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Get location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        });
      }
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      toast.error("Could not access camera");
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      setImage(canvas.toDataURL('image/jpeg'));
      
      // Stop camera
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    
    setIsAnalyzing(true);
    toast.promise(
      async () => {
        const problems = await analyzeDisasterImage(image);
        const report: DisasterReport = {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          location: location || { lat: 0, lng: 0 },
          image,
          problems,
          source: source || 'Upload',
          status: navigator.onLine ? 'Synced' : 'Pending'
        };
        
        storage.saveReport(report);
        setIsAnalyzing(false);
        navigate(`/analysis/${report.id}`);
      },
      {
        loading: 'AI is analyzing disaster patterns...',
        success: 'Analysis complete!',
        error: 'Analysis failed. Using fallback detection.'
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Report Disaster</h1>
        <p className="text-muted-foreground">Select an input source to begin AI-powered disaster detection.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { id: 'Camera', icon: Camera, label: 'Live Camera', color: 'bg-blue-500' },
          { id: 'Upload', icon: UploadIcon, label: 'File Upload', color: 'bg-purple-500' },
          { id: 'Drone', icon: Plane, label: 'Drone Feed', color: 'bg-orange-500' },
          { id: 'Satellite', icon: Globe, label: 'Satellite', color: 'bg-slate-700' },
        ].map((item) => (
          <Button
            key={item.id}
            variant={source === item.id ? 'default' : 'outline'}
            className={cn(
              "h-24 flex-col gap-2 transition-all",
              source === item.id && "ring-2 ring-primary ring-offset-2"
            )}
            onClick={() => {
              setSource(item.id as any);
              setImage(null);
              setDroneFeedActive(item.id === 'Drone');
              if (item.id === 'Camera') startCamera();
              if (item.id === 'Upload') fileInputRef.current?.click();
              if (item.id === 'Satellite') {
                toast.warning("Satellite Connection: Permission required. Demo mode enabled.");
                setImage('https://picsum.photos/seed/satellite/800/600');
              }
            }}
          >
            <item.icon className="h-6 w-6" />
            {item.label}
          </Button>
        ))}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange} 
      />

      <AnimatePresence mode="wait">
        {source && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Card className="overflow-hidden border-2 border-dashed">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-slate-100 flex items-center justify-center">
                  {source === 'Camera' && !image && (
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  {image ? (
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    source !== 'Camera' && (
                      <div className="text-center space-y-2 text-muted-foreground">
                        <UploadIcon className="h-12 w-12 mx-auto opacity-20" />
                        <p>Waiting for input...</p>
                      </div>
                    )
                  )}

                  {source === 'Drone' && droneFeedActive && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                      <div className="h-2 w-2 rounded-full bg-white" />
                      LIVE DRONE FEED ACTIVE
                    </div>
                  )}

                  <div className="absolute bottom-4 right-4 flex gap-2">
                    {source === 'Camera' && !image && (
                      <Button onClick={captureImage} className="rounded-full shadow-lg">
                        <Camera className="mr-2 h-4 w-4" /> Capture
                      </Button>
                    )}
                    {image && (
                      <Button variant="secondary" onClick={() => setImage(null)} className="rounded-full shadow-lg">
                        <X className="mr-2 h-4 w-4" /> Clear
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col gap-4"
        >
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium">Location Detected</p>
              <p className="text-xs text-muted-foreground">
                {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "Fetching GPS coordinates..."}
              </p>
            </div>
            {!location && <Loader2 className="h-4 w-4 animate-spin ml-auto" />}
          </div>

          <Button 
            size="lg" 
            className="w-full h-16 text-lg font-bold bg-red-600 hover:bg-red-700"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ANALYZING DISASTER...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" />
                START AI DETECTION
              </>
            )}
          </Button>
        </motion.div>
      )}

      {!navigator.onLine && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm">You are currently offline. Reports will be saved locally and synced when online.</p>
        </div>
      )}
    </div>
  );
}
