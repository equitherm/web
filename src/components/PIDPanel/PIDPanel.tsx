// src/components/PIDPanel/PIDPanel.tsx
import { useStore } from '../../store/useStore';
import { GainControls } from './GainControls';
import { DeadbandControls } from './DeadbandControls';
import { InfoTooltip } from '../ControlsCard/InfoTooltip';
import styles from './PIDPanel.module.css';

const PIDIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>
);

export function PIDPanel() {
  const pid = useStore(s => s.pid);
  const setPidParam = useStore(s => s.setPidParam);

  return (
    <section className={`${styles.panel} ${!pid.enabled ? styles.disabled : ''}`}>
      {/* Enable Header */}
      <div className={styles.enable}>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={pid.enabled}
            onChange={e => setPidParam('enabled', (e.target as HTMLInputElement).checked)}
          />
          <span className={styles.toggleSlider} />
        </label>
        <span className={styles.title}>PID Control</span>
        <InfoTooltip title="PID Control" icon={<PIDIcon />} position="sideLeft">
          <p><strong>Proportional-Integral-Derivative</strong> control adjusts flow temperature based on room temperature error.</p>
          <p>Room temp can be an offset from setpoint or absolute value.</p>
        </InfoTooltip>
      </div>

      {/* Mode Toggle Row */}
      <div className={styles.modeRow}>
        <div className={styles.modeToggle}>
          <button
            className={`${styles.modeBtn} ${pid.mode === 'offset' ? styles.active : ''}`}
            onClick={() => {
              setPidParam('mode', 'offset');
              setPidParam('roomTemp', 0);
            }}
          >
            Offset
          </button>
          <button
            className={`${styles.modeBtn} ${pid.mode === 'absolute' ? styles.active : ''}`}
            onClick={() => {
              setPidParam('mode', 'absolute');
              setPidParam('roomTemp', 21);
            }}
          >
            Absolute
          </button>
        </div>
      </div>

      {/* Gains Section */}
      <GainControls />

      {/* Deadband Section (collapsible) */}
      <DeadbandControls />
    </section>
  );
}
