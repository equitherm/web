// src/App.tsx
import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { loadFromURL } from './config/storage';
import { Header } from './components/Header';
import { ControlsCard } from './components/ControlsCard';
import { HeatingChart } from './components/Chart';
import { PIDPanel } from './components/PIDPanel';
import { ToastContainer } from './components/Toast';
import './index.css';
import styles from './App.module.css';

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
    <>
      <div className="atmosphere" />
      <div className={styles.appContainer}>
        <Header />
        <main className={styles.mainLayout}>
          <div className={styles.controls}><ControlsCard /></div>
          <div className={styles.chart}><HeatingChart /></div>
          <div className={styles.pid}><PIDPanel /></div>
        </main>
        <ToastContainer />
      </div>
    </>
  );
}

export default App;
