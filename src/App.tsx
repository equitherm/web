// src/App.tsx
import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { loadFromURL } from './config/storage';
import { Header } from './components/Header';
import { ControlsCard } from './components/ControlsCard';
import { HeatingChart } from './components/Chart';
import { PIDPanel } from './components/PIDPanel';
import { TooltipProvider } from './components/ui/tooltip';
import './index.css';

function App() {
  const loadConfig = useStore(s => s.loadConfig);

  // Load config from URL on mount
  useEffect(() => {
    const urlConfig = loadFromURL();
    if (urlConfig) {
      loadConfig(urlConfig);
    }
  }, [loadConfig]);

  return (
    <TooltipProvider>
      <div className="atmosphere" />
      <div className="min-h-screen max-w-[1600px] mx-auto px-3.5 py-2.5 sm:px-6 sm:py-4">
        <Header />
        <main className="grid grid-cols-1 grid-rows-[auto_auto_auto] gap-4 min-h-0 md:grid-cols-[minmax(280px,320px)_1fr] md:grid-rows-[minmax(0,1fr)] lg:grid-cols-[minmax(240px,280px)_1fr_minmax(240px,280px)]">
          <div className="col-start-1 row-start-1"><ControlsCard /></div>
          <div className="col-start-1 row-start-2 min-h-[300px] md:col-start-2 md:row-start-1"><HeatingChart /></div>
          <div className="col-start-1 row-start-3 md:col-start-2 md:row-start-2 lg:col-start-3 lg:row-start-1"><PIDPanel /></div>
        </main>
      </div>
    </TooltipProvider>
  );
}

export default App;
