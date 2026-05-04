import { useMemo } from 'react';
import { computeFlowTemperature, computePID } from '@equitherm/core';
import { getRoomTempActual } from '@/lib/pid';
import type { CurveState, PIDStoreSlice, ComputedStatus } from '@/types';

interface ComputedFlowResult {
  equithermFlow: number;
  pidCorrection: number;
  combinedFlow: number;
  status: ComputedStatus;
}

export function useComputedFlow(
  curve: CurveState,
  pid: PIDStoreSlice,
  tCurrent: number
): ComputedFlowResult {
  return useMemo(() => {
    // Compute base equitherm flow
    const equithermFlow = computeFlowTemperature({
      tTarget: curve.tTarget,
      tOutdoor: tCurrent,
      hc: curve.hc,
      n: curve.n,
      shift: curve.shift,
      minFlow: curve.minFlow,
      maxFlow: curve.maxFlow,
    });

    // WWS: core returns 0 when outdoor >= target — check kept for UI status
    const deltaT = curve.tTarget - tCurrent;
    if (deltaT <= 0) {
      return { equithermFlow, pidCorrection: 0, combinedFlow: equithermFlow, status: 'wws' };
    }

    // Compute PID correction if enabled
    let pidCorrection = 0;
    let combinedFlow = equithermFlow;

    if (pid.enabled) {
      const pidState = {
        mode: pid.mode,
        roomTemp: pid.roomTemp,
        kp: pid.kp,
        ki: pid.ki,
        kd: pid.kd,
        deadband: pid.deadbandEnabled
          ? {
              enabled: true,
              thresholdHigh: pid.deadbandThresholdHigh,
              thresholdLow: pid.deadbandThresholdLow,
              kpMultiplier: pid.deadbandKpMultiplier,
            }
          : undefined,
      };

      const roomTemp = getRoomTempActual(pidState, curve.tTarget);
      const pidResult = computePID(pidState, curve.tTarget, roomTemp);
      pidCorrection = pidResult.total;
      combinedFlow = Math.max(curve.minFlow, Math.min(curve.maxFlow, equithermFlow + pidCorrection));
    }

    // Compute status
    const status: ComputedStatus = combinedFlow < 45 ? 'heating' : 'high-load';

    return { equithermFlow, pidCorrection, combinedFlow, status };
  }, [curve, pid, tCurrent]);
}
