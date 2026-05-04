// src/components/AppShell/StatusIndicator.tsx
import { Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusBadge } from './status-badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type StatusType = 'heating' | 'standby' | 'cooling' | 'high-load' | 'wws';

interface StatusIndicatorProps {
  status: StatusType;
  className?: string;
  tOutdoor?: number;
  tTarget?: number;
}

const statusConfig: Record<StatusType, { color: string; pulseColor: string }> = {
  heating: { color: 'bg-hot', pulseColor: 'bg-hot' },
  standby: { color: 'bg-muted', pulseColor: 'bg-muted-foreground' },
  cooling: { color: 'bg-cold', pulseColor: 'bg-cold' },
  'high-load': { color: 'bg-destructive', pulseColor: 'bg-destructive' },
  wws: { color: 'bg-amber-500', pulseColor: 'bg-amber-500' },
};

export function StatusIndicator({ status, className, tOutdoor, tTarget }: StatusIndicatorProps) {
  const config = statusConfig[status];

  const indicator = (
    <div className={cn('flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-secondary/50 border border-border', className)}>
      <span className="relative flex h-2 w-2">
        <span className={cn('w-2 h-2 rounded-full', config.color)} />
        <span className={cn('absolute inset-0 rounded-full animate-ping [animation-duration:1.5s]', config.pulseColor)} />
      </span>
      <StatusBadge status={status} />
    </div>
  );

  if (status === 'wws' && tOutdoor != null && tTarget != null) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{indicator}</TooltipTrigger>
        <TooltipContent
          side="bottom"
          sideOffset={12}
          className="px-3.5 py-2.5 rounded-lg border border-amber-500/15 bg-card shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.03)_inset] [&>svg]:hidden"
        >
          <div className="flex items-center gap-2 text-xs font-ui">
            <Sun className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            <span className="text-secondary-foreground">
              <span className="font-display font-medium text-amber-500">{tOutdoor}°C</span>
              <span className="mx-1.5 opacity-40">≥</span>
              <span className="font-display font-medium">{tTarget}°C</span>
            </span>
          </div>
          <p className="text-[0.65rem] text-secondary-foreground/60 mt-1.5 pl-[1.4rem]">No heating demand — flow output suppressed</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return indicator;
}
