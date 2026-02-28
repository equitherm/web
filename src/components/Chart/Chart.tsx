// src/components/Chart/Chart.tsx
import { useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { useTheme } from '../../contexts/ThemeContext';
import { computeFlowTemperature, createPIDState, computePID, getRoomTempActual } from '@equitherm-studio/core';
import type { CurveState, PIDStoreSlice, ComputedStatus } from '../../types';
import Chart, { type TooltipItem } from 'chart.js/auto';
import styles from './Chart.module.css';

// Type for the chart instance
type ChartInstance = Chart<'line', { x: number; y: number }[], unknown>;

// Type for PID runtime state
interface PIDRuntimeState {
  mode: string;
  roomTemp: number;
  kp: number;
  ki: number;
  kd: number;
  deadband?: {
    enabled: boolean;
    thresholdHigh: number;
    thresholdLow: number;
    kpMultiplier: number;
  };
}

export function HeatingChart() {
  const curve = useStore(s => s.curve);
  const pid = useStore(s => s.pid);
  const tCurrent = useStore(s => s.ui.tCurrent);
  const setComputed = useStore(s => s.setComputed);
  const { isDark } = useTheme();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartInstance | null>(null);
  const pidRuntimeRef = useRef<PIDRuntimeState>(createPIDState() as PIDRuntimeState);
  const rafRef = useRef<number | null>(null);

  // Sync store PID params to runtime ref when they change
  useEffect(() => {
    pidRuntimeRef.current = {
      ...pidRuntimeRef.current,
      mode: pid.mode,
      roomTemp: pid.roomTemp,
      kp: pid.kp,
      ki: pid.ki,
      kd: pid.kd,
      deadband: {
        enabled: pid.deadbandEnabled,
        thresholdHigh: pid.deadbandThresholdHigh,
        thresholdLow: pid.deadbandThresholdLow,
        kpMultiplier: pid.deadbandKpMultiplier,
      },
    };
  }, [pid]);

  // Single effect — mount, update, unmount
  useEffect(() => {
    // Mount: create chart if not exists
    if (!chartRef.current && canvasRef.current) {
      chartRef.current = new Chart(canvasRef.current, buildChartConfig(isDark)) as ChartInstance;
    }

    // Cancel pending update
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    // Schedule update (including initial)
    rafRef.current = requestAnimationFrame(() => {
      if (chartRef.current) {
        const results = updateChartAndGetResults(
          chartRef.current,
          curve,
          pid,
          tCurrent,
          pidRuntimeRef.current,
          isDark
        );
        setComputed(results);
      }
      rafRef.current = null;
    });

    // Cleanup
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [curve, pid, tCurrent, setComputed, isDark]);

  // Unmount only — destroy chart
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  return (
    <section className={styles.container}>
      <canvas ref={canvasRef} />
    </section>
  );
}

// Helper functions for per-point styling
const mkR = (len: number, idx: number, r: number): number[] =>
  Array.from({ length: len }, (_, i) => i === idx ? r : 0);
const mkHR = (len: number, idx: number, r: number): number[] =>
  Array.from({ length: len }, (_, i) => i === idx ? r : 6);
const mkC = (len: number, idx: number, c: string): string[] =>
  Array.from({ length: len }, (_, i) => i === idx ? c : 'transparent');

// Theme colors for chart
interface ChartThemeColors {
  chartLine: string;
  chartFill: string;
  chartPoint: string;
  chartText: string;
  chartGrid: string;
}

function getChartThemeColors(isDark: boolean): ChartThemeColors {
  return isDark ? {
    chartLine: 'rgba(24, 188, 242, 1)',
    chartFill: 'rgba(24, 188, 242, 0.15)',
    chartPoint: 'rgba(24, 188, 242, 1)',
    chartText: 'rgba(255, 255, 255, 0.7)',
    chartGrid: 'rgba(255, 255, 255, 0.1)',
  } : {
    chartLine: 'rgba(0, 151, 157, 1)',
    chartFill: 'rgba(0, 151, 157, 0.15)',
    chartPoint: 'rgba(0, 151, 157, 1)',
    chartText: 'rgba(0, 0, 0, 0.7)',
    chartGrid: 'rgba(0, 0, 0, 0.1)',
  };
}

// Generate chart data points
function generateChartData(curve: CurveState, tCurrent: number): { data: { x: number; y: number }[]; curIdx: number } {
  const xSet = new Set<number>();
  for (let t = curve.tOutMin; t <= curve.tOutMax; t++) xSet.add(t);
  if (tCurrent >= curve.tOutMin && tCurrent <= curve.tOutMax) {
    xSet.add(tCurrent);
  }
  const xValues = Array.from(xSet).sort((a, b) => a - b);
  const curIdx = xValues.indexOf(tCurrent);
  const data = xValues.map(t => ({
    x: t,
    y: computeFlowTemperature({
      tTarget: curve.tTarget, tOutdoor: t, hc: curve.hc, n: curve.n,
      shift: curve.shift, minFlow: curve.minFlow, maxFlow: curve.maxFlow
    })
  }));
  return { data, curIdx };
}

// Build Chart.js config
function buildChartConfig(isDark: boolean) {
  const theme = getChartThemeColors(isDark);
  return {
    type: 'line' as const,
    data: { datasets: [] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index' as const, intersect: false },
      layout: { padding: 8 },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.85)',
          titleFont: { family: "'IBM Plex Mono'", size: 11 },
          bodyFont: { family: "'IBM Plex Mono'", size: 11 },
          padding: 10,
          cornerRadius: 6,
          callbacks: {
            title: (items: TooltipItem<'line'>[]) =>
              items.length ? `Outdoor: ${(items[0].parsed.x as number).toFixed(1)}°C` : '',
            label: (ctx: TooltipItem<'line'>) =>
              ctx.raw === null || ctx.parsed.y === null ? '' : `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}°C`
          }
        }
      },
      scales: {
        x: {
          type: 'linear' as const,
          reverse: true,
          title: { display: true, text: 'Outdoor (°C)', color: theme.chartText, font: { family: "'IBM Plex Mono'", size: 10 } },
          ticks: { color: theme.chartText, font: { size: 10 } },
          grid: { color: theme.chartGrid }
        },
        y: {
          title: { display: true, text: 'Flow (°C)', color: theme.chartText, font: { family: "'IBM Plex Mono'", size: 10 } },
          ticks: { color: theme.chartText, font: { size: 10 } },
          grid: { color: theme.chartGrid }
        }
      },
      animation: { duration: 300 }
    }
  };
}

// Update chart data and compute results
function updateChartAndGetResults(
  chart: ChartInstance,
  curve: CurveState,
  pid: PIDStoreSlice,
  tCurrent: number,
  pidRuntime: PIDRuntimeState,
  isDark: boolean
): { flowTemp: number; pidRawOutput: number; pidScaledOutput: number; status: ComputedStatus } {
  const { data: equithermData, curIdx } = generateChartData(curve, tCurrent);
  const theme = getChartThemeColors(isDark);

  // Compute equitherm flow at current outdoor temp
  const equithermFlow = computeFlowTemperature({
    tTarget: curve.tTarget, tOutdoor: tCurrent, hc: curve.hc, n: curve.n,
    shift: curve.shift, minFlow: curve.minFlow, maxFlow: curve.maxFlow
  });

  // Compute PID correction
  let pidCorrection = 0;
  let scaledCorrection = 0;
  let combinedFlow = equithermFlow;

  if (pid.enabled) {
    const roomTemp = getRoomTempActual(pidRuntime, curve.tTarget);
    const pidResult = computePID(pidRuntime, curve.tTarget, roomTemp);
    pidCorrection = pidResult.total;
    scaledCorrection = pidCorrection;
    combinedFlow = Math.max(curve.minFlow, Math.min(curve.maxFlow, equithermFlow + scaledCorrection));
  }

  // Build datasets
  const datasets: Chart<'line', { x: number; y: number }[]>['data']['datasets'] = [];

  if (pid.enabled) {
    // Dashed equitherm line
    datasets.push({
      label: 'Equitherm',
      data: equithermData,
      borderColor: theme.chartLine,
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderDash: [5, 5],
      tension: 0.15,
      pointRadius: 0,
      pointHoverRadius: 6
    });

    // Combined line with fill
    const combinedData = equithermData.map(point => ({
      x: point.x,
      y: Math.max(curve.minFlow, Math.min(curve.maxFlow, point.y + pidCorrection))
    }));

    datasets.push({
      label: 'Combined',
      data: combinedData,
      borderColor: theme.chartLine,
      backgroundColor: theme.chartFill,
      borderWidth: 2.5,
      fill: true,
      tension: 0.15,
      pointRadius: mkR(combinedData.length, curIdx, 7),
      pointHoverRadius: mkHR(combinedData.length, curIdx, 10),
      pointBackgroundColor: mkC(combinedData.length, curIdx, theme.chartPoint),
      pointBorderColor: mkC(combinedData.length, curIdx, theme.chartPoint),
      clip: false
    });
  } else {
    datasets.push({
      label: 'Flow Temp',
      data: equithermData,
      borderColor: theme.chartLine,
      backgroundColor: theme.chartFill,
      borderWidth: 2.5,
      fill: true,
      tension: 0.15,
      pointRadius: mkR(equithermData.length, curIdx, 7),
      pointHoverRadius: mkHR(equithermData.length, curIdx, 10),
      pointBackgroundColor: mkC(equithermData.length, curIdx, theme.chartPoint),
      pointBorderColor: mkC(equithermData.length, curIdx, theme.chartPoint),
      clip: false
    });
  }

  chart.data.datasets = datasets;
  chart.update('none');

  // Compute status
  const deltaT = curve.tTarget - tCurrent;
  let status: ComputedStatus = 'standby';
  if (deltaT > 0) {
    status = combinedFlow < 45 ? 'heating' : 'high-load';
  }

  return {
    flowTemp: combinedFlow,
    pidRawOutput: pidCorrection,
    pidScaledOutput: scaledCorrection,
    status,
  };
}
