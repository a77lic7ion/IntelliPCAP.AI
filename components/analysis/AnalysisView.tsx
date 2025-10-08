
import React, { useMemo } from 'react';
import { Packet, Protocol, AnalysisSummary } from '../../types';
import AiAnalysisPanel from './AiAnalysisPanel';
import PacketTable from './PacketTable';
import DetailsPanels from './DetailsPanels';
import { ChatIcon, ExportIcon, HttpIcon, HttpsIcon, Ipv4Icon, ArpIcon, DnsIcon, TcpIcon, UdpIcon, StartOverIcon } from '../common/Icons';

interface AnalysisViewProps {
  packets: Packet[];
  filteredPackets: Packet[];
  fileName: string;
  onRunAnalysis: (tierId: 'quick' | 'standard' | 'comprehensive') => void;
  analysisSummary: AnalysisSummary | null;
  isLoadingAnalysis: boolean;
  onOpenChat: () => void;
  onStartOver: () => void;
  activeFilters: Protocol[];
  setActiveFilters: React.Dispatch<React.SetStateAction<Protocol[]>>;
  sourceIpFilter: string;
  setSourceIpFilter: (value: string) => void;
  destinationIpFilter: string;
  setDestinationIpFilter: (value: string) => void;
  selectedPacket: Packet | null;
  setSelectedPacket: (packet: Packet | null) => void;
}

const protocolFilters = [Protocol.HTTP, Protocol.HTTPS, Protocol.IPv4, Protocol.ARP, Protocol.DNS];

const protocolIcons: Record<Protocol, React.FC<{ className?: string }>> = {
  [Protocol.HTTP]: HttpIcon,
  [Protocol.HTTPS]: HttpsIcon,
  [Protocol.IPv4]: Ipv4Icon,
  [Protocol.ARP]: ArpIcon,
  [Protocol.DNS]: DnsIcon,
  [Protocol.TCP]: TcpIcon,
  [Protocol.UDP]: UdpIcon,
};


const AnalysisView: React.FC<AnalysisViewProps> = ({ 
  packets, 
  filteredPackets,
  fileName, 
  onRunAnalysis,
  analysisSummary,
  isLoadingAnalysis,
  onOpenChat,
  onStartOver,
  activeFilters,
  setActiveFilters,
  sourceIpFilter,
  setSourceIpFilter,
  destinationIpFilter,
  setDestinationIpFilter,
  selectedPacket,
  setSelectedPacket
}) => {
  const toggleFilter = (protocol: Protocol) => {
    setActiveFilters(prev =>
      prev.includes(protocol)
        ? prev.filter(p => p !== protocol)
        : [...prev, protocol]
    );
  };

  const handleClearFilters = () => {
    setActiveFilters([]);
    setSourceIpFilter('');
    setDestinationIpFilter('');
  };
  
  const handleExportCSV = () => {
    if (filteredPackets.length === 0) {
      alert("No packets to export.");
      return;
    }

    const headers = ['#', 'Time', 'Protocol', 'Source', 'Destination', 'Size', 'Info'];
    const rows = filteredPackets.map(p => {
      const info = `"${p.info.replace(/"/g, '""')}"`;
      return [p.id, p.time, p.protocol, p.source, p.destination, p.size, info].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `intellipcap_export_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel */}
        <div className="lg:col-span-3">
          <AiAnalysisPanel 
            onRunAnalysis={onRunAnalysis} 
            summary={analysisSummary} 
            isLoading={isLoadingAnalysis}
            totalPackets={packets.length}
          />
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-9">
          {/* Filters and Packet Table */}
          <div className="bg-brand-gray-dark p-6 rounded-lg">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-white font-semibold mr-2 shrink-0">Filter by Protocol:</span>
              {protocolFilters.map(proto => {
                const Icon = protocolIcons[proto];
                return (
                  <button
                    key={proto}
                    onClick={() => toggleFilter(proto)}
                    className={`flex items-center gap-2 px-3 py-1 text-sm font-semibold rounded-full transition-colors shrink-0 ${
                      activeFilters.includes(proto)
                        ? 'bg-brand-green text-brand-dark'
                        : 'bg-brand-gray-light text-white hover:bg-opacity-70'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {proto}
                  </button>
                )
              })}
            </div>

             <div className="flex flex-wrap items-center gap-2 mb-4">
               <span className="text-white font-semibold mr-2 shrink-0">Filter by IP:</span>
               <input
                  type="text"
                  placeholder="Source IP..."
                  value={sourceIpFilter}
                  onChange={(e) => setSourceIpFilter(e.target.value)}
                  className="bg-brand-gray-light text-white placeholder-brand-gray-text px-3 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-green w-full sm:w-auto"
               />
               <input
                  type="text"
                  placeholder="Destination IP..."
                  value={destinationIpFilter}
                  onChange={(e) => setDestinationIpFilter(e.target.value)}
                  className="bg-brand-gray-light text-white placeholder-brand-gray-text px-3 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-green w-full sm:w-auto"
               />
              <button onClick={handleClearFilters} className="px-3 py-1 text-sm font-semibold rounded-full bg-brand-red text-white hover:bg-opacity-80 shrink-0">
                Clear All Filters
              </button>
              <div className="flex-grow"></div> {/* Spacer */}
              <button 
                onClick={handleExportCSV} 
                className="flex items-center gap-2 px-3 py-1 text-sm font-semibold rounded-full bg-brand-gray-light text-white hover:bg-opacity-70 transition-colors shrink-0"
                title="Export filtered data to CSV"
              >
                <ExportIcon className="w-4 h-4" />
                Export as CSV
              </button>
            </div>
            
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
              <div>
                  <h2 className="text-xl text-white font-bold">Packets ({filteredPackets.length} of {packets.length})</h2>
                  <p className="text-sm text-brand-gray-text">{fileName}</p>
              </div>
              {analysisSummary && (
                  <button
                      onClick={onStartOver}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md bg-brand-red text-white hover:bg-opacity-80 transition-all"
                      aria-label="Start a new analysis"
                  >
                      <StartOverIcon className="w-5 h-5" />
                      Start Over
                  </button>
              )}
            </div>

            <PacketTable packets={filteredPackets} onPacketSelect={setSelectedPacket} selectedPacketId={selectedPacket?.id} />
          </div>
          
          {/* Details Section */}
          <div className="mt-6">
            <DetailsPanels selectedPacket={selectedPacket} summary={analysisSummary} />
          </div>
        </div>
      </div>
      <button 
        onClick={onOpenChat}
        className="fixed bottom-8 right-8 bg-brand-green text-brand-dark p-4 rounded-full shadow-lg hover:scale-110 transition-transform"
        aria-label="Open AI Assistant"
      >
        <ChatIcon className="h-8 w-8" />
      </button>
    </div>
  );
};

export default AnalysisView;
