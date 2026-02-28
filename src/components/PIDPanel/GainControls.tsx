// src/components/PIDPanel/GainControls.tsx
import { useStore } from '../../store/useStore';
import { InfoTooltip } from '../ControlsCard/InfoTooltip';
import styles from './PIDPanel.module.css';

const ROOM_TEMP_CONFIG = {
  offset:   { min: -5, max: 5, step: 0.1, label: 'Room Offset' },
  absolute: { min: 10, max: 30, step: 0.5, label: 'Room Temp' },
} as const;

interface GainInstrumentProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  tooltipTitle?: string;
  tooltipContent?: React.ReactNode;
}

// Instantaneous control (affects curve)
function GainInstrument({ label, min, max, step, value, onChange, unit = '', tooltipTitle, tooltipContent }: GainInstrumentProps) {
  const pct = ((value - min) / (max - min)) * 100;

  const formatAnchor = (val: number) => {
    if (val < 0) return `${val}${unit}`;
    if (unit === '°') return `${val}°`;
    return `${val}${unit}`;
  };

  return (
    <div className={styles.gainInstrument}>
      <div className={styles.gainHeader}>
        <div className={styles.gainLabelWithInfo}>
          <span className={styles.gainLabelText}>{label}</span>
          {tooltipTitle && (
            <InfoTooltip title={tooltipTitle} position="sideLeft" size="small">
              {tooltipContent}
            </InfoTooltip>
          )}
        </div>
        <span className={styles.gainHeroValue}>{value.toFixed(unit === '°' ? 1 : 2)}{unit}</span>
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

  const formatAnchor = (val: number) => {
    if (val < 0) return `${val}`;
    return `${val}`;
  };

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

export function GainControls() {
  const pid = useStore(s => s.pid);
  const setPidParam = useStore(s => s.setPidParam);
  const roomConfig = ROOM_TEMP_CONFIG[pid.mode];

  return (
    <div className={styles.gainsSection}>
      <span className={styles.sectionLabel}>Gains</span>

      {/* Instantaneous - affects curve */}
      <div className={styles.gainInstruments}>
        <GainInstrument
          label={roomConfig.label}
          min={roomConfig.min}
          max={roomConfig.max}
          step={roomConfig.step}
          value={pid.roomTemp}
          onChange={v => setPidParam('roomTemp', v)}
          unit="°"
        />

        <GainInstrument
          label="Kp — Proportional"
          min={0}
          max={5}
          step={0.1}
          value={pid.kp}
          onChange={v => setPidParam('kp', v)}
          tooltipTitle="Proportional Gain (Kp)"
          tooltipContent={
            <>
              <p>How strongly the system reacts to the <strong>current error</strong> (room vs setpoint).</p>
              <p><code>output = Kp × error</code></p>
              <p>Higher = faster response but risk overshoot.</p>
            </>
          }
        />
      </div>

      {/* Time-domain - YAML export only */}
      <div className={styles.timeDomainSubsection}>
        <div className={styles.timeDomainSectionHeader}>
          <span className={styles.subsectionLabel}>Ki / Kd (Time-domain)</span>
          <InfoTooltip title="Time-domain parameters" icon={<span>⏱</span>} position="sideLeft" size="small">
            <p><strong>Export only</strong> — These values require real-time sensor data over time.</p>
            <p>Ki (integral) accumulates error. Kd (derivative) measures rate of change.</p>
            <p>They won't affect the curve preview but will be included in your ESPHome YAML.</p>
          </InfoTooltip>
        </div>
        <div className={styles.timeDomainInstruments}>
          <TimeDomainInstrument
            label="Ki — Integral"
            min={0}
            max={0.5}
            step={0.01}
            value={pid.ki}
            onChange={v => setPidParam('ki', v)}
            tooltipContent={
              <>
                <p>Accumulates error over time to eliminate <strong>steady-state offset</strong>.</p>
                <p><code>output += Ki × error × dt</code></p>
                <p>Use low values. Often 0 for heating.</p>
              </>
            }
          />
          <TimeDomainInstrument
            label="Kd — Derivative"
            min={0}
            max={2}
            step={0.05}
            value={pid.kd}
            onChange={v => setPidParam('kd', v)}
            tooltipContent={
              <>
                <p>Predicts future error by measuring the <strong>rate of change</strong>.</p>
                <p><code>output = Kd × (dError/dt)</code></p>
                <p>Dampens oscillations and reduces overshoot.</p>
              </>
            }
          />
        </div>
      </div>
    </div>
  );
}
