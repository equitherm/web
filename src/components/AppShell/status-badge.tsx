// src/components/ui/status-badge.tsx
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type StatusVariant = 'heating' | 'cooling' | 'standby' | 'high-load';

interface StatusBadgeProps {
  status: StatusVariant;
  className?: string;
}

const statusConfig: Record<StatusVariant, { label: string; className: string }> = {
  heating: {
    label: 'Heating',
    className: 'bg-accent/20 text-accent border-accent/30 shadow-glow-heating',
  },
  cooling: {
    label: 'Cooling',
    className: 'bg-cold/20 text-cold border-cold/30 shadow-glow-cooling',
  },
  standby: {
    label: 'Standby',
    className: 'bg-muted/20 text-muted-foreground border-muted/30',
  },
  'high-load': {
    label: 'High Load',
    className: 'bg-destructive/20 text-destructive border-destructive/30',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        'px-2 py-0.5 text-[0.65rem] font-ui font-medium uppercase tracking-wider',
        'transition-all duration-normal',
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
