// src/store/useStore.ts
import { create } from 'zustand';
import { validateCurveParam, validateCurveState } from '@/lib/validation';
import type { StoreState, CurveState, PIDStoreSlice, ComputedState, PartialStoreConfig } from '../types';

export const useStore = create<StoreState>((set) => ({

  // Curve parameters
  curve: {
    tTarget: 21,
    hc: 0.9,
    n: 1.25,
    shift: 0,
    minFlow: 20,
    maxFlow: 70,
    tOutMin: -20,
    tOutMax: 20,
  },

  // PID parameters — flat structure
  pid: {
    enabled: true,
    mode: 'offset',
    roomTemp: 0,
    kp: 1,
    ki: 0,
    kd: 0,
    deadbandEnabled: true,
    deadbandThresholdHigh: 0.3,
    deadbandThresholdLow: -0.3,
    deadbandKpMultiplier: 0.1,
    deadbandKiMultiplier: 0.0,
    deadbandKdMultiplier: 0.0,
  },

  // UI state
  ui: {
    tCurrent: 5,
  },

  // Computed values
  computed: {
    flowTemp: null,
    pidRawOutput: null,
    pidScaledOutput: null,
    status: 'standby',
  },

  // Typed generic setters with validation
  setCurveParam: <K extends keyof CurveState>(k: K, v: CurveState[K]) =>
    set(s => ({ curve: { ...s.curve, [k]: validateCurveParam(s.curve, k, v) } })),

  setPidParam: <K extends keyof PIDStoreSlice>(k: K, v: PIDStoreSlice[K]) =>
    set(s => ({ pid: { ...s.pid, [k]: v } })),

  setTCurrent: (v: number) => set(s => ({ ui: { ...s.ui, tCurrent: v } })),

  setComputed: (v: Partial<ComputedState>) =>
    set(s => ({ computed: { ...s.computed, ...v } })),

  loadConfig: (config: PartialStoreConfig) => set(state => ({
    curve: { ...state.curve, ...validateCurveState(config.curve ?? {}) },
    pid:   { ...state.pid,   ...config.pid },
    ui:    { ...state.ui,    ...config.ui },
  })),
}));
