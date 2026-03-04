import type { DeadbandConfig } from '@equitherm-studio/core';

// Single curve parameter limit
export interface ParamLimit {
  min: number;
  max: number;
  default: number;
}

// Curve parameter limits
export interface CurveLimits {
  t_target: ParamLimit;
  hc: ParamLimit;
  n: ParamLimit;
  shift: ParamLimit;
  minFlow: ParamLimit;
  maxFlow: ParamLimit;
  t_out_min: ParamLimit;
  t_out_max: ParamLimit;
}

// Default PID parameters
export interface DefaultPIDParams {
  enabled: boolean;
  mode: 'offset' | 'absolute';
  roomTemp: number;
  kp: number;
  ki: number;
  kd: number;
  deadband: DeadbandConfig;
}

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
