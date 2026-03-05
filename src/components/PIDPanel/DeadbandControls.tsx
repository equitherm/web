// src/components/PIDPanel/DeadbandControls.tsx
import { useState, type ReactNode } from 'react';
import { useStore } from '@/store/useStore';
import { InfoTooltip } from '../ControlsCard/InfoTooltip';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { SliderVariant } from '@/components/ControlsCard/slider-variants';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isInDeadband } from '@equitherm-studio/core';
import { getRoomTempActual } from '@/lib/pid';

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
  const formatAnchor = (val: number) => `${val}${unit}`;

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
        <span className="font-mono text-[0.7rem] font-medium text-muted-foreground whitespace-nowrap flex-shrink-0 min-w-[1.5rem]">{formatAnchor(leftVal)}</span>
        <SliderVariant
          variant="primary"
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={(vals) => onChange(vals[0])}
          className="flex-1 cursor-pointer"
        />
        <span className="font-mono text-[0.7rem] font-medium text-muted-foreground whitespace-nowrap flex-shrink-0 min-w-[1.5rem] text-right">{formatAnchor(rightVal)}</span>
      </div>
    </div>
  );
}

export function DeadbandControls() {
  const pid = useStore(s => s.pid);
  const curve = useStore(s => s.curve);
  const setPidParam = useStore(s => s.setPidParam);
  const [isOpen, setIsOpen] = useState(true);

  // Calculate deadband status
  const roomTempActual = getRoomTempActual(pid, curve.tTarget);
  const error = curve.tTarget - roomTempActual;
  const deadbandConfig = pid.deadbandEnabled
    ? {
        enabled: true,
        thresholdHigh: pid.deadbandThresholdHigh,
        thresholdLow: pid.deadbandThresholdLow,
        kpMultiplier: pid.deadbandKpMultiplier,
      }
    : undefined;
  const inDeadband = isInDeadband(error, deadbandConfig);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border-b border-border">
      <div className="flex items-center gap-2 px-4 py-3">
        <Switch
          checked={pid.deadbandEnabled}
          onCheckedChange={(checked) => setPidParam('deadbandEnabled', checked)}
        />
        <CollapsibleTrigger className="flex items-center gap-2 flex-1 cursor-pointer">
          <span className="text-sm font-semibold text-foreground">Deadband</span>
          {/* Deadband status indicator */}
          {pid.deadbandEnabled && (
            <Badge
              variant="secondary"
              className={cn(
                "text-[0.6rem] font-mono px-1.5 py-0 h-4 transition-colors",
                inDeadband
                  ? "bg-primary/20 text-primary hover:bg-primary/30"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {inDeadband ? 'ACTIVE' : 'inactive'}
            </Badge>
          )}
          <InfoTooltip title="Deadband" icon={<span>?</span>} position="sideLeft">
            <p>A <strong>tolerance zone</strong> where PID output is reduced to prevent constant small adjustments.</p>
            <p>When room temp error is within [Low, High], gains are multiplied by their reduction factors.</p>
          </InfoTooltip>
          <ChevronDown className={cn(
            "h-4 w-4 ml-auto transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="px-4 py-3 border-t border-border">
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
      </CollapsibleContent>
    </Collapsible>
  );
}
