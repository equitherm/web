// src/components/ControlsCard/SliderControl.tsx
import type { ReactNode } from 'react';
import styles from './SliderControl.module.css';

interface SliderControlProps {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  unit: string;
  onChange: (value: number) => void;
  tooltip?: ReactNode;
}

export function SliderControl({ id, label, min, max, step, value, unit, onChange, tooltip }: SliderControlProps) {
  // Calculate percentage for filled track
  const pct = ((value - min) / (max - min)) * 100;

  // Format anchor values
  const formatAnchor = (val: number) => {
    if (val < 0) return `${val}°`;
    if (unit === '°C') return `${val}°`;
    if (unit === '') return val.toString();
    return `${val}${unit}`;
  };

  return (
    <div className={styles.control}>
      {/* Row 1: Label + Tooltip */}
      <div className={styles.header}>
        <span className={styles.labelText}>{label}</span>
        {/* Preact ComponentChildren is not directly compatible with ReactNode */}
        {(tooltip as React.ReactNode)}
      </div>

      {/* Row 2: Value (hero) */}
      <span className={styles.value}>
        {value}{unit}
      </span>

      {/* Row 3: Slider with anchors */}
      <div className={styles.sliderRow}>
        <span className={styles.anchor}>{formatAnchor(min)}</span>
        <input
          type="range"
          id={id}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(parseFloat((e.target as HTMLInputElement).value))}
          style={{ '--pct': `${pct}%` } as React.CSSProperties}
        />
        <span className={styles.anchor}>{formatAnchor(max)}</span>
      </div>
    </div>
  );
}
