// src/components/PIDPanel/PIDPanel.tsx
import { useStore } from '@/store/useStore';
import { GainControls } from './GainControls';
import { DeadbandControls } from './DeadbandControls';
import { InfoTooltip } from '../ControlsCard/InfoTooltip';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

const PIDIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>
);

export function PIDPanel() {
  const pid = useStore(s => s.pid);
  const setPidParam = useStore(s => s.setPidParam);

  return (
    <div className={cn('flex min-w-0 flex-col', !pid.enabled && 'opacity-50')}>
      {/* Enable Header */}
      <div className="flex items-center gap-2 flex-wrap px-4 py-3 border-b border-border">
        <Switch
          checked={pid.enabled}
          onCheckedChange={(checked) => setPidParam('enabled', checked)}
        />
        <span className="text-sm font-semibold text-foreground">PID Control</span>
        <InfoTooltip title="PID Control" icon={<PIDIcon />} position="sideLeft">
          <p><strong>Proportional-Integral-Derivative</strong> control adjusts flow temperature based on room temperature error.</p>
          <p>Room temp can be an offset from setpoint or absolute value.</p>
        </InfoTooltip>
      </div>

      {/* Mode Toggle Row */}
      <div className={cn('px-4 py-2 border-b border-border', !pid.enabled && 'pointer-events-none')}>
        <ToggleGroup
          type="single"
          value={pid.mode}
          onValueChange={(value) => {
            if (value) {
              setPidParam('mode', value as 'offset' | 'absolute');
              setPidParam('roomTemp', value === 'offset' ? 0 : 21);
            }
          }}
          className="bg-secondary p-0.5 rounded-md border border-border w-full justify-stretch"
        >
          <ToggleGroupItem
            value="offset"
            className="flex-1 text-xs data-[state=on]:bg-card data-[state=on]:text-primary"
          >
            Offset
          </ToggleGroupItem>
          <ToggleGroupItem
            value="absolute"
            className="flex-1 text-xs data-[state=on]:bg-card data-[state=on]:text-primary"
          >
            Absolute
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Gains Section */}
      <div className={!pid.enabled ? 'pointer-events-none' : ''}>
        <GainControls />
      </div>

      {/* Deadband Section (collapsible) */}
      <div className={!pid.enabled ? 'pointer-events-none' : ''}>
        <DeadbandControls />
      </div>
    </div>
  );
}
