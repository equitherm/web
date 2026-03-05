// src/components/PIDPanel/GainControls.tsx
import { useStore } from '@/store/useStore';
import { InfoTooltip } from '../ControlsCard/InfoTooltip';
import { SliderVariant } from '@/components/ControlsCard/slider-variants';

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
  tooltipIcon?: React.ReactNode;
}

// Instantaneous control (affects curve)
function GainInstrument({ label, min, max, step, value, onChange, unit = '', tooltipTitle, tooltipContent, tooltipIcon }: GainInstrumentProps) {
  const formatAnchor = (val: number) => `${val}${unit}`;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between">
        <div className="flex items-center gap-1">
          <span className="text-[0.6rem] font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
          {tooltipTitle && (
            <InfoTooltip title={tooltipTitle} icon={tooltipIcon} position="sideLeft" size="small">
              {tooltipContent}
            </InfoTooltip>
          )}
        </div>
        <span className="font-mono text-lg font-bold text-primary leading-none">{value.toFixed(unit === '°' ? 1 : 2)}{unit}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[0.7rem] font-medium text-muted-foreground whitespace-nowrap flex-shrink-0 min-w-[1.5rem]">{formatAnchor(min)}</span>
        <SliderVariant
          variant="primary"
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={(vals) => onChange(vals[0])}
          className="flex-1 cursor-pointer"
        />
        <span className="font-mono text-[0.7rem] font-medium text-muted-foreground whitespace-nowrap flex-shrink-0 min-w-[1.5rem] text-right">{formatAnchor(max)}</span>
      </div>
    </div>
  );
}

export function GainControls() {
  const pid = useStore(s => s.pid);
  const setPidParam = useStore(s => s.setPidParam);
  const roomConfig = ROOM_TEMP_CONFIG[pid.mode];

  return (
    <div className="px-4 py-3 border-b border-border">
      <span className="block text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest mb-3">Gains</span>

      {/* Instantaneous - affects curve */}
      <div className="flex flex-col gap-3">
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
          tooltipTitle="Proportional Gain"
          tooltipIcon={<span>Kp</span>}
          tooltipContent={
            <>
              <p>How strongly the system reacts to the <strong>current error</strong> (room vs setpoint).</p>
              <p><code>output = Kp × error</code></p>
              <p>Higher = faster response but risk overshoot.</p>
            </>
          }
        />
      </div>
    </div>
  );
}
