import React from 'react';
import { ForensicProvider, useForensics } from './context/ForensicContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';

// Screen Components
import { LoginScreen } from './components/screens/LoginScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { CreateCaseScreen } from './components/screens/CreateCaseScreen';
import { EvidenceUploadScreen } from './components/screens/EvidenceUploadScreen';
import { DeviceIdentificationScreen } from './components/screens/DeviceIdentificationScreen';
import { ForensicAcquisitionScreen } from './components/screens/ForensicAcquisitionScreen';
import { IntegrityVerificationScreen } from './components/screens/IntegrityVerificationScreen';
import { VideoAnalysisScreen } from './components/screens/VideoAnalysisScreen';
import { AiDetectionScreen } from './components/screens/AiDetectionScreen';
import { TimelineScreen } from './components/screens/TimelineScreen';
import { MultiCameraCorrelationScreen } from './components/screens/MultiCameraCorrelationScreen';
import { RecoveryAnalysisScreen } from './components/screens/RecoveryAnalysisScreen';
import { InvestigationSummaryScreen } from './components/screens/InvestigationSummaryScreen';
import { ForensicReportScreen } from './components/screens/ForensicReportScreen';

const MainLayout: React.FC = () => {
  const { currentScreen, currentUser, isAuthenticated, toggleSidebar } = useForensics();

  // Keyboard shortcut Ctrl+B or Cmd+B to toggle collapsible sidebar
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  if (!isAuthenticated || !currentUser || currentScreen === 'login') {
    return <LoginScreen />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'create-case':
        return <CreateCaseScreen />;
      case 'evidence-upload':
        return <EvidenceUploadScreen />;
      case 'device-identification':
        return <DeviceIdentificationScreen />;
      case 'forensic-acquisition':
        return <ForensicAcquisitionScreen />;
      case 'integrity-verification':
        return <IntegrityVerificationScreen />;
      case 'video-analysis':
        return <VideoAnalysisScreen />;
      case 'ai-detection':
        return <AiDetectionScreen />;
      case 'timeline':
        return <TimelineScreen />;
      case 'multi-camera':
        return <MultiCameraCorrelationScreen />;
      case 'recovery-analysis':
        return <RecoveryAnalysisScreen />;
      case 'investigation-summary':
        return <InvestigationSummaryScreen />;
      case 'forensic-report':
        return <ForensicReportScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0e11] text-[#f3f6fc] flex flex-col font-sans selection:bg-[#44474a] selection:text-white">
      <Header />
      <Sidebar />

      {/* Main Content Area - Expands automatically when sidebar is collapsed */}
      <main className="flex-1 pt-16 pb-12 transition-all duration-300 md:pl-14 px-2 sm:px-4 md:px-6">
        <div className="max-w-[1700px] mx-auto py-2">
          <div key={currentScreen} className="animate-page-enter">
            {renderScreen()}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ForensicProvider>
      <MainLayout />
    </ForensicProvider>
  );
}
