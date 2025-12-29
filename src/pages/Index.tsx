import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { ScanTable } from '@/components/dashboard/ScanTable';
import { DetailsPanel } from '@/components/dashboard/DetailsPanel';
import { NewScanModal } from '@/components/dashboard/NewScanModal';
import { DeleteConfirmModal } from '@/components/dashboard/DeleteConfirmModal';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { mockStats, mockScans } from '@/data/mockData';
import { Scan } from '@/types/scan';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [scans, setScans] = useState<Scan[]>(mockScans);
  const [selectedScan, setSelectedScan] = useState<Scan | null>(null);
  const [isNewScanModalOpen, setIsNewScanModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh(true);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = (silent = false) => {
    setIsRefreshing(true);
    // Simulate API refresh
    setTimeout(() => {
      setIsRefreshing(false);
      if (!silent) {
        toast({
          title: "Data refreshed",
          description: "Scan data has been updated.",
        });
      }
    }, 1000);
  };

  const handleViewDetails = (scan: Scan) => {
    setSelectedScan(scan);
  };

  const handleDeleteScan = (scanId: string) => {
    setDeleteConfirmId(scanId);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      setScans(scans.filter((scan) => scan.id !== deleteConfirmId));
      setDeleteConfirmId(null);
      if (selectedScan?.id === deleteConfirmId) {
        setSelectedScan(null);
      }
      toast({
        title: "Scan deleted",
        description: "The scan has been permanently removed.",
        variant: "destructive",
      });
    }
  };

  const handleScanComplete = () => {
    toast({
      title: "Scan completed",
      description: "New security scan has been added to the list.",
    });
    // In real app, would fetch updated list from API
  };

  return (
    <div className="min-h-screen bg-background cyber-grid">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Sidebar */}
      <Sidebar
        stats={mockStats}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <main 
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        )}
      >
        <Header
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onNewScan={() => setIsNewScanModalOpen(true)}
          onRefresh={() => handleRefresh()}
          isRefreshing={isRefreshing}
        />

        <div className="p-6 space-y-6">
          {/* Stats Overview */}
          <StatsOverview stats={mockStats} />

          {/* Scan Table Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Recent Scans</h2>
                <p className="text-sm text-muted-foreground">
                  {scans.length} scans total • Auto-refreshes every 10s
                </p>
              </div>
            </div>
            <ScanTable
              scans={scans}
              onViewDetails={handleViewDetails}
              onDelete={handleDeleteScan}
            />
          </div>
        </div>
      </main>

      {/* Details Panel */}
      <DetailsPanel 
        scan={selectedScan} 
        onClose={() => setSelectedScan(null)} 
      />

      {/* New Scan Modal */}
      <NewScanModal
        isOpen={isNewScanModalOpen}
        onClose={() => setIsNewScanModalOpen(false)}
        onScanComplete={handleScanComplete}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteConfirmId}
        scanId={deleteConfirmId}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />

      {/* Scan Line Effect */}
      <div className="scan-line" />
    </div>
  );
};

export default Index;
