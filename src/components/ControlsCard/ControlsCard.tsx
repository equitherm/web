// src/components/ControlsCard/ControlsCard.tsx
import { useStore } from '@/store/useStore';
import { SliderControl } from './SliderControl';
import { InfoTooltip } from './InfoTooltip';

// Tooltip icons as SVG components
const SetpointIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 12h4l3-9 6 18 3-9h4"/>
  </svg>
);

const HeatCurveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>
);

const ShiftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const MinFlowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 15l-6-6-6 6"/>
  </svg>
);

const MaxFlowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9l6 6 6-6"/>
  </svg>
);

const OutMinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2v20M2 12h20"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const OutMaxIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
  </svg>
);

export function ControlsCard() {
  const curve = useStore(s => s.curve);
  const setCurveParam = useStore(s => s.setCurveParam);

  return (
    <div className="space-y-4">
      <SliderControl
        id="t_target"
        label="Room Setpoint"
        min={16}
        max={26}
        step={0.5}
        value={curve.tTarget}
        unit="°C"
        onChange={v => setCurveParam('tTarget', v)}
        tooltip={
          <InfoTooltip title="Room Setpoint" icon={<SetpointIcon />}>
            <p>The <strong>target indoor temperature</strong> you want to maintain.</p>
            <p>Typical range: 18-22°C for comfort.</p>
          </InfoTooltip>
        }
      />

      <SliderControl
        id="hc"
        label="Heat Curve (hc)"
        min={0.5}
        max={3}
        step={0.05}
        value={curve.hc}
        unit=""
        onChange={v => setCurveParam('hc', v)}
        tooltip={
          <InfoTooltip title="Heat Curve Coefficient" icon={<HeatCurveIcon />}>
            <p>Controls how <strong>aggressively</strong> flow temperature increases as it gets colder outside.</p>
            <p>Higher = steeper curve. Start with 0.9 and adjust based on system response.</p>
          </InfoTooltip>
        }
      />

      <SliderControl
        id="n"
        label="Exponent (n)"
        min={1.0}
        max={2.0}
        step={0.01}
        value={curve.n}
        unit=""
        onChange={v => setCurveParam('n', v)}
        tooltip={
          <InfoTooltip title="Curve Exponent" icon={<span>n</span>}>
            <p>Controls the <strong>non-linearity</strong> of the heating curve.</p>
            <p><code>ΔT<sup>1/n</sup></code></p>
            <p>Lower values (1.0-1.2) = more aggressive at extremes. Higher values (1.5-2.0) = gentler curve. Most systems work well at 1.25.</p>
          </InfoTooltip>
        }
      />

      <SliderControl
        id="shift"
        label="Shift"
        min={-15}
        max={15}
        step={0.5}
        value={curve.shift}
        unit="°C"
        onChange={v => setCurveParam('shift', v)}
        tooltip={
          <InfoTooltip title="Temperature Shift" icon={<ShiftIcon />}>
            <p>A <strong>constant offset</strong> added to the calculated flow temperature.</p>
            <p>Use to fine-tune the curve up (+) or down (-) without changing its shape.</p>
          </InfoTooltip>
        }
      />
      {/* Limits section divider */}
      <div className="flex items-center gap-2 pt-2">
        <span className="text-[0.6rem] font-ui font-medium text-muted-foreground uppercase tracking-wider shrink-0">
          Limits
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Flow limits - side by side */}
      <div className="grid grid-cols-2 gap-x-8">
        <SliderControl
          id="min_flow"
          label="Min Flow"
          min={15}
          max={35}
          step={1}
          value={curve.minFlow}
          unit="°C"
          onChange={v => setCurveParam('minFlow', v)}
          tooltip={
            <InfoTooltip title="Minimum Flow Temperature" icon={<MinFlowIcon />}>
              <p>The <strong>lowest allowed</strong> flow temperature, even when it's warm outside.</p>
              <p>Protects the boiler and ensures proper circulation.</p>
            </InfoTooltip>
          }
        />

        <SliderControl
          id="max_flow"
          label="Max Flow"
          min={50}
          max={90}
          step={1}
          value={curve.maxFlow}
          unit="°C"
          onChange={v => setCurveParam('maxFlow', v)}
          tooltip={
            <InfoTooltip title="Maximum Flow Temperature" icon={<MaxFlowIcon />}>
              <p>The <strong>highest allowed</strong> flow temperature at extreme cold.</p>
              <p>Limits protect floor pipes and prevent overheating.</p>
            </InfoTooltip>
          }
        />
      </div>

      {/* Outdoor range section divider */}
      <div className="flex items-center gap-2 pt-2">
        <span className="text-[0.6rem] font-ui font-medium text-muted-foreground uppercase tracking-wider shrink-0">
          Outdoor Range
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Outdoor range - side by side */}
      <div className="grid grid-cols-2 gap-x-8">
        <SliderControl
          id="t_out_min"
          label="Outdoor Min"
          min={-30}
          max={-1}
          step={1}
          value={curve.tOutMin}
          unit="°C"
          onChange={v => setCurveParam('tOutMin', v)}
          tooltip={
            <InfoTooltip title="Outdoor Temperature Minimum" icon={<OutMinIcon />}>
              <p>The <strong>coldest outdoor temperature</strong> in your climate for curve design.</p>
              <p>Typical values: -20°C (cold), -10°C (moderate).</p>
            </InfoTooltip>
          }
        />

        <SliderControl
          id="t_out_max"
          label="Outdoor Max"
          min={1}
          max={30}
          step={1}
          value={curve.tOutMax}
          unit="°C"
          onChange={v => setCurveParam('tOutMax', v)}
          tooltip={
            <InfoTooltip title="Outdoor Temperature Maximum" icon={<OutMaxIcon />}>
              <p>The <strong>warmest outdoor temperature</strong> where heating is still needed.</p>
              <p>Usually 15-20°C. Below this, heating activates.</p>
            </InfoTooltip>
          }
        />
      </div>

      <div className="bg-secondary rounded-md p-2 text-center">
        <code className="font-mono text-xs text-secondary-foreground">t_flow = t_target + shift + hc × ΔT<sup>1/n</sup></code>
      </div>
    </div>
  );
}
