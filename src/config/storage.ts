// src/config/storage.ts
// Configuration persistence (localStorage, URL)

import type { SavedConfig, PartialStoreConfig, CurveState } from '../types';

const STORAGE_KEY = 'equitherm-configs';
const MAX_CONFIGS = 10;

/**
 * Load all saved configurations from localStorage
 */
export function loadAllConfigs(): SavedConfig[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as SavedConfig[];
  } catch {
    return [];
  }
}

/**
 * Save a configuration to localStorage
 */
export function saveConfig(name: string, data: PartialStoreConfig): boolean {
  const configs = loadAllConfigs();
  const config: SavedConfig = {
    name,
    data,
    timestamp: Date.now()
  };

  const existingIdx = configs.findIndex(c => c.name === name);
  if (existingIdx >= 0) {
    configs[existingIdx] = config;
  } else {
    configs.unshift(config);
    if (configs.length > MAX_CONFIGS) {
      configs.pop();
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
  return true;
}

/**
 * Load a specific configuration by name
 */
export function loadConfig(name: string): PartialStoreConfig | null {
  const configs = loadAllConfigs();
  const config = configs.find(c => c.name === name);
  return config ? config.data : null;
}

/**
 * Delete a configuration by name
 */
export function deleteConfig(name: string): void {
  const configs = loadAllConfigs().filter(c => c.name !== name);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
}

/**
 * Parse URL query parameters
 */
export function parseURLQuery(): URLSearchParams | null {
  if (!window.location.search) return null;
  return new URLSearchParams(window.location.search);
}

/**
 * Parse URL hash parameters
 */
export function parseURLHash(): URLSearchParams | null {
  if (!window.location.hash) return null;
  return new URLSearchParams(window.location.hash.slice(1));
}

// URL parameter mappings
type CurveKey = keyof CurveState;
type CurveMapping = [string, CurveKey];

const curveMappings: CurveMapping[] = [
  ['t', 'tTarget'], ['hc', 'hc'], ['n', 'n'], ['s', 'shift'],
  ['min', 'minFlow'], ['max', 'maxFlow'],
  ['tmin', 'tOutMin'], ['tmax', 'tOutMax'],
];

/**
 * Load configuration from URL (supports both query params and hash)
 * Query params take precedence over hash params
 */
export function loadFromURL(): PartialStoreConfig | null {
  const params = parseURLQuery() || parseURLHash();
  if (!params) return null;

  const config: PartialStoreConfig = { curve: {}, pid: {}, ui: {} };

  // Curve parameters
  for (const [urlKey, configKey] of curveMappings) {
    if (params.has(urlKey)) {
      (config.curve as Record<string, number>)[configKey] = parseFloat(params.get(urlKey)!);
    }
  }

  // Current outdoor temp (ui)
  if (params.has('tcur')) {
    config.ui!.tCurrent = parseFloat(params.get('tcur')!);
  }

  // PID enabled
  if (params.has('pid')) {
    config.pid!.enabled = params.get('pid') === '1';
  }

  // PID gains
  if (params.has('kp')) config.pid!.kp = parseFloat(params.get('kp')!);
  if (params.has('ki')) config.pid!.ki = parseFloat(params.get('ki')!);
  if (params.has('kd')) config.pid!.kd = parseFloat(params.get('kd')!);

  // Deadband
  if (params.has('db')) config.pid!.deadbandEnabled = params.get('db') === '1';
  if (params.has('th')) config.pid!.deadbandThresholdHigh = parseFloat(params.get('th')!);
  if (params.has('tl')) config.pid!.deadbandThresholdLow = parseFloat(params.get('tl')!);

  return config;
}

/**
 * Encode config data to URL hash string
 */
export function encodeToURL(data: Record<string, unknown>): string {
  const hash = Object.entries(data)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join('&');
  return `${window.location.origin}${window.location.pathname}#${hash}`;
}

/**
 * Get config names for dropdown display
 */
export function getConfigNames(): string[] {
  return loadAllConfigs().map(c => c.name);
}
