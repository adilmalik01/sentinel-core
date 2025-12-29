import { Activity, AlertTriangle, Target, TrendingUp, Shield, Zap } from 'lucide-react';
import { DashboardStats } from '@/types/scan';
import { cn } from '@/lib/utils';

interface StatsOverviewProps {
  stats: DashboardStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const cards = [
    {
      label: 'Total Scans',
      value: stats.totalScans,
      icon: Activity,
      trend: '+12%',
      trendUp: true,
      color: 'primary',
    },
    {
      label: 'Average Score',
      value: stats.averageScore,
      suffix: '%',
      icon: TrendingUp,
      trend: '+5%',
      trendUp: true,
      color: 'success',
    },
    {
      label: 'Phishing Detected',
      value: stats.phishingDetected,
      icon: AlertTriangle,
      trend: '-2',
      trendUp: false,
      color: 'warning',
    },
    {
      label: 'Critical Risks',
      value: stats.criticalRisks,
      icon: Target,
      trend: '+3',
      trendUp: true,
      color: 'critical',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div 
          key={card.label}
          className="glass-card p-4 border border-border/50 hover:border-primary/30 transition-all duration-300 group animate-fade-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className={cn(
              "p-2 rounded-lg transition-colors",
              card.color === 'primary' && "bg-primary/10 text-primary group-hover:bg-primary/20",
              card.color === 'success' && "bg-success/10 text-success group-hover:bg-success/20",
              card.color === 'warning' && "bg-warning/10 text-warning group-hover:bg-warning/20",
              card.color === 'critical' && "bg-destructive/10 text-destructive group-hover:bg-destructive/20",
            )}>
              <card.icon className="w-5 h-5" />
            </div>
            <div className={cn(
              "flex items-center gap-1 text-xs font-mono",
              card.color === 'critical' && card.trendUp ? "text-destructive" : 
              card.trendUp ? "text-success" : "text-success"
            )}>
              <Zap className="w-3 h-3" />
              {card.trend}
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold font-mono mb-1">
              {card.value}{card.suffix}
            </p>
            <p className="text-sm text-muted-foreground">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
