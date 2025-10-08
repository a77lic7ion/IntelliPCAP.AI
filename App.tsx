
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import UploadView from './components/UploadView';
import AnalysisView from './components/analysis/AnalysisView';
import ChatAssistant from './components/ChatAssistant';
import { Packet, AnalysisSummary } from './types';
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

  const handleFileSelect = useCallback((file: File | 'sample') => {
    // In a real app, you would parse the file here.
    // For this demo, we'll just use sample data.
    setPackets(SAMPLE_PACKETS);
    setFileName(file === 'sample' ? 'sample_capture.pcap' : file.name);
    setAnalysisSummary(null); // Reset summary on new file
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
      // You could set an error state here to show in the UI
    } finally {
      setIsLoadingAnalysis(false);
    }
  }, []);

  return (
    <div className="bg-brand-dark min-h-screen text-white">
      <Header />
      <main>
        {view === 'upload' ? (
          <UploadView onFileSelect={handleFileSelect} />
        ) : (
          <AnalysisView 
            packets={packets} 
            fileName={fileName}
            onRunAnalysis={handleRunAnalysis}
            analysisSummary={analysisSummary}
            isLoadingAnalysis={isLoadingAnalysis}
            onOpenChat={() => setIsChatOpen(true)}
          />
        )}
      </main>
      <ChatAssistant isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default App;
