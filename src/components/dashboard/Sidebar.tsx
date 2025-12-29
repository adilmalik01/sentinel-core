import { Shield, LayoutDashboard, Scan, FileText, Settings, Activity, AlertTriangle, Target } from 'lucide-react';
import { DashboardStats } from '@/types/scan';
import { cn } from '@/lib/utils';

interface SidebarProps {
  stats: DashboardStats;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'scans', label: 'Scans', icon: Scan },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ stats, activeTab, onTabChange, isCollapsed }: SidebarProps) {
  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border z-40 transition-all duration-300 flex flex-col",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Shield className="w-8 h-8 text-primary" />
            <div className="absolute inset-0 blur-md bg-primary/30 -z-10" />
          </div>
          {!isCollapsed && (
            <div className="animate-fade-up">
              <h1 className="text-lg font-bold neon-text tracking-wider">CYBERSCAN</h1>
              <span className="text-xs text-muted-foreground font-mono">v2.0</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      {!isCollapsed && (
        <div className="p-4 space-y-3 border-b border-sidebar-border">
          <StatsCard 
            icon={Activity} 
            label="Total Scans" 
            value={stats.totalScans} 
            color="primary" 
          />
          <StatsCard 
            icon={AlertTriangle} 
            label="Phishing Detected" 
            value={stats.phishingDetected} 
            color="warning" 
          />
          <StatsCard 
            icon={Target} 
            label="Critical Risks" 
            value={stats.criticalRisks} 
            color="critical" 
          />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
              activeTab === item.id 
                ? "bg-primary/10 text-primary border border-primary/30" 
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-transform group-hover:scale-110",
              activeTab === item.id && "drop-shadow-[0_0_8px_hsl(var(--primary))]"
            )} />
            {!isCollapsed && (
              <span className="font-medium text-sm">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* System Status */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          {!isCollapsed && (
            <span className="text-xs text-muted-foreground font-mono">System Online</span>
          )}
        </div>
      </div>
    </aside>
  );
}

interface StatsCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  color: 'primary' | 'warning' | 'critical';
}

function StatsCard({ icon: Icon, label, value, color }: StatsCardProps) {
  const colorClasses = {
    primary: 'text-primary bg-primary/10 border-primary/20',
    warning: 'text-warning bg-warning/10 border-warning/20',
    critical: 'text-destructive bg-destructive/10 border-destructive/20',
  };

  return (
    <div className={cn(
      "glass-card p-3 border rounded-lg animate-fade-up",
      colorClasses[color]
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-bold font-mono">{value}</p>
        </div>
        <Icon className="w-8 h-8 opacity-50" />
      </div>
    </div>
  );
}
