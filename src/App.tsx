/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Upload, 
  Map as MapIcon, 
  ShieldAlert, 
  Activity, 
  RefreshCw, 
  BarChart3, 
  Home as HomeIcon,
  AlertTriangle,
  Menu,
  X,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from './components/ui/sonner';
import { Button } from './components/ui/button';
import { cn } from './lib/utils';

// Pages (to be created)
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import AnalysisPage from './pages/AnalysisPage';
import MapPage from './pages/MapPage';
import RescuePage from './pages/RescuePage';
import DashboardPage from './pages/DashboardPage';
import AlertsPage from './pages/AlertsPage';
import SyncPage from './pages/SyncPage';
import AnalyticsPage from './pages/AnalyticsPage';

function Navbar({ isOnline }: { isOnline: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Upload', path: '/upload', icon: Upload },
    { name: 'Map', path: '/map', icon: MapIcon },
    { name: 'Rescue', path: '/rescue', icon: ShieldAlert },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Alerts', path: '/alerts', icon: AlertTriangle },
    { name: 'Sync', path: '/sync', icon: RefreshCw },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600 text-white shadow-lg shadow-red-500/20">
            <Activity className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight hidden sm:inline-block">
            DisasterAssist <span className="text-red-600">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
            isOnline ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
          )}>
            {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {isOnline ? "ONLINE" : "OFFLINE"}
          </div>
          
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-background"
          >
            <div className="flex flex-col p-4 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                    location.pathname === item.path ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar Rail */}
      <div className="hidden md:flex fixed left-0 top-16 bottom-0 w-16 flex-col items-center py-4 border-r bg-background/95">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "group relative flex h-12 w-12 items-center justify-center rounded-lg transition-all hover:bg-accent mb-2",
              location.pathname === item.path ? "bg-accent text-accent-foreground" : "text-muted-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="absolute left-14 scale-0 rounded bg-gray-900 px-2 py-1 text-xs text-white transition-all group-hover:scale-100 whitespace-nowrap z-50">
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-background font-sans antialiased">
        <Navbar isOnline={isOnline} />
        <main className="md:pl-16 min-h-[calc(100vh-64px)]">
          <div className="container mx-auto p-4 md:p-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/analysis/:id" element={<AnalysisPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/rescue" element={<RescuePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/sync" element={<SyncPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
            </Routes>
          </div>
        </main>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

