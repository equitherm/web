// src/components/AppShell/StatusIndicator.tsx
import { cn } from '@/lib/utils';
import { StatusBadge } from './status-badge';

type StatusType = 'heating' | 'standby' | 'cooling' | 'high-load';

interface StatusIndicatorProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { color: string; pulseColor: string }> = {
  heating: {
    color: 'bg-hot',
    pulseColor: 'bg-hot',
  },
  standby: {
    color: 'bg-muted',
    pulseColor: 'bg-muted-foreground',
  },
  cooling: {
    color: 'bg-cold',
    pulseColor: 'bg-cold',
  },
  'high-load': {
    color: 'bg-destructive',
    pulseColor: 'bg-destructive',
  },
};

export function StatusIndicator({ status, className }: StatusIndicatorProps) {
  const config = statusConfig[status];

  return (
    <div className={cn('flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-secondary/50 border border-border', className)}>
      <span className="relative flex h-2 w-2">
        <span className={cn('w-2 h-2 rounded-full', config.color)} />
        <span className={cn('absolute inset-0 rounded-full animate-ping [animation-duration:1.5s]', config.pulseColor)} />
      </span>
      <StatusBadge status={status} />
    </div>
  );
}
