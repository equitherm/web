// Curve parameter limits for web UI validation
export interface ParamLimit {
  min: number;
  max: number;
  default: number;
}

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

