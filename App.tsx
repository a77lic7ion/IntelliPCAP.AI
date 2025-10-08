
import React, { useState, useCallback, useMemo } from 'react';
import Header from './components/Header';
import UploadView from './components/UploadView';
import AnalysisView from './components/analysis/AnalysisView';
import ChatAssistant from './components/ChatAssistant';
import { Packet, AnalysisSummary, Protocol } from './types';
import { SAMPLE_PACKETS } from './constants';
import { runAnalysis } from './services/geminiService';

type AppView = 'upload' | 'analysis';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('upload');
  const [packets, setPackets] = useState<Packet[]>([]);
  const [fileName, setFileName] = useState('');
  const [analysisSummary, setAnalysisSummary] = useState<AnalysisSummary | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Lifted state from AnalysisView for global context
  const [activeFilters, setActiveFilters] = useState<Protocol[]>([]);
  const [selectedPacket, setSelectedPacket] = useState<Packet | null>(null);
  const [sourceIpFilter, setSourceIpFilter] = useState('');
  const [destinationIpFilter, setDestinationIpFilter] = useState('');

  const filteredPackets = useMemo(() => {
    const sourceFilter = sourceIpFilter.trim().toLowerCase();
    const destinationFilter = destinationIpFilter.trim().toLowerCase();

    if (packets.length === 0) return [];

    return packets.filter(packet => {
      const protocolMatch = activeFilters.length === 0 || activeFilters.includes(packet.protocol);
      const sourceMatch = !sourceFilter || packet.source.toLowerCase().includes(sourceFilter);
      const destinationMatch = !destinationFilter || packet.destination.toLowerCase().includes(destinationFilter);

      return protocolMatch && sourceMatch && destinationMatch;
    });
  }, [packets, activeFilters, sourceIpFilter, destinationIpFilter]);

  const handleFileSelect = useCallback((file: File) => {
    setPackets(SAMPLE_PACKETS);
    setFileName(file.name);
    setAnalysisSummary(null);
    // Reset filters and selection on new file
    setActiveFilters([]);
    setSourceIpFilter('');
    setDestinationIpFilter('');
    setSelectedPacket(null);
    setView('analysis');
  }, []);

  const handleRunAnalysis = useCallback(async (tierId: 'quick' | 'standard' | 'comprehensive') => {
    setIsLoadingAnalysis(true);
    setAnalysisSummary(null);
    try {
      const summary = await runAnalysis(tierId);
      setAnalysisSummary(summary);
    } catch (error) {
      console.error("Failed to run analysis:", error);
    } finally {
      setIsLoadingAnalysis(false);
    }
  }, []);

  const handleStartOver = useCallback(() => {
    setView('upload');
    setPackets([]);
    setFileName('');
    setAnalysisSummary(null);
    setIsLoadingAnalysis(false);
    setIsChatOpen(false);
    // Reset lifted state
    setActiveFilters([]);
    setSourceIpFilter('');
    setDestinationIpFilter('');
    setSelectedPacket(null);
  }, []);

  return (
    <div className="bg-brand-dark min-h-screen text-white">
      <Header onLogoClick={handleStartOver} />
      <main>
        {view === 'upload' ? (
          <UploadView onFileSelect={handleFileSelect} />
        ) : (
          <AnalysisView 
            packets={packets} 
            filteredPackets={filteredPackets}
            fileName={fileName}
            onRunAnalysis={handleRunAnalysis}
            analysisSummary={analysisSummary}
            isLoadingAnalysis={isLoadingAnalysis}
            onOpenChat={() => setIsChatOpen(true)}
            onStartOver={handleStartOver}
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
            sourceIpFilter={sourceIpFilter}
            setSourceIpFilter={setSourceIpFilter}
            destinationIpFilter={destinationIpFilter}
            setDestinationIpFilter={setDestinationIpFilter}
            selectedPacket={selectedPacket}
            setSelectedPacket={setSelectedPacket}
          />
        )}
      </main>
      <ChatAssistant 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        analysisSummary={analysisSummary} 
        filteredPackets={filteredPackets}
        selectedPacket={selectedPacket}
      />
    </div>
  );
};

export default App;
