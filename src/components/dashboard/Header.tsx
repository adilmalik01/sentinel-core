import { Menu, Plus, RefreshCw, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onMenuToggle: () => void;
  onNewScan: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function Header({ onMenuToggle, onNewScan, onRefresh, isRefreshing }: HeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Security Dashboard</h1>
            <p className="text-xs text-muted-foreground">Real-time threat monitoring</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="relative"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
          </Button>

          <Button onClick={onNewScan} className="gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Scan</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
