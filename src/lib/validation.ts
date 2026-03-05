// src/lib/validation.ts
import type { CurveState } from '@/types';

/**
 * Validates and clamps curve parameters to maintain invariants:
 * - minFlow < maxFlow
 * - tOutMin < tOutMax
 */
export function validateCurveParam<K extends keyof CurveState>(
  current: CurveState,
  key: K,
  value: CurveState[K]
): CurveState[K] {
  // Only validate numeric parameters
  if (typeof value !== 'number') return value;

  switch (key) {
    case 'minFlow':
      // Ensure minFlow doesn't exceed maxFlow
      return Math.min(value, current.maxFlow - 1) as CurveState[K];

    case 'maxFlow':
      // Ensure maxFlow doesn't go below minFlow
      return Math.max(value, current.minFlow + 1) as CurveState[K];

    case 'tOutMin':
      // Ensure tOutMin doesn't exceed tOutMax
      return Math.min(value, current.tOutMax - 1) as CurveState[K];

    case 'tOutMax':
      // Ensure tOutMax doesn't go below tOutMin
      return Math.max(value, current.tOutMin + 1) as CurveState[K];

    default:
      return value;
  }
}

/**
 * Validates an entire curve state, fixing any invalid combinations.
 * Used when loading configs from URL, presets, or storage.
 */
export function validateCurveState(curve: Partial<CurveState>): Partial<CurveState> {
  const result = { ...curve };

  // Fix minFlow/maxFlow inversion
  if (result.minFlow !== undefined && result.maxFlow !== undefined) {
    if (result.minFlow >= result.maxFlow) {
      // Swap to fix
      const temp = result.minFlow;
      result.minFlow = result.maxFlow - 1;
      result.maxFlow = temp + 1;
    }
  }

  // Fix tOutMin/tOutMax inversion
  if (result.tOutMin !== undefined && result.tOutMax !== undefined) {
    if (result.tOutMin >= result.tOutMax) {
      // Swap to fix
      const temp = result.tOutMin;
      result.tOutMin = result.tOutMax - 1;
      result.tOutMax = temp + 1;
    }
  }

  return result;
}
