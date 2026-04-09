import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Upload, 
  Map as MapIcon, 
  ShieldAlert, 
  LayoutDashboard, 
  ArrowRight,
  Activity,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function HomePage() {
  const features = [
    {
      title: "Real-Time Detection",
      description: "AI-powered analysis of disaster images from multiple sources.",
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      link: "/upload"
    },
    {
      title: "Live Mapping",
      description: "Visualize disaster zones and risk levels on an interactive map.",
      icon: MapIcon,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      link: "/map"
    },
    {
      title: "Rescue Routing",
      description: "Smart pathfinding for rescue teams avoiding blocked zones.",
      icon: ShieldAlert,
      color: "text-red-500",
      bg: "bg-red-500/10",
      link: "/rescue"
    },
    {
      title: "Global Dashboard",
      description: "Comprehensive overview of ongoing disasters and rescue status.",
      icon: LayoutDashboard,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      link: "/dashboard"
    }
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-16 text-white md:px-12 md:py-24">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/disaster/1920/1080')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        
        <div className="relative z-10 max-w-3xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full bg-red-600/20 px-3 py-1 text-sm font-medium text-red-400 ring-1 ring-inset ring-red-600/20"
          >
            <AlertTriangle className="h-4 w-4" />
            Emergency Response Platform
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight sm:text-6xl"
          >
            Disaster Intelligence <br />
            <span className="text-red-600">Powered by AI</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400"
          >
            Real-time disaster detection, risk analysis, and rescue coordination. 
            Empowering first responders with actionable intelligence when every second counts.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
              <Link to="/upload">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-white border-white/20 hover:bg-white/10">
              <Link to="/map">View Live Map</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.4 }}
          >
            <Link to={feature.link}>
              <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className={`mb-2 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg} ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* Quick Stats */}
      <section className="rounded-3xl border bg-card p-8 shadow-sm">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Incidents</p>
            <p className="text-4xl font-bold">12</p>
            <div className="h-1 w-full bg-red-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-600 w-3/4" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Rescue Teams</p>
            <p className="text-4xl font-bold">48</p>
            <div className="h-1 w-full bg-blue-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 w-1/2" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Areas Secured</p>
            <p className="text-4xl font-bold">156</p>
            <div className="h-1 w-full bg-emerald-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 w-4/5" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
