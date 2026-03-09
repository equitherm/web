// src/config/yaml.test.ts
import { describe, it, expect } from 'vitest';
import { generateYAML } from './yaml';

// Default parameters matching typical configuration
const defaultParams = {
  t: 21,      // target temp
  hc: 0.9,    // heat curve coefficient
  n: 1.25,    // exponent
  s: 0,       // shift
  min: 20,    // min flow temp
  max: 70,    // max flow temp
  pid: false, // PID disabled
  kp: 0,      // proportional gain
  ki: 0,      // integral gain
  kd: 0,      // derivative gain
  db: false,  // deadband disabled
  th: 0,      // threshold high
  tl: 0,      // threshold low
  kpm: 0,     // kp multiplier
};

describe('generateYAML', () => {
  describe('default configuration (no sensors, no numbers)', () => {
    it('should generate valid YAML structure with required fields', () => {
      const yaml = generateYAML(defaultParams);

      expect(yaml).toContain('climate:');
      expect(yaml).toContain('platform: equitherm');
      expect(yaml).toContain('id: heating_controller');
      expect(yaml).toContain('default_target_temperature: 21°C');
    });

    it('should include control_parameters section with hc and n', () => {
      const yaml = generateYAML(defaultParams);

      expect(yaml).toContain('control_parameters:');
      expect(yaml).toContain('heat_curve_coefficient: 0.9');
      expect(yaml).toContain('heat_curve_exponent: 1.25');
    });

    it('should include output_parameters section with min/max flow', () => {
      const yaml = generateYAML(defaultParams);

      expect(yaml).toContain('output_parameters:');
      expect(yaml).toContain('min_flow_temp: 20°C');
      expect(yaml).toContain('max_flow_temp: 70°C');
    });

    it('should not include sensor section by default', () => {
      const yaml = generateYAML(defaultParams);

      expect(yaml).not.toContain('# Diagnostic sensors');
      // Check for diagnostic sensor section specifically (not outdoor_sensor/indoor_sensor)
      expect(yaml).not.toContain('- platform: equitherm\n    climate_id: heating_controller\n    type:');
    });

    it('should not include number section by default', () => {
      const yaml = generateYAML(defaultParams);

      expect(yaml).not.toContain('# Runtime tuning');
      expect(yaml).not.toMatch(/^number:/m);
    });
  });

  describe('shift parameter', () => {
    it('should omit shift when s is 0', () => {
      const yaml = generateYAML({ ...defaultParams, s: 0 });

      expect(yaml).not.toContain('heat_curve_shift:');
    });

    it('should include shift when s is positive', () => {
      const yaml = generateYAML({ ...defaultParams, s: 5 });

      expect(yaml).toContain('heat_curve_shift: 5');
    });

    it('should include shift when s is negative', () => {
      const yaml = generateYAML({ ...defaultParams, s: -3 });

      expect(yaml).toContain('heat_curve_shift: -3');
    });
  });

  describe('PID disabled', () => {
    it('should not include any PID parameters when pid is false', () => {
      const yaml = generateYAML({
        ...defaultParams,
        pid: false,
        kp: 1.5,
        ki: 0.1,
        kd: 0.5,
      });

      expect(yaml).not.toContain('kp:');
      expect(yaml).not.toContain('ki:');
      expect(yaml).not.toContain('kd:');
    });

    it('should not include deadband when pid is false even if db is true', () => {
      const yaml = generateYAML({
        ...defaultParams,
        pid: false,
        db: true,
        th: 0.5,
        tl: -0.5,
      });

      expect(yaml).not.toContain('deadband_parameters:');
      expect(yaml).not.toContain('threshold_high:');
      expect(yaml).not.toContain('threshold_low:');
    });
  });

  describe('PID enabled with various gains', () => {
    it('should include kp when pid is true and kp is non-zero', () => {
      const yaml = generateYAML({
        ...defaultParams,
        pid: true,
        kp: 1.5,
      });

      expect(yaml).toContain('kp: 1.5');
    });

    it('should include ki when pid is true and ki is non-zero', () => {
      const yaml = generateYAML({
        ...defaultParams,
        pid: true,
        ki: 0.1,
      });

      expect(yaml).toContain('ki: 0.1');
    });

    it('should include kd when pid is true and kd is non-zero', () => {
      const yaml = generateYAML({
        ...defaultParams,
        pid: true,
        kd: 0.5,
      });

      expect(yaml).toContain('kd: 0.5');
    });

    it('should include all PID gains when all are non-zero', () => {
      const yaml = generateYAML({
        ...defaultParams,
        pid: true,
        kp: 1.5,
        ki: 0.1,
        kd: 0.5,
      });

      expect(yaml).toContain('kp: 1.5');
      expect(yaml).toContain('ki: 0.1');
      expect(yaml).toContain('kd: 0.5');
    });

    it('should omit kp when pid is true but kp is 0', () => {
      const yaml = generateYAML({
        ...defaultParams,
        pid: true,
        kp: 0,
      });

      expect(yaml).not.toContain('kp:');
    });

    it('should omit ki when pid is true but ki is 0', () => {
      const yaml = generateYAML({
        ...defaultParams,
        pid: true,
        ki: 0,
      });

      expect(yaml).not.toContain('ki:');
    });

    it('should omit kd when pid is true but kd is 0', () => {
      const yaml = generateYAML({
        ...defaultParams,
        pid: true,
        kd: 0,
      });

      expect(yaml).not.toContain('kd:');
    });
  });

  describe('deadband disabled', () => {
    it('should not include deadband section when db is false', () => {
      const yaml = generateYAML({
        ...defaultParams,
        pid: true,
        db: false,
      });

      expect(yaml).not.toContain('deadband_parameters:');
    });
  });

  describe('deadband enabled with multipliers', () => {
    it('should include deadband section when pid and db are true', () => {
      const yaml = generateYAML({
        ...defaultParams,
        pid: true,
        db: true,
        th: 0.5,
        tl: -0.5,
      });

      expect(yaml).toContain('deadband_parameters:');
      expect(yaml).toContain('threshold_high: 0.5');
      expect(yaml).toContain('threshold_low: -0.5');
    });

    it('should include kp_multiplier when provided and non-zero', () => {
      const yaml = generateYAML({
        ...defaultParams,
        pid: true,
        db: true,
        th: 0.5,
        tl: -0.5,
        kpm: 0.1,
      });

      expect(yaml).toContain('kp_multiplier: 0.1');
    });

    it('should include ki_multiplier when provided and non-zero', () => {
      const yaml = generateYAML({
        ...defaultParams,
        pid: true,
        db: true,
        th: 0.5,
        tl: -0.5,
        kim: 0.2,
      });

      expect(yaml).toContain('ki_multiplier: 0.2');
    });

    it('should include kd_multiplier when provided and non-zero', () => {
      const yaml = generateYAML({
        ...defaultParams,
        pid: true,
        db: true,
        th: 0.5,
        tl: -0.5,
        kdm: 0.3,
      });

      expect(yaml).toContain('kd_multiplier: 0.3');
    });

    it('should include all multipliers when all are non-zero', () => {
      const yaml = generateYAML({
        ...defaultParams,
        pid: true,
        db: true,
        th: 0.5,
        tl: -0.5,
        kpm: 0.1,
        kim: 0.2,
        kdm: 0.3,
      });

      expect(yaml).toContain('kp_multiplier: 0.1');
      expect(yaml).toContain('ki_multiplier: 0.2');
      expect(yaml).toContain('kd_multiplier: 0.3');
    });

    it('should omit kp_multiplier when kpm is 0', () => {
      const yaml = generateYAML({
        ...defaultParams,
        pid: true,
        db: true,
        th: 0.5,
        tl: -0.5,
        kpm: 0,
      });

      expect(yaml).not.toContain('kp_multiplier:');
    });

    it('should omit ki_multiplier when kim is 0', () => {
      const yaml = generateYAML({
        ...defaultParams,
        pid: true,
        db: true,
        th: 0.5,
        tl: -0.5,
        kim: 0,
      });

      expect(yaml).not.toContain('ki_multiplier:');
    });

    it('should omit kd_multiplier when kdm is 0', () => {
      const yaml = generateYAML({
        ...defaultParams,
        pid: true,
        db: true,
        th: 0.5,
        tl: -0.5,
        kdm: 0,
      });

      expect(yaml).not.toContain('kd_multiplier:');
    });

    it('should omit multipliers when not provided (undefined)', () => {
      const yaml = generateYAML({
        ...defaultParams,
        pid: true,
        db: true,
        th: 0.5,
        tl: -0.5,
        // kpm, kim, kdm not provided
      });

      expect(yaml).not.toContain('kp_multiplier:');
      expect(yaml).not.toContain('ki_multiplier:');
      expect(yaml).not.toContain('kd_multiplier:');
    });
  });

  describe('includeSensors option', () => {
    it('should include sensor section when includeSensors is true', () => {
      const yaml = generateYAML(defaultParams, { includeSensors: true });

      expect(yaml).toContain('# Diagnostic sensors');
      expect(yaml).toContain('sensor:');
      expect(yaml).toContain('type: HEATING_CURVE_OUTPUT');
      expect(yaml).toContain('type: FLOW_SETPOINT');
    });

    it('should include PID sensor when pid is enabled and sensors included', () => {
      const yaml = generateYAML(
        { ...defaultParams, pid: true },
        { includeSensors: true }
      );

      expect(yaml).toContain('type: PID_CORRECTION');
    });

    it('should not include PID sensor when pid is disabled', () => {
      const yaml = generateYAML(
        { ...defaultParams, pid: false },
        { includeSensors: true }
      );

      expect(yaml).not.toContain('type: PID_CORRECTION');
    });

    it('should include binary_sensor and text_sensor sections', () => {
      const yaml = generateYAML(defaultParams, { includeSensors: true });

      expect(yaml).toContain('binary_sensor:');
      expect(yaml).toContain('outdoor_sensor_fault:');
      expect(yaml).toContain('text_sensor:');
      expect(yaml).toContain('control_mode:');
    });
  });

  describe('includeNumbers option', () => {
    it('should include number section when includeNumbers is true', () => {
      const yaml = generateYAML(defaultParams, { includeNumbers: true });

      expect(yaml).toContain('# Runtime tuning');
      expect(yaml).toContain('number:');
      expect(yaml).toContain('heat_curve_coefficient:');
      expect(yaml).toContain('heat_curve_exponent:');
    });

    it('should include shift number when s is non-zero', () => {
      const yaml = generateYAML(
        { ...defaultParams, s: 5 },
        { includeNumbers: true }
      );

      expect(yaml).toContain('heat_curve_shift:');
    });

    it('should not include shift number when s is 0', () => {
      const yaml = generateYAML(
        { ...defaultParams, s: 0 },
        { includeNumbers: true }
      );

      expect(yaml).not.toContain('heat_curve_shift:');
    });

    it('should include PID numbers when pid is enabled and gains are non-zero', () => {
      const yaml = generateYAML(
        { ...defaultParams, pid: true, kp: 1.5, ki: 0.1, kd: 0.5 },
        { includeNumbers: true }
      );

      expect(yaml).toContain('pid_proportional_gain:');
      expect(yaml).toContain('pid_integral_gain:');
      expect(yaml).toContain('pid_derivative_gain:');
    });

    it('should not include PID numbers when pid is disabled', () => {
      const yaml = generateYAML(
        { ...defaultParams, pid: false },
        { includeNumbers: true }
      );

      expect(yaml).not.toContain('pid_proportional_gain:');
      expect(yaml).not.toContain('pid_integral_gain:');
      expect(yaml).not.toContain('pid_derivative_gain:');
    });

    it('should not include PID numbers when pid is enabled but all gains are zero', () => {
      const yaml = generateYAML(
        { ...defaultParams, pid: true, kp: 0, ki: 0, kd: 0 },
        { includeNumbers: true }
      );

      expect(yaml).not.toContain('pid_proportional_gain:');
      expect(yaml).not.toContain('pid_integral_gain:');
      expect(yaml).not.toContain('pid_derivative_gain:');
    });
  });

  describe('combination tests', () => {
    it('should handle full configuration with all options enabled', () => {
      const yaml = generateYAML(
        {
          t: 22,
          hc: 1.0,
          n: 1.3,
          s: 2,
          min: 25,
          max: 75,
          pid: true,
          kp: 1.5,
          ki: 0.1,
          kd: 0.5,
          db: true,
          th: 0.5,
          tl: -0.5,
          kpm: 0.1,
          kim: 0.2,
          kdm: 0.3,
        },
        { includeSensors: true, includeNumbers: true }
      );

      // Base params
      expect(yaml).toContain('default_target_temperature: 22°C');
      expect(yaml).toContain('heat_curve_coefficient: 1');
      expect(yaml).toContain('heat_curve_exponent: 1.3');
      expect(yaml).toContain('heat_curve_shift: 2');
      expect(yaml).toContain('min_flow_temp: 25°C');
      expect(yaml).toContain('max_flow_temp: 75°C');

      // PID params
      expect(yaml).toContain('kp: 1.5');
      expect(yaml).toContain('ki: 0.1');
      expect(yaml).toContain('kd: 0.5');

      // Deadband
      expect(yaml).toContain('deadband_parameters:');
      expect(yaml).toContain('threshold_high: 0.5');
      expect(yaml).toContain('threshold_low: -0.5');
      expect(yaml).toContain('kp_multiplier: 0.1');
      expect(yaml).toContain('ki_multiplier: 0.2');
      expect(yaml).toContain('kd_multiplier: 0.3');

      // Sensors
      expect(yaml).toContain('sensor:');
      expect(yaml).toContain('type: PID_CORRECTION');

      // Numbers
      expect(yaml).toContain('number:');
      expect(yaml).toContain('heat_curve_shift:');
      expect(yaml).toContain('pid_proportional_gain:');
    });

    it('should handle minimal configuration (curve only, no PID)', () => {
      const yaml = generateYAML(
        {
          t: 20,
          hc: 0.8,
          n: 1.2,
          s: 0,
          min: 20,
          max: 70,
          pid: false,
          kp: 0,
          ki: 0,
          kd: 0,
          db: false,
          th: 0,
          tl: 0,
          kpm: 0,
        },
        {}
      );

      expect(yaml).toContain('default_target_temperature: 20°C');
      expect(yaml).toContain('heat_curve_coefficient: 0.8');
      expect(yaml).toContain('heat_curve_exponent: 1.2');
      expect(yaml).not.toContain('heat_curve_shift:');
      expect(yaml).not.toContain('kp:');
      expect(yaml).not.toContain('deadband_parameters:');
      // Check for diagnostic sensor section specifically (not outdoor_sensor/indoor_sensor)
      expect(yaml).not.toContain('# Diagnostic sensors');
      expect(yaml).not.toMatch(/^number:/m);
    });

    it('should handle PID enabled but all gains are zero', () => {
      const yaml = generateYAML({
        ...defaultParams,
        pid: true,
        kp: 0,
        ki: 0,
        kd: 0,
      });

      expect(yaml).not.toContain('kp:');
      expect(yaml).not.toContain('ki:');
      expect(yaml).not.toContain('kd:');
    });

    it('should handle deadband enabled but all multipliers are zero/undefined', () => {
      const yaml = generateYAML({
        ...defaultParams,
        pid: true,
        db: true,
        th: 0.3,
        tl: -0.3,
        kpm: 0,
        kim: 0,
        kdm: 0,
      });

      expect(yaml).toContain('deadband_parameters:');
      expect(yaml).toContain('threshold_high: 0.3');
      expect(yaml).toContain('threshold_low: -0.3');
      expect(yaml).not.toContain('kp_multiplier:');
      expect(yaml).not.toContain('ki_multiplier:');
      expect(yaml).not.toContain('kd_multiplier:');
    });
  });

  describe('date header', () => {
    it('should include date in header', () => {
      const yaml = generateYAML(defaultParams);
      const today = new Date().toISOString().split('T')[0];

      expect(yaml).toContain(today);
    });
  });
});
