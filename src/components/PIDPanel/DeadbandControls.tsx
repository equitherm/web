// src/components/PIDPanel/DeadbandControls.tsx
import type { ReactNode } from 'react';
import { useStore } from '../../store/useStore';
import { InfoTooltip } from '../ControlsCard/InfoTooltip';
import styles from './PIDPanel.module.css';

interface DeadbandInstrumentProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  tooltipTitle?: string;
  tooltipContent?: ReactNode;
}

interface DeadbandInstrumentProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
}

// Standard instrument control (affects curve)
function DeadbandInstrument({ label, min, max, step, value, onChange, unit = '°' }: DeadbandInstrumentProps) {
  const pct = ((value - min) / (max - min)) * 100;

  const formatAnchor = (val: number) => {
    if (val < 0) return `${val}${unit}`;
    return `${val}${unit}`;
  };

  return (
    <div className={styles.gainInstrument}>
      <div className={styles.gainHeader}>
        <span className={styles.gainLabelText}>{label}</span>
        <span className={styles.gainHeroValue}>{value.toFixed(1)}{unit}</span>
      </div>
      <div className={styles.gainSliderRow}>
        <span className={styles.gainAnchor}>{formatAnchor(min)}</span>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(parseFloat((e.target as HTMLInputElement).value))}
          style={{ '--pct': `${pct}%` } as React.CSSProperties}
        />
        <span className={styles.gainAnchor}>{formatAnchor(max)}</span>
      </div>
    </div>
  );
}

interface TimeDomainInstrumentProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  tooltipContent?: React.ReactNode;
}

// Time-domain instrument (YAML export only, no curve impact)
function TimeDomainInstrument({ label, min, max, step, value, onChange, tooltipContent }: TimeDomainInstrumentProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className={styles.timeDomainInstrument}>
      <div className={styles.timeDomainHeader}>
        <div className={styles.timeDomainLabelRow}>
          <span className={styles.gainLabelText}>{label}</span>
          <span className={styles.yamlBadge}>YAML</span>
          {tooltipContent && (
            <InfoTooltip title="Time-domain parameter" position="sideLeft" size="small">
              {tooltipContent}
            </InfoTooltip>
          )}
        </div>
        <span className={styles.timeDomainValue}>{value.toFixed(2)}</span>
      </div>
      <div className={styles.timeDomainSliderRow}>
        <span className={styles.gainAnchor}>{min}</span>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(parseFloat((e.target as HTMLInputElement).value))}
          style={{ '--pct': `${pct}%` } as React.CSSProperties}
        />
        <span className={styles.gainAnchor}>{max}</span>
      </div>
    </div>
  );
}

export function DeadbandControls() {
  const pid = useStore(s => s.pid);
  const setPidParam = useStore(s => s.setPidParam);

  return (
    <details className={styles.deadbandSection} open>
      <summary className={styles.deadbandHeader}>
        <label className={`${styles.toggle} ${styles.toggleMini}`} onClick={e => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={pid.deadbandEnabled}
            onChange={e => setPidParam('deadbandEnabled', (e.target as HTMLInputElement).checked)}
          />
          <span className={styles.toggleSlider} />
        </label>
        <span className={styles.sectionLabel}>Deadband</span>
        <InfoTooltip title="Deadband" icon={<span>?</span>} position="sideLeft">
          <p>A <strong>tolerance zone</strong> where PID output is reduced to prevent constant small adjustments.</p>
          <p>When room temp error is within [Low, High], gains are multiplied by their reduction factors.</p>
        </InfoTooltip>
      </summary>

      <div className={styles.deadbandContent}>
        {/* Instantaneous - affects curve */}
        <div className={styles.deadbandSubsection}>
          <span className={styles.subsectionLabel}>Thresholds & Kp</span>
          <div className={styles.gainInstruments}>
            <DeadbandInstrument
              label="High"
              min={0}
              max={2}
              step={0.1}
              value={pid.deadbandThresholdHigh}
              onChange={v => setPidParam('deadbandThresholdHigh', v)}
            />
            <DeadbandInstrument
              label="Low"
              min={0}
              max={-2}
              step={0.1}
              value={pid.deadbandThresholdLow}
              onChange={v => setPidParam('deadbandThresholdLow', v)}
            />
            <DeadbandInstrument
              label="Kp ÷"
              min={0}
              max={1}
              step={0.1}
              value={pid.deadbandKpMultiplier}
              onChange={v => setPidParam('deadbandKpMultiplier', v)}
              unit=""
            />
          </div>
        </div>

        {/* Time-domain - YAML export only */}
        <div className={styles.timeDomainSubsection}>
          <div className={styles.timeDomainSectionHeader}>
            <span className={styles.subsectionLabel}>Ki / Kd Multipliers</span>
            <InfoTooltip title="Time-domain parameters" icon={<span>⏱</span>} position="sideLeft" size="small">
              <p><strong>Export only</strong> — These values require real-time sensor data over time.</p>
              <p>Ki (integral) accumulates error. Kd (derivative) measures rate of change.</p>
              <p>They won't affect the curve preview but will be included in your ESPHome YAML.</p>
            </InfoTooltip>
          </div>
          <div className={styles.timeDomainInstruments}>
            <TimeDomainInstrument
              label="Ki ×"
              min={0}
              max={1}
              step={0.05}
              value={pid.deadbandKiMultiplier}
              onChange={v => setPidParam('deadbandKiMultiplier', v)}
              tooltipContent={
                <p>Multiplier for integral gain in deadband. Often 0 to prevent windup.</p>
              }
            />
            <TimeDomainInstrument
              label="Kd ×"
              min={0}
              max={1}
              step={0.05}
              value={pid.deadbandKdMultiplier}
              onChange={v => setPidParam('deadbandKdMultiplier', v)}
              tooltipContent={
                <p>Multiplier for derivative gain in deadband. Reduces D-term response near setpoint.</p>
              }
            />
          </div>
        </div>
      </div>
    </details>
  );
}
