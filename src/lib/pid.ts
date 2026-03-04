import type { DeadbandConfig } from '@equitherm-studio/core';

// Web-specific PID parameters (includes UI concerns like mode and roomTemp)
export interface DefaultPIDParams {
  enabled: boolean;
  mode: 'offset' | 'absolute';
  roomTemp: number;
  kp: number;
  ki: number;
  kd: number;
  deadband: DeadbandConfig;
}

// Default PID parameters for web UI
export const DEFAULT_PID_PARAMS: DefaultPIDParams = {
  enabled: true,
  mode: 'offset',
  roomTemp: 0,
  kp: 1.0,
  ki: 0.0,
  kd: 0.0,
  deadband: {
    enabled: true,
    thresholdHigh: 0.3,
    thresholdLow: -0.3,
    kpMultiplier: 0.1,
  },
};

/**
 * Create a fresh PID state object
 */
export function createPIDState(overrides: Partial<DefaultPIDParams> = {}): DefaultPIDParams {
  return {
    ...DEFAULT_PID_PARAMS,
    ...overrides,
  };
}

/**
 * Get actual room temperature based on mode
 * - 'absolute': roomTemp is the actual temperature
 * - 'offset': roomTemp is an offset from target
 */
export function getRoomTempActual(
  state: { mode: string; roomTemp: number },
  tTarget: number
): number {
  if (state.mode === 'offset') {
    return tTarget + state.roomTemp;
  }
  return state.roomTemp;
}
