// src/components/AppShell/DigitalDisplay.tsx
import { cn } from '@/lib/utils';

interface DigitalDisplayProps {
  value: string | number;
  label?: string;
  unit?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  variant?: 'default' | 'heating' | 'cooling' | 'success' | 'danger';
  className?: string;
  showGlow?: boolean;
}

const sizeClasses = {
  sm: 'text-lg md:text-xl',
  md: 'text-2xl md:text-3xl',
  lg: 'text-3xl md:text-4xl lg:text-5xl',
  xl: 'text-4xl md:text-5xl lg:text-6xl',
  '2xl': 'text-5xl md:text-6xl',
  '3xl': 'text-6xl md:text-7xl',
  '4xl': 'text-5xl md:text-6xl lg:text-7xl',
};

const variantClasses = {
  default: 'text-primary',
  heating: 'text-hot',
  cooling: 'text-cold',
  success: 'text-success',
  danger: 'text-destructive',
};

const glowClasses = {
  default: 'drop-shadow-[0_0_10px_hsl(var(--primary)/40%)]',
  heating: 'drop-shadow-[0_0_15px_hsl(var(--hot)/50%)]',
  cooling: 'drop-shadow-[0_0_15px_hsl(var(--cold)/50%)]',
  success: 'drop-shadow-[0_0_15px_hsl(var(--success)/50%)]',
  danger: 'drop-shadow-[0_0_15px_hsl(var(--destructive)/50%)]',
};

export function DigitalDisplay({
  value,
  label,
  unit,
  size = 'lg',
  variant = 'default',
  className,
  showGlow = true,
}: DigitalDisplayProps) {
  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      {label && (
        <span className="text-[0.65rem] md:text-xs font-medium text-muted-foreground uppercase tracking-[0.2em]">
          {label}
        </span>
      )}
      <div className="flex items-baseline gap-0.5">
        <span
          className={cn(
            'font-display font-bold tabular-nums tracking-tight',
            sizeClasses[size],
            variantClasses[variant],
            showGlow && glowClasses[variant]
          )}
        >
          {value}
        </span>
        {unit && (
          <span className="text-[0.4em] opacity-60 font-display font-medium">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
