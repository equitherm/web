import { useMemo } from 'react';
import { computeFlowTemperature } from '@equitherm/core';
import type { CurveState } from '@/types';

export interface ChartDataPoint {
  tOutdoor: number;
  equitherm: number;
  combined?: number;
}

export function useChartData(
  curve: CurveState,
  pidEnabled: boolean,
  pidCorrection: number
): ChartDataPoint[] {
  return useMemo(() => {
    const points: ChartDataPoint[] = [];

    for (let t = curve.tOutMin; t <= curve.tOutMax; t++) {
      const equitherm = computeFlowTemperature({
        tTarget: curve.tTarget,
        tOutdoor: t,
        hc: curve.hc,
        n: curve.n,
        shift: curve.shift,
        minFlow: curve.minFlow,
        maxFlow: curve.maxFlow,
      });

      // Combined follows equitherm — 0 during WWS (equitherm=0 from core)
      const combined = pidEnabled
        ? equitherm === 0 ? 0 : Math.max(curve.minFlow, Math.min(curve.maxFlow, equitherm + pidCorrection))
        : undefined;

      points.push({
        tOutdoor: t,
        equitherm,
        combined,
      });
    }

    return points;
  }, [curve, pidEnabled, pidCorrection]);
}
