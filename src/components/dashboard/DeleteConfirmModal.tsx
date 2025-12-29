import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  scanId: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({ isOpen, scanId, onConfirm, onCancel }: DeleteConfirmModalProps) {
  if (!isOpen || !scanId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 glass-card border border-destructive/30 animate-fade-up">
        <div className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Delete Scan</h2>
          <p className="text-muted-foreground mb-6">
            Are you sure you want to delete this scan? This action cannot be undone.
          </p>
          <p className="text-xs text-muted-foreground font-mono mb-6 px-4 py-2 bg-secondary/50 rounded">
            {scanId}
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirm} className="flex-1">
              Delete Scan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
