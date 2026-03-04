// packages/web/src/components/Chart/Chart.tsx
import { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceDot } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart';
import { useStore } from '../../store/useStore';
import { useComputedFlow } from './useComputedFlow';
import { useChartData } from './useChartData';

const chartConfig = {
  equitherm: {
    label: 'Base',
    theme: {
      light: 'hsl(199, 60%, 60%)',
      dark: 'hsl(198, 70%, 70%)',
    },
  },
  combined: {
    label: 'With PID',
    theme: {
      light: 'hsl(199, 98%, 41%)',
      dark: 'hsl(198, 90%, 53%)',
    },
  },
} satisfies ChartConfig;

export function HeatingChart() {
  const curve = useStore((s) => s.curve);
  const pid = useStore((s) => s.pid);
  const tCurrent = useStore((s) => s.ui.tCurrent);
  const setComputed = useStore((s) => s.setComputed);

  const { equithermFlow, pidCorrection, combinedFlow, status } = useComputedFlow(
    curve,
    pid,
    tCurrent
  );

  const chartData = useChartData(curve, pid.enabled, pidCorrection);

  // Update store with computed values
  useEffect(() => {
    setComputed({
      flowTemp: combinedFlow,
      pidRawOutput: pidCorrection,
      pidScaledOutput: pidCorrection,
      status,
    });
  }, [combinedFlow, pidCorrection, status, setComputed]);

  // Current position on the curve - look up exact value from chartData to ensure
  // ReferenceDot y matches the line's data point byte-for-byte
  const currentPoint = chartData.find((p) => p.tOutdoor === Math.round(tCurrent));
  const currentFlowY = pid.enabled
    ? (currentPoint?.combined ?? combinedFlow)
    : (currentPoint?.equitherm ?? equithermFlow);

  return (
    <section className="bg-card rounded-xl p-4 border border-border min-h-[400px]">
      <ChartContainer config={chartConfig} className="h-[350px] w-full">
        <LineChart data={chartData} accessibilityLayer>
          <CartesianGrid
            stroke="hsl(var(--border))"
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="tOutdoor"
            reversed
            type="number"
            domain={['dataMin', 'dataMax']}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tick={{
              fill: 'hsl(var(--muted-foreground))',
              fontSize: 12,
              fontFamily: "'IBM Plex Mono', monospace",
            }}
            label={{
              value: 'Outdoor (°C)',
              position: 'bottom',
              offset: -5,
              fill: 'hsl(var(--muted-foreground))',
              fontSize: 11,
              fontFamily: "'IBM Plex Mono', monospace",
            }}
          />
          <YAxis
            domain={['dataMin', 'dataMax']}
            tickLine={false}
            axisLine={false}
            tick={{
              fill: 'hsl(var(--muted-foreground))',
              fontSize: 12,
              fontFamily: "'IBM Plex Mono', monospace",
            }}
            label={{
              value: 'Flow (°C)',
              angle: -90,
              position: 'insideLeft',
              offset: 10,
              fill: 'hsl(var(--muted-foreground))',
              fontSize: 11,
              fontFamily: "'IBM Plex Mono', monospace",
            }}
          />
          <ChartTooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                  <div className="font-medium">Outdoor: {label}°C</div>
                  {payload
                    .filter((item) => item.value != null)
                    .map((item) => (
                      <div key={String(item.dataKey)} className="flex items-center gap-2">
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                          style={{ backgroundColor: item.color }}
                        />
                        <div className="flex flex-1 justify-between gap-4">
                          <span className="text-muted-foreground">
                            {chartConfig[item.dataKey as keyof typeof chartConfig]?.label}
                          </span>
                          <span className="font-mono font-medium">
                            {Number(item.value).toFixed(1)}°C
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              );
            }}
          />

          {/* Equitherm line - dashed when PID enabled, solid otherwise */}
          <Line
            dataKey="equitherm"
            type="linear"
            stroke={pid.enabled ? "var(--color-equitherm)" : "var(--color-combined)"}
            strokeDasharray={pid.enabled ? "5 5" : undefined}
            strokeWidth={2}
            dot={false}
            activeDot={false}
          />

          {/* Combined line only when PID enabled */}
          {pid.enabled && (
            <Line
              dataKey="combined"
              type="linear"
              stroke="var(--color-combined)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 8, fill: 'var(--color-combined)' }}
            />
          )}

          {/* Current position dot - updates independently of lines */}
          {currentFlowY != null && (
            <ReferenceDot
              x={tCurrent}
              y={currentFlowY}
              r={6}
              fill="var(--color-combined)"
              stroke="hsl(var(--background))"
              strokeWidth={2}
            />
          )}
        </LineChart>
      </ChartContainer>
    </section>
  );
}
