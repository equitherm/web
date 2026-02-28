// src/types/store.ts

// Curve state slice (matches store.curve)
export interface CurveState {
  tTarget: number;
  hc: number;
  n: number;
  shift: number;
  minFlow: number;
  maxFlow: number;
  tOutMin: number;
  tOutMax: number;
}

// PID state slice (flat structure in store)
// Note: This is different from core.PIDState which is for computation
export interface PIDStoreSlice {
  enabled: boolean;
  mode: 'offset' | 'absolute';
  roomTemp: number;
  kp: number;
  ki: number;
  kd: number;
  deadbandEnabled: boolean;
  deadbandThresholdHigh: number;
  deadbandThresholdLow: number;
  deadbandKpMultiplier: number;
  deadbandKiMultiplier: number;
  deadbandKdMultiplier: number;
}

// UI state slice
export interface UIState {
  tCurrent: number;
}

// Computed state slice
export type ComputedStatus = 'heating' | 'cooling' | 'standby' | 'high-load';

export interface ComputedState {
  flowTemp: number | null;
  pidRawOutput: number | null;
  pidScaledOutput: number | null;
  status: ComputedStatus;
}

// Full store state
export interface StoreState {
  curve: CurveState;
  pid: PIDStoreSlice;
  ui: UIState;
  computed: ComputedState;

  // Actions
  setCurveParam: <K extends keyof CurveState>(k: K, v: CurveState[K]) => void;
  setPidParam: <K extends keyof PIDStoreSlice>(k: K, v: PIDStoreSlice[K]) => void;
  setTCurrent: (v: number) => void;
  setComputed: (v: Partial<ComputedState>) => void;
  loadConfig: (config: PartialStoreConfig) => void;
}

// Partial config for loading
export interface PartialStoreConfig {
  curve?: Partial<CurveState>;
  pid?: Partial<PIDStoreSlice>;
  ui?: Partial<UIState>;
}

// Saved config structure (from storage.js)
export interface SavedConfig {
  name: string;
  data: PartialStoreConfig;
  timestamp: number;
}
