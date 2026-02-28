// src/components/Header/Header.tsx
import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { useTheme } from '../../contexts/ThemeContext';
import { ResultDisplay } from '../ResultDisplay';
import { YAMLModal } from '../Modals/YAMLModal';
import { PresetsDropdown } from './PresetsDropdown';
import { showToast } from '../Toast/Toast';
import styles from './Header.module.css';

export function Header() {
  const { theme, setTheme } = useTheme();
  const [yamlOpen, setYamlOpen] = useState(false);

  const handleShare = () => {
    const curve = useStore.getState().curve;
    const pid = useStore.getState().pid;
    const params = new URLSearchParams({
      t: String(curve.tTarget),
      hc: String(curve.hc),
      n: String(curve.n),
      s: String(curve.shift),
      min: String(curve.minFlow),
      max: String(curve.maxFlow),
      pid: pid.enabled ? '1' : '0',
    });
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(url);
    showToast('URL copied to clipboard', 'success');
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1>Equitherm Calculator</h1>
        </div>

        <div className={styles.utilityBar}>
          <button className={styles.utilityBtn} title="Copy ESPHome YAML config" onClick={() => setYamlOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            <span>YAML</span>
          </button>
          <button className={styles.utilityBtn} title="Copy shareable URL" onClick={handleShare}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
            <span>Share</span>
          </button>
          <PresetsDropdown />
        </div>

        <ResultDisplay />

        <div className={styles.themeSelector}>
          <button
            className={`${styles.themeBtn} ${theme === 'esphome' ? styles.active : ''}`}
            onClick={() => setTheme('esphome')}
            title="ESPHome Dark"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>
            </svg>
          </button>
          <button
            className={`${styles.themeBtn} ${theme === 'esphome-light' ? styles.active : ''}`}
            onClick={() => setTheme('esphome-light')}
            title="ESPHome Light"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
            </svg>
          </button>
        </div>
      </header>

      <YAMLModal isOpen={yamlOpen} onClose={() => setYamlOpen(false)} />
    </>
  );
}
