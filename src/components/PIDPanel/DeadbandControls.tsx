// src/components/PIDPanel/DeadbandControls.tsx
import type { ReactNode } from 'react';
import { useStore } from '../../store/useStore';
import { InfoTooltip } from '../ControlsCard/InfoTooltip';
import { Switch } from '@/components/ui/switch';
import { SliderVariant } from '@/components/ui/slider-variants';

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
  tooltipIcon?: ReactNode;
  reverseLabels?: boolean;
}

// Standard instrument control (affects curve)
function DeadbandInstrument({ label, min, max, step, value, onChange, unit = '°', reverseLabels, tooltipTitle, tooltipContent, tooltipIcon }: DeadbandInstrumentProps) {
  const formatAnchor = (val: number) => {
    if (val < 0) return `${val}${unit}`;
    return `${val}${unit}`;
  };

  const leftVal = reverseLabels ? max : min;
  const rightVal = reverseLabels ? min : max;

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
        <span className="font-mono text-lg font-bold text-primary leading-none">{value.toFixed(1)}{unit}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[0.55rem] font-medium text-muted-foreground whitespace-nowrap flex-shrink-0 min-w-[1.5rem]">{formatAnchor(leftVal)}</span>
        <SliderVariant
          variant="primary"
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={(vals) => onChange(vals[0])}
          className="flex-1 cursor-pointer"
        />
        <span className="font-mono text-[0.55rem] font-medium text-muted-foreground whitespace-nowrap flex-shrink-0 min-w-[1.5rem] text-right">{formatAnchor(rightVal)}</span>
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
        <span className="font-mono text-[0.55rem] font-medium text-muted-foreground whitespace-nowrap flex-shrink-0 min-w-[1.5rem]">{min}</span>
        <SliderVariant
          variant="ghost"
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={(vals) => onChange(vals[0])}
          className="flex-1 cursor-pointer opacity-70 hover:opacity-100"
        />
        <span className="font-mono text-[0.55rem] font-medium text-muted-foreground whitespace-nowrap flex-shrink-0 min-w-[1.5rem] text-right">{max}</span>
      </div>
    </div>
  );
}

export function DeadbandControls() {
  const pid = useStore(s => s.pid);
  const setPidParam = useStore(s => s.setPidParam);

  return (
    <details className="border-b border-border" open>
      <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <div onClick={e => e.stopPropagation()}>
          <Switch
            checked={pid.deadbandEnabled}
            onCheckedChange={(checked) => setPidParam('deadbandEnabled', checked)}
          />
        </div>
        <span className="text-sm font-semibold text-foreground">Deadband</span>
        <InfoTooltip title="Deadband" icon={<span>?</span>} position="sideLeft">
          <p>A <strong>tolerance zone</strong> where PID output is reduced to prevent constant small adjustments.</p>
          <p>When room temp error is within [Low, High], gains are multiplied by their reduction factors.</p>
        </InfoTooltip>
      </summary>

      <div className="px-4 py-3 border-t border-border">
        {/* Instantaneous - affects curve */}
        <div className="mb-3">
          <span className="block text-[0.55rem] font-semibold text-muted-foreground uppercase tracking-widest mb-2 opacity-80">Thresholds & Kp</span>
          <div className="flex flex-col gap-2">
            <DeadbandInstrument
              label="High"
              min={0}
              max={2}
              step={0.1}
              value={pid.deadbandThresholdHigh}
              onChange={v => setPidParam('deadbandThresholdHigh', v)}
              tooltipTitle="High Threshold"
              tooltipIcon={<span>↑</span>}
              tooltipContent={
                <>
                  <p><strong>Upper bound</strong> of the deadband zone.</p>
                  <p>When room temp error is below this value (and above Low), gains are reduced.</p>
                </>
              }
            />
            <DeadbandInstrument
              label="Low"
              min={-2}
              max={0}
              step={0.1}
              value={pid.deadbandThresholdLow}
              onChange={v => setPidParam('deadbandThresholdLow', v)}
              reverseLabels
              tooltipTitle="Low Threshold"
              tooltipIcon={<span>↓</span>}
              tooltipContent={
                <>
                  <p><strong>Lower bound</strong> of the deadband zone.</p>
                  <p>When room temp error is above this value (and below High), gains are reduced.</p>
                </>
              }
            />
            <DeadbandInstrument
              label="Kp ÷"
              min={0}
              max={1}
              step={0.1}
              value={pid.deadbandKpMultiplier}
              onChange={v => setPidParam('deadbandKpMultiplier', v)}
              unit=""
              tooltipTitle="Kp Multiplier"
              tooltipIcon={<span>Kp</span>}
              tooltipContent={
                <>
                  <p><strong>Divisor</strong> for proportional gain when in deadband.</p>
                  <p>Lower values reduce Kp response near setpoint.</p>
                </>
              }
            />
          </div>
        </div>

        {/* Time-domain - YAML export only */}
        <div className="mt-3 pt-3 border-t border-dashed border-border">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-[0.55rem] font-semibold text-muted-foreground uppercase tracking-widest opacity-80">Ki / Kd Multipliers</span>
            <InfoTooltip title="Time-domain parameters" icon={<span>⏱</span>} position="sideLeft" size="small">
              <p><strong>Export only</strong> — These values require real-time sensor data over time.</p>
              <p>Ki (integral) accumulates error. Kd (derivative) measures rate of change.</p>
              <p>They won't affect the curve preview but will be included in your ESPHome YAML.</p>
            </InfoTooltip>
          </div>
          <div className="flex flex-col gap-2">
            <TimeDomainInstrument
              label="Ki ×"
              min={0}
              max={1}
              step={0.05}
              value={pid.deadbandKiMultiplier}
              onChange={v => setPidParam('deadbandKiMultiplier', v)}
              tooltipTitle="Ki Multiplier"
              tooltipIcon={<span>Ki</span>}
              tooltipContent={
                <>
                  <p><strong>Multiplier</strong> for integral gain in deadband.</p>
                  <p>Often 0 to prevent windup.</p>
                </>
              }
            />
            <TimeDomainInstrument
              label="Kd ×"
              min={0}
              max={1}
              step={0.05}
              value={pid.deadbandKdMultiplier}
              onChange={v => setPidParam('deadbandKdMultiplier', v)}
              tooltipTitle="Kd Multiplier"
              tooltipIcon={<span>Kd</span>}
              tooltipContent={
                <>
                  <p><strong>Multiplier</strong> for derivative gain in deadband.</p>
                  <p>Reduces D-term response near setpoint.</p>
                </>
              }
            />
          </div>
        </div>
      </div>
    </details>
  );
}
