import { Eye, Trash2, ExternalLink, Clock } from 'lucide-react';
import { Scan } from '@/types/scan';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ScanTableProps {
  scans: Scan[];
  onViewDetails: (scan: Scan) => void;
  onDelete: (scanId: string) => void;
}

export function ScanTable({ scans, onViewDetails, onDelete }: ScanTableProps) {
  const getRiskBadge = (risk: Scan['risk'], score: number) => {
    if (score < 50) return <Badge variant="critical">Critical</Badge>;
    if (score < 75) return <Badge variant="warning">Medium</Badge>;
    return <Badge variant="success">Low</Badge>;
  };

  const getScoreColor = (score: number) => {
    if (score < 50) return 'text-destructive';
    if (score < 75) return 'text-warning';
    return 'text-success';
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (scans.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
          <Clock className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No Scans Available</h3>
        <p className="text-muted-foreground text-sm">Start a new scan to see security analysis results here.</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">#</th>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Domain</th>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">URL</th>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Security Score</th>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Risk Level</th>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Scanned</th>
              <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {scans.map((scan, index) => (
              <tr 
                key={scan.id}
                className="border-b border-border/30 hover:bg-accent/30 transition-colors group animate-fade-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="p-4">
                  <span className="text-muted-foreground font-mono text-sm">{String(index + 1).padStart(2, '0')}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      scan.status === 'completed' ? "bg-success" : 
                      scan.status === 'running' ? "bg-warning animate-pulse" : "bg-destructive"
                    )} />
                    <span className="font-medium">{scan.domain}</span>
                  </div>
                </td>
                <td className="p-4">
                  <a 
                    href={scan.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors font-mono text-sm"
                  >
                    {scan.url.length > 35 ? scan.url.substring(0, 35) + '...' : scan.url}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          scan.securityScore < 50 ? "bg-destructive" :
                          scan.securityScore < 75 ? "bg-warning" : "bg-success"
                        )}
                        style={{ width: `${scan.securityScore}%` }}
                      />
                    </div>
                    <span className={cn("font-mono font-bold", getScoreColor(scan.securityScore))}>
                      {scan.securityScore}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  {getRiskBadge(scan.risk, scan.securityScore)}
                </td>
                <td className="p-4">
                  <span className="text-muted-foreground text-sm">{formatDate(scan.timestamp)}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewDetails(scan)}
                      className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(scan.id)}
                      className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
