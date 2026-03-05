// src/App.tsx
import { useEffect, useState } from 'react';
import { useStore } from './store/useStore';
import { loadFromURL } from './config/storage';
import { Sidebar } from './components/AppShell/Sidebar';
import { MobileBottomSheet } from './components/AppShell/MobileBottomSheet';
import { Header } from './components/AppShell/Header';
import { HeatingChart } from './components/Chart';
import { TooltipProvider } from './components/ui/tooltip';
import { ThemedToaster } from './components/ThemedToaster';
import './index.css';

function App() {
  const loadConfig = useStore(s => s.loadConfig);
  const [activeTab, setActiveTab] = useState('curve');

  useEffect(() => {
    const urlConfig = loadFromURL();
    if (urlConfig) loadConfig(urlConfig);
  }, [loadConfig]);

  return (
    <TooltipProvider>
      <div className="atmosphere" />
      <div className="min-h-dvh max-w-screen-2xl mx-auto px-3.5 py-2.5 sm:px-6 sm:py-4 pb-20 md:pb-4">
        <Header />
        <main className="@container grid grid-cols-1 gap-4 md:grid-cols-[minmax(340px,400px)_1fr]">
          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Chart */}
          <div className="min-h-[300px] md:min-h-0">
            <HeatingChart />
          </div>
        </main>

        {/* Mobile Bottom Sheet */}
        <MobileBottomSheet activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      <ThemedToaster />
    </TooltipProvider>
  );
}

export default App;
