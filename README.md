<div align="center">

# equitherm-web

**Visual companion tools for the ESPHome [`equitherm`](https://github.com/P4uLT/esphome) climate component**

[![CI](https://github.com/equitherm/web/actions/workflows/ci.yml/badge.svg)](https://github.com/equitherm/web/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://equitherm.org)

[**→ Open the app**](https://equitherm.org)

</div>

---

Configuring an equitherm heating curve means tuning several interdependent parameters — heat curve coefficient, exponent, shift, flow limits — and guessing wrong means your boiler either never reaches setpoint or overshoots it. **equitherm-web** lets you see the full curve in real time, simulate PID corrections at any outdoor temperature, and export a ready-to-paste ESPHome YAML config, all without touching your device.

---

## Features

### Heating Curve Calculator
- Interactive chart showing flow temperature across the full outdoor range
- Live updates as you adjust any parameter — no submit button
- Configurable outdoor range, flow min/max, room setpoint, shift

### PID Simulator
- Offset mode (room error from setpoint) or absolute mode (actual room temp)
- See how Kp adjusts the curve in real time
- Deadband configuration with per-parameter multipliers (Kp/Ki/Kd)

### ESPHome YAML Generator
- One-click export of a complete `equitherm` climate config block
- Only includes non-default values — clean, minimal output
- Optional diagnostic sensors and runtime tuning number entities

### Share & Save
- **URL sharing** — every config state is encoded in the URL, shareable as a link
- **Presets** — save up to 10 named configurations in your browser (LocalStorage)
- **No account, no server** — everything runs in your browser

### Interface
- Dark / light theme (ESPHome-inspired palette)
- Mobile-first responsive layout with container queries
- Keyboard-accessible sliders via shadcn/ui + Radix primitives

---

## Try it

**No install needed.** Open [https://equitherm.org](https://equitherm.org) in any modern browser.

To share your configuration, click **Share** in the header — the URL encodes all parameters and can be sent directly.

---

## How it works

The flow temperature formula at the core of the equitherm component:

```
t_flow = t_target + shift + hc × (t_target - t_outdoor)^(1/n)
```

| Parameter  | Description              | Range        |
|------------|--------------------------|--------------|
| `t_target` | Room setpoint            | 16 – 26 °C   |
| `hc`       | Heat curve coefficient   | 0.5 – 3.0    |
| `n`        | Curve exponent           | 1.0 – 2.0    |
| `shift`    | Constant offset          | −15 to +15 °C|
| `minFlow`  | Minimum flow temperature | 15 – 35 °C   |
| `maxFlow`  | Maximum flow temperature | 50 – 90 °C   |

The result is clamped to `[minFlow, maxFlow]` and rounded to 0.1 °C precision (OpenTherm convention).

All computation runs in the browser via [`@equitherm/core`](https://github.com/equitherm/core) — no network requests, no telemetry.

---

## Development

```bash
# Install dependencies
pnpm install

# Start dev server (localhost:5173)
pnpm dev

# Run tests
pnpm test

# Type check
pnpm typecheck

# Build
pnpm build
```

Or via [Task](https://taskfile.dev): `task dev`, `task test`, `task ci`.

**Tech stack:** React 19 · Vite 5 · Zustand · Recharts · shadcn/ui · Tailwind CSS · Vitest

---

## Deployment

Automatically deployed to Netlify on merge to main.

---

## Related

- [ESPHome `equitherm` component](https://github.com/P4uLT/esphome) — the climate component this tool configures
- [ESPHome documentation](https://esphome.io/components/climate/equitherm/) — official ESPHome docs
- [@equitherm/core](https://github.com/equitherm/core) — core calculation library
- [equitherm/lovelace](https://github.com/equitherm/lovelace) — Home Assistant Lovelace cards

---

## License

[MIT](LICENSE) © P4uLT
