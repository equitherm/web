// src/components/ControlsCard/SliderControl.tsx
import type { ReactNode } from 'react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
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
  // Format anchor values
  const formatAnchor = (val: number) => {
    if (val < 0) return `${val}°`;
    if (unit === '°C') return `${val}°`;
    if (unit === '') return val.toString();
    return `${val}${unit}`;
  };

  const handleValueChange = (values: number[]) => {
    onChange(values[0]);
  };

  return (
    <div className="flex flex-col gap-[0.3rem] mb-4 last:mb-0">
      {/* Row 1: Label + Tooltip */}
      <div className="flex items-center justify-between">
        <span className={styles.label}>{label}</span>
        {tooltip as React.ReactNode}
      </div>

      {/* Row 2: Value (hero) */}
      <span className={cn('font-mono', styles.valueHero)}>
        {value}{unit}
      </span>

      {/* Row 3: Slider with anchors */}
      <div className="flex items-center gap-2">
        <span className={cn('font-mono', styles.anchor)}>
          {formatAnchor(min)}
        </span>
        <Slider
          id={id}
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={handleValueChange}
          className={cn('flex-1 cursor-pointer', styles.sliderTrack)}
        />
        <span className={cn('font-mono', styles.anchor, styles.anchorRight)}>
          {formatAnchor(max)}
        </span>
      </div>
    </div>
  );
}
