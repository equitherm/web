# CLAUDE.md

Guidance for Claude Code when working with this project.

## Project Overview

**@equitherm/web** - React web application for ESPHome equitherm climate component configuration.

## Commands

```bash
pnpm dev          # Start dev server (localhost:5173)
pnpm build        # Build for production
pnpm test         # Run tests (Vitest)
pnpm typecheck    # TypeScript type check (strict mode)
```

## Tech Stack

| Layer           | Technology                                      |
| --------------- | ----------------------------------------------- |
| Package Manager | pnpm 9                                          |
| Build           | Vite 5.x                                        |
| UI              | React 19 + shadcn/ui (Radix primitives)         |
| State           | Zustand                                         |
| Charts          | Recharts                                        |
| Styling         | Tailwind CSS 3.x + CSS Custom Properties        |
| Responsive      | @tailwindcss/container-queries + fluid-tailwind |
| Icons           | Lucide React                                    |
| Testing         | Vitest                                          |

## Architecture

```
src/
├── components/      # React UI components
│   ├── AppShell/    # Header, Sidebar, OutputDisplay, StatusIndicator
│   ├── Chart/       # Chart, useChartData, useComputedFlow
│   ├── ControlsCard/# ControlsCard, SliderControl, SliderPair, InfoTooltip
│   ├── SidePanel/   # SidePanel (Curve/PID/Presets tabs), PresetsPanel
│   └── ui/          # shadcn/ui primitives
├── store/           # Zustand state management
├── config/          # storage.ts, yaml.ts, URL parsing
├── contexts/        # ThemeContext
├── lib/             # Utilities (cn, toast, pid helpers)
├── styles/          # Tailwind base, themes
└── types/           # Web-specific types
```

## Key Conventions

1. **Workspace imports**: Uses `@equitherm/core` from npm
2. **Selector pattern**: Use Zustand selectors to minimize re-renders
3. **Tailwind CSS**: Use Tailwind utility classes; `cn()` for conditional merging
4. **shadcn/ui**: UI primitives in `components/ui/`; use Radix-based components
5. **Co-located tests**: Test files live next to source (`*.test.ts`)
6. **Index re-exports**: Each component folder has `index.ts`
7. **Custom hooks**: Complex computations in hooks (useComputedFlow, useChartData)
8. **Path alias**: Use `@/` for imports (e.g., `@/components/ui/button`)
