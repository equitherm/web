// src/components/PIDPanel/GainControls.tsx
import { useStore } from '../../store/useStore';
import { InfoTooltip } from '../ControlsCard/InfoTooltip';
import { SliderVariant } from '@/components/ui/slider-variants';

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
  const formatAnchor = (val: number) => {
    if (val < 0) return `${val}${unit}`;
    if (unit === '°') return `${val}°`;
    return `${val}${unit}`;
  };

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
        <span className="font-mono text-[0.55rem] font-medium text-muted-foreground whitespace-nowrap flex-shrink-0 min-w-[1.5rem]">{formatAnchor(min)}</span>
        <SliderVariant
          variant="primary"
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={(vals) => onChange(vals[0])}
          className="flex-1 cursor-pointer"
        />
        <span className="font-mono text-[0.55rem] font-medium text-muted-foreground whitespace-nowrap flex-shrink-0 min-w-[1.5rem] text-right">{formatAnchor(max)}</span>
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
  tooltipTitle?: string;
  tooltipContent?: React.ReactNode;
  tooltipIcon?: React.ReactNode;
}

// Time-domain instrument (YAML export only, no curve impact)
function TimeDomainInstrument({ label, min, max, step, value, onChange, tooltipTitle, tooltipContent, tooltipIcon }: TimeDomainInstrumentProps) {
  const formatAnchor = (val: number) => {
    if (val < 0) return `${val}`;
    return `${val}`;
  };

  return (
    <div className="flex flex-col gap-0.5 opacity-85">
      <div className="flex items-baseline justify-between">
        <div className="flex items-center gap-1">
          <span className="text-[0.6rem] font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
          {tooltipContent && (
            <InfoTooltip title={tooltipTitle || 'Time-domain parameter'} icon={tooltipIcon} position="sideLeft" size="small">
              {tooltipContent}
            </InfoTooltip>
          )}
          <span className="text-[0.45rem] font-bold text-muted-foreground bg-secondary py-0.5 px-1 rounded-[2px] uppercase tracking-wider border border-border">YAML</span>
        </div>
        <span className="font-mono text-sm font-semibold text-secondary-foreground">{value.toFixed(2)}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[0.55rem] font-medium text-muted-foreground whitespace-nowrap flex-shrink-0 min-w-[1.5rem]">{formatAnchor(min)}</span>
        <SliderVariant
          variant="ghost"
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={(vals) => onChange(vals[0])}
          className="flex-1 cursor-pointer opacity-70 hover:opacity-100"
        />
        <span className="font-mono text-[0.55rem] font-medium text-muted-foreground whitespace-nowrap flex-shrink-0 min-w-[1.5rem] text-right">{formatAnchor(max)}</span>
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

      {/* Time-domain - YAML export only */}
      <div className="mt-3 pt-3 border-t border-dashed border-border">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[0.55rem] font-semibold text-muted-foreground uppercase tracking-widest opacity-80">Ki / Kd (Time-domain)</span>
          <InfoTooltip title="Time-domain parameters" icon={<span>⏱</span>} position="sideLeft" size="small">
            <p><strong>Export only</strong> — These values require real-time sensor data over time.</p>
            <p>Ki (integral) accumulates error. Kd (derivative) measures rate of change.</p>
            <p>They won't affect the curve preview but will be included in your ESPHome YAML.</p>
          </InfoTooltip>
        </div>
        <div className="flex flex-col gap-2">
          <TimeDomainInstrument
            label="Ki — Integral"
            min={0}
            max={0.5}
            step={0.01}
            value={pid.ki}
            onChange={v => setPidParam('ki', v)}
            tooltipTitle="Integral Gain"
            tooltipIcon={<span>Ki</span>}
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
            tooltipTitle="Derivative Gain"
            tooltipIcon={<span>Kd</span>}
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
