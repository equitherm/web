// src/lib/validation.test.ts
import { describe, it, expect } from 'vitest';
import { validateCurveParam, validateCurveState } from './validation';
import type { CurveState } from '@/types';

describe('validateCurveParam', () => {
  const defaultCurve: CurveState = {
    tTarget: 21,
    hc: 0.9,
    n: 1.25,
    shift: 0,
    minFlow: 20,
    maxFlow: 70,
    tOutMin: -20,
    tOutMax: 20,
  };

  describe('minFlow/maxFlow validation', () => {
    it('should allow valid minFlow', () => {
      const result = validateCurveParam(defaultCurve, 'minFlow', 25);
      expect(result).toBe(25);
    });

    it('should clamp minFlow to not exceed maxFlow - 1', () => {
      const result = validateCurveParam(defaultCurve, 'minFlow', 75);
      expect(result).toBe(69); // maxFlow - 1
    });

    it('should allow valid maxFlow', () => {
      const result = validateCurveParam(defaultCurve, 'maxFlow', 60);
      expect(result).toBe(60);
    });

    it('should clamp maxFlow to not go below minFlow + 1', () => {
      const result = validateCurveParam(defaultCurve, 'maxFlow', 15);
      expect(result).toBe(21); // minFlow + 1
    });
  });

  describe('tOutMin/tOutMax validation', () => {
    it('should allow valid tOutMin', () => {
      const result = validateCurveParam(defaultCurve, 'tOutMin', -10);
      expect(result).toBe(-10);
    });

    it('should clamp tOutMin to not exceed tOutMax - 1', () => {
      const result = validateCurveParam(defaultCurve, 'tOutMin', 25);
      expect(result).toBe(19); // tOutMax - 1
    });

    it('should allow valid tOutMax', () => {
      const result = validateCurveParam(defaultCurve, 'tOutMax', 15);
      expect(result).toBe(15);
    });

    it('should clamp tOutMax to not go below tOutMin + 1', () => {
      const result = validateCurveParam(defaultCurve, 'tOutMax', -25);
      expect(result).toBe(-19); // tOutMin + 1
    });
  });

  describe('non-validated params', () => {
    it('should pass through tTarget unchanged', () => {
      const result = validateCurveParam(defaultCurve, 'tTarget', 22);
      expect(result).toBe(22);
    });

    it('should pass through hc unchanged', () => {
      const result = validateCurveParam(defaultCurve, 'hc', 1.5);
      expect(result).toBe(1.5);
    });
  });
});

describe('validateCurveState', () => {
  it('should return valid state unchanged', () => {
    const input = { minFlow: 20, maxFlow: 70, tOutMin: -20, tOutMax: 20 };
    const result = validateCurveState(input);
    expect(result).toEqual(input);
  });

  it('should fix inverted minFlow/maxFlow', () => {
    const input = { minFlow: 70, maxFlow: 20 };
    const result = validateCurveState(input);
    expect(result.minFlow!).toBeLessThan(result.maxFlow!);
  });

  it('should fix inverted tOutMin/tOutMax', () => {
    const input = { tOutMin: 20, tOutMax: -20 };
    const result = validateCurveState(input);
    expect(result.tOutMin!).toBeLessThan(result.tOutMax!);
  });

  it('should handle partial state', () => {
    const input = { minFlow: 30 };
    const result = validateCurveState(input);
    expect(result).toEqual({ minFlow: 30 });
  });
});
