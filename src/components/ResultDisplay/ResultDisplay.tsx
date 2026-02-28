// src/components/ResultDisplay/ResultDisplay.tsx
import { useStore } from '../../store/useStore';
import styles from './ResultDisplay.module.css';

export function ResultDisplay() {
  const tCurrent = useStore(s => s.ui.tCurrent);
  const setTCurrent = useStore(s => s.setTCurrent);
  const computed = useStore(s => s.computed);
  const pidEnabled = useStore(s => s.pid.enabled);
  const pidOutput = computed.pidRawOutput ?? 0;
  const pidSign = pidOutput >= 0 ? '+' : '';

  return (
    <div className={styles.section}>
      <div className={styles.input}>
        <div className={styles.inputHeader}>
          <span className={styles.inputLabel}>Outdoor</span>
          <span className={styles.inputValue}>{tCurrent}°C</span>
        </div>
        <div className={styles.inputSlider}>
          <span className={`${styles.sliderEnd} ${styles.cold}`}>-30°</span>
          <input
            type="range"
            min="-30"
            max="25"
            step="1"
            value={tCurrent}
            onChange={e => setTCurrent(parseInt((e.target as HTMLInputElement).value))}
            className={styles.tempSlider}
            style={{ '--v': tCurrent, '--min': -30, '--max': 25 } as React.CSSProperties}
          />
          <span className={`${styles.sliderEnd} ${styles.warm}`}>25°</span>
        </div>
      </div>

      <div className={styles.transform}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>

      {pidEnabled && (
        <div className={styles.pidCorrection}>
          <span className={styles.pidLabel}>PID</span>
          <span className={`${styles.pidValue} ${pidOutput >= 0 ? styles.positive : styles.negative}`}>
            {pidSign}{pidOutput.toFixed(1)}°
          </span>
        </div>
      )}

      {pidEnabled && (
        <div className={styles.transform}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      )}

      <div className={styles.output}>
        <span className={styles.outputLabel}>Flow</span>
        <span className={styles.outputValue}>
          {computed.flowTemp?.toFixed(1) ?? '--'}
          <span className={styles.outputUnit}>°C</span>
        </span>
        <div className={styles.status}>
          <span className={styles.statusDot} />
          <span className={styles.statusText}>{computed.status}</span>
        </div>
      </div>
    </div>
  );
}
