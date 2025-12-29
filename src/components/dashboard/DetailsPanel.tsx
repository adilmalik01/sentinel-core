import { X, Shield, AlertTriangle, Globe, Lock, Server, Code, FileWarning, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Scan } from '@/types/scan';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface DetailsPanelProps {
  scan: Scan | null;
  onClose: () => void;
}

export function DetailsPanel({ scan, onClose }: DetailsPanelProps) {
  if (!scan) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-destructive';
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-card border-l border-border shadow-2xl z-50 animate-slide-in-right">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">{scan.domain}</h2>
              <p className="text-xs text-muted-foreground font-mono">{scan.id}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* AI Summary */}
            <Section icon={Shield} title="AI Security Summary" variant="primary">
              <p className="text-sm text-muted-foreground leading-relaxed">{scan.aiSummary}</p>
            </Section>

            {/* Vulnerabilities */}
            <Section icon={AlertTriangle} title="Vulnerabilities" variant={scan.vulnerabilities?.length ? 'warning' : 'success'}>
              {scan.vulnerabilities?.length ? (
                <div className="space-y-3">
                  {scan.vulnerabilities.map((vuln) => (
                    <div key={vuln.id} className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{vuln.name}</span>
                        <Badge variant={vuln.severity === 'critical' || vuln.severity === 'high' ? 'critical' : vuln.severity === 'medium' ? 'warning' : 'success'}>
                          {vuln.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{vuln.description}</p>
                      {vuln.affected && (
                        <p className="text-xs text-muted-foreground mt-1 font-mono">Affected: {vuln.affected}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="No vulnerabilities detected" />
              )}
            </Section>

            {/* Open Ports */}
            <Section icon={Server} title="Open Ports">
              {scan.ports?.length ? (
                <div className="grid grid-cols-2 gap-2">
                  {scan.ports.map((port) => (
                    <div 
                      key={port.number} 
                      className={cn(
                        "p-3 rounded-lg border",
                        port.risk === 'high' ? 'bg-destructive/10 border-destructive/30' :
                        port.risk === 'medium' ? 'bg-warning/10 border-warning/30' :
                        'bg-secondary/50 border-border/50'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold">{port.number}</span>
                        <Badge variant={port.risk === 'high' ? 'critical' : port.risk === 'medium' ? 'warning' : 'success'} className="text-xs">
                          {port.risk}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{port.service}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="No open ports detected" />
              )}
            </Section>

            {/* Pages Discovered */}
            <Section icon={Globe} title="Pages Discovered">
              {scan.pages?.length ? (
                <div className="space-y-1">
                  {scan.pages.map((page, index) => (
                    <div key={index} className="px-3 py-2 rounded bg-secondary/30 font-mono text-xs text-muted-foreground">
                      {page}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="No pages discovered" />
              )}
            </Section>

            {/* Phishing Analysis */}
            <Section 
              icon={FileWarning} 
              title="Phishing Analysis" 
              variant={scan.phishing?.detected ? 'critical' : 'success'}
            >
              <div className="flex items-center gap-2 mb-3">
                {scan.phishing?.detected ? (
                  <XCircle className="w-5 h-5 text-destructive" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-success" />
                )}
                <span className={cn("font-medium", scan.phishing?.detected ? 'text-destructive' : 'text-success')}>
                  {scan.phishing?.detected ? 'Phishing Detected' : 'No Phishing Detected'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{scan.phishing?.description}</p>
              {scan.phishing?.indicators.length ? (
                <div className="space-y-1">
                  {scan.phishing.indicators.map((indicator, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-warning" />
                      {indicator}
                    </div>
                  ))}
                </div>
              ) : null}
            </Section>

            {/* Technology Stack */}
            <Section icon={Code} title="Technology Stack">
              <div className="space-y-3">
                {scan.technology?.server && (
                  <TechItem label="Server" value={scan.technology.server} />
                )}
                {scan.technology?.cms && (
                  <TechItem label="CMS" value={scan.technology.cms} />
                )}
                {scan.technology?.frameworks?.length ? (
                  <TechItem label="Frameworks" value={scan.technology.frameworks.join(', ')} />
                ) : null}
                {scan.technology?.libraries?.length ? (
                  <TechItem label="Libraries" value={scan.technology.libraries.join(', ')} />
                ) : null}
              </div>
            </Section>

            {/* SSL Information */}
            <Section icon={Lock} title="SSL Information" variant={scan.ssl?.valid ? 'success' : 'critical'}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Certificate Status</span>
                  <Badge variant={scan.ssl?.valid ? 'success' : 'critical'}>
                    {scan.ssl?.valid ? 'Valid' : 'Invalid'}
                  </Badge>
                </div>
                <Separator className="bg-border/50" />
                <TechItem label="Issuer" value={scan.ssl?.issuer || 'Unknown'} />
                <TechItem label="Expiry" value={scan.ssl?.expiryDate || 'Unknown'} />
                <TechItem label="Protocol" value={scan.ssl?.protocol || 'Unknown'} />
                <TechItem label="Grade" value={scan.ssl?.grade || 'N/A'} />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">HTTPS Enforced</span>
                  {scan.ssl?.httpsEnforced ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : (
                    <XCircle className="w-4 h-4 text-destructive" />
                  )}
                </div>
              </div>
            </Section>

            {/* Scan Metadata */}
            <Section icon={Clock} title="Scan Metadata">
              <div className="space-y-2">
                <TechItem label="Scan ID" value={scan.id} mono />
                <TechItem label="Domain" value={scan.domain} />
                <TechItem label="Scan Time" value={new Date(scan.timestamp).toLocaleString()} />
                <TechItem label="Status" value={scan.status} />
              </div>
            </Section>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

interface SectionProps {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'warning' | 'critical' | 'success';
}

function Section({ icon: Icon, title, children, variant = 'default' }: SectionProps) {
  const variantClasses = {
    default: 'border-border/50',
    primary: 'border-primary/30',
    warning: 'border-warning/30',
    critical: 'border-destructive/30',
    success: 'border-success/30',
  };

  const iconClasses = {
    default: 'text-muted-foreground',
    primary: 'text-primary',
    warning: 'text-warning',
    critical: 'text-destructive',
    success: 'text-success',
  };

  return (
    <div className={cn("glass-card p-4 border", variantClasses[variant])}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className={cn("w-4 h-4", iconClasses[variant])} />
        <h3 className="font-semibold text-sm">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function TechItem({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={cn("text-sm", mono && "font-mono text-xs")}>{value}</span>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-4">
      <CheckCircle className="w-8 h-8 text-success/50 mx-auto mb-2" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
