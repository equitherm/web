// src/components/AppShell/OutputDisplay.tsx
import { useStore } from '@/store/useStore';
import { DigitalDisplay } from './DigitalDisplay';
import { StatusIndicator } from './StatusIndicator';
import { SliderVariant } from '@/components/ControlsCard/slider-variants';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function OutdoorSlider({ className }: { className?: string }) {
  const tCurrent = useStore(s => s.ui.tCurrent);
  const setTCurrent = useStore(s => s.setTCurrent);

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      <div className="flex items-center justify-between px-1">
        <span className="text-[0.65rem] font-ui font-medium text-muted-foreground uppercase tracking-wider">
          Outdoor Temperature
        </span>
        <DigitalDisplay
          value={tCurrent}
          unit="°C"
          size="sm"
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[0.55rem] font-display text-cold w-7 text-center">-30°</span>
        <SliderVariant
          variant="temp"
          min={-30}
          max={25}
          step={1}
          value={[tCurrent]}
          onValueChange={(vals) => setTCurrent(vals[0])}
          className="flex-1 cursor-grab min-h-touch"
        />
        <span className="text-[0.55rem] font-display text-hot w-7 text-center">25°</span>
      </div>
    </div>
  );
}

export function OutputDisplay() {
  const tCurrent = useStore(s => s.ui.tCurrent);
  const setTCurrent = useStore(s => s.setTCurrent);
  const computed = useStore(s => s.computed);
  const pidEnabled = useStore(s => s.pid.enabled);
  const pidOutput = computed.pidRawOutput ?? 0;

  return (
    <div className="flex items-stretch justify-center gap-4">
      {/* Outdoor Slider - desktop only (inline) */}
      <div className="hidden sm:flex flex-col gap-2 w-full max-w-[280px] justify-center">
        <div className="flex items-center justify-between px-1">
          <span className="text-[0.65rem] md:text-xs font-ui font-medium text-muted-foreground uppercase tracking-wider">
            Outdoor
          </span>
          <DigitalDisplay
            value={tCurrent}
            unit="°C"
            size="sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[0.6rem] font-display text-cold w-10 min-w-[2.5rem] text-center">-30°</span>
          <SliderVariant
            variant="temp"
            min={-30}
            max={25}
            step={1}
            value={[tCurrent]}
            onValueChange={(vals) => setTCurrent(vals[0])}
            className="flex-1 cursor-grab min-h-touch"
          />
          <span className="text-[0.6rem] font-display text-hot w-10 min-w-[2.5rem] text-center">25°</span>
        </div>
      </div>

      {/* Transform Arrow */}
      <div className="hidden sm:flex items-center justify-center w-8 shrink-0">
        <svg className="w-5 h-5 text-muted-foreground/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>

      {/* Flow Output - Hero Element */}
      <div className="flex flex-col items-center justify-center gap-2 min-w-[100px] lg:min-w-[140px] shrink-0 bg-secondary/30 rounded-lg border border-border px-4 py-3">
        <span className="text-[0.65rem] md:text-xs font-ui font-medium text-muted-foreground uppercase tracking-wider">
          Flow Temperature
        </span>
        <DigitalDisplay
          value={computed.flowTemp?.toFixed(1) ?? '--'}
          size="4xl"
          variant="heating"
          showGlow
        />
        <StatusIndicator status={computed.status} />
        {/* PID delta badge — space always reserved to prevent layout shift */}
        <Badge
          variant="outline"
          className={cn(
            'px-2 py-0.5 text-[0.65rem] font-ui font-medium uppercase tracking-wider tabular-nums transition-all duration-normal',
            pidEnabled && pidOutput !== 0 ? 'visible' : 'invisible',
            pidOutput >= 0
              ? 'bg-success/20 text-success border-success/30'
              : 'bg-destructive/20 text-destructive border-destructive/30'
          )}
        >
          {pidOutput >= 0 ? '+' : ''}{pidOutput.toFixed(1)}° pid
        </Badge>
      </div>
    </div>
  );
}
