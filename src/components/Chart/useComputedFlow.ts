// packages/web/src/components/Chart/useComputedFlow.ts
import { useMemo } from 'react';
import { computeFlowTemperature, computePID, getRoomTempActual } from '@equitherm-studio/core';
import type { CurveState, PIDStoreSlice, ComputedStatus } from '../../types';

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
    const deltaT = curve.tTarget - tCurrent;
    let status: ComputedStatus = 'standby';
    if (deltaT > 0) {
      status = combinedFlow < 45 ? 'heating' : 'high-load';
    }

    return { equithermFlow, pidCorrection, combinedFlow, status };
  }, [curve, pid, tCurrent]);
}
