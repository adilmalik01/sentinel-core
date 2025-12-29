import { useState, useEffect } from 'react';
import { X, Scan, Terminal, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface NewScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: () => void;
}

const scanSteps = [
  'Initializing scan engine...',
  'Resolving DNS records...',
  'Checking SSL certificate...',
  'Scanning open ports...',
  'Crawling website pages...',
  'Analyzing vulnerabilities...',
  'Checking for phishing indicators...',
  'Detecting technology stack...',
  'Generating security report...',
  'Scan complete!',
];

export function NewScanModal({ isOpen, onClose, onScanComplete }: NewScanModalProps) {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isScanning) return;

    let step = 0;
    const interval = setInterval(() => {
      if (step < scanSteps.length) {
        setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${scanSteps[step]}`]);
        setProgress(((step + 1) / scanSteps.length) * 100);
        step++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsScanning(false);
          onScanComplete();
          handleClose();
        }, 1000);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [isScanning, onScanComplete]);

  const handleClose = () => {
    setUrl('');
    setIsScanning(false);
    setProgress(0);
    setLogs([]);
    setError(null);
    onClose();
  };

  const handleStartScan = () => {
    if (!url.trim()) {
      setError('Please enter a valid URL or domain');
      return;
    }

    // Basic URL validation
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(url)) {
      setError('Please enter a valid URL format');
      return;
    }

    setError(null);
    setIsScanning(true);
    setLogs([`[${new Date().toLocaleTimeString()}] Starting scan for: ${url}`]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={!isScanning ? handleClose : undefined}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 glass-card border border-border animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Scan className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">New Security Scan</h2>
              <p className="text-xs text-muted-foreground">Enter a domain or URL to analyze</p>
            </div>
          </div>
          {!isScanning && (
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {!isScanning ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Target URL</label>
                <Input
                  type="text"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-secondary/50 border-border font-mono"
                />
                {error && (
                  <div className="flex items-center gap-2 mt-2 text-destructive text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
              </div>
              <Button onClick={handleStartScan} className="w-full">
                <Scan className="w-4 h-4 mr-2" />
                Start Scan
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Scan Progress</span>
                  <span className="text-sm text-muted-foreground font-mono">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Terminal Logs */}
              <div className="bg-background/80 rounded-lg border border-border overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 border-b border-border">
                  <Terminal className="w-4 h-4 text-primary" />
                  <span className="text-xs font-mono text-muted-foreground">Scan Output</span>
                  {progress < 100 && (
                    <Loader2 className="w-3 h-3 text-primary animate-spin ml-auto" />
                  )}
                </div>
                <div className="h-48 overflow-y-auto p-3 font-mono text-xs">
                  {logs.map((log, index) => (
                    <div 
                      key={index} 
                      className={cn(
                        "py-0.5",
                        log.includes('complete') ? 'text-success' : 'text-primary/80'
                      )}
                    >
                      {log}
                    </div>
                  ))}
                </div>
              </div>

              {progress === 100 && (
                <div className="flex items-center justify-center gap-2 text-success">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Scan completed successfully!</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
