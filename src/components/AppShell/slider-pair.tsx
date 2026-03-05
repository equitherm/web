import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface SliderPairProps {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function SliderPair({
  id,
  label,
  min,
  max,
  step,
  value,
  onChange,
  className,
}: SliderPairProps) {
  // Derive decimal precision from step value
  const decimalPlaces = (step.toString().split('.')[1] || '').length;

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className="font-mono text-sm font-semibold text-foreground">
          {value.toFixed(decimalPlaces)}
        </span>
      </div>
      <Slider
        id={id}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(vals) => onChange(vals[0])}
        className="cursor-pointer"
      />
      <div className="flex justify-between text-[0.6rem] font-mono text-muted-foreground">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
