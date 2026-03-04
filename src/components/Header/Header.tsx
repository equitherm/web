// src/components/Header/Header.tsx
import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { useTheme } from '../../contexts/ThemeContext';
import { ResultDisplay } from '../ResultDisplay';
import { YAMLModal } from '../Modals/YAMLModal';
import { PresetsDropdown } from './PresetsDropdown';
import { showToast } from '@/lib/toast';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
    </svg>
  );
}

export function Header() {
  const { theme, setTheme } = useTheme();
  const [yamlOpen, setYamlOpen] = useState(false);

  const handleShare = () => {
    const curve = useStore.getState().curve;
    const pid = useStore.getState().pid;
    const params = new URLSearchParams({
      t: String(curve.tTarget),
      hc: String(curve.hc),
      n: String(curve.n),
      s: String(curve.shift),
      min: String(curve.minFlow),
      max: String(curve.maxFlow),
      pid: pid.enabled ? '1' : '0',
    });
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(url);
    showToast('URL copied to clipboard', 'success');
  };

  return (
    <>
      <header className="flex flex-wrap items-center gap-3 px-4 py-3 bg-card border border-border rounded-xl mb-4">
        <div className="flex-none">
          <h1 className="text-lg font-bold font-figtree text-foreground whitespace-nowrap">
            Equitherm Calculator
          </h1>
        </div>

        {/* Spacer pushes theme toggle right on mobile */}
        <div className="flex-1 md:hidden" />

        <div className="flex gap-2 w-full md:w-auto flex-none">
          <Button
            variant="outline"
            size="sm"
            className="text-2xs gap-1.5"
            onClick={() => setYamlOpen(true)}
          >
            <CopyIcon className="w-3.5 h-3.5" />
            YAML
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-2xs gap-1.5"
            onClick={handleShare}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            Share
          </Button>
          <PresetsDropdown />
        </div>

        <div className="w-full md:flex-1 md:min-w-0">
          <ResultDisplay />
        </div>

        <div className="flex-none md:order-last">
          <ToggleGroup
            type="single"
            value={theme}
            onValueChange={(value) => value && setTheme(value as 'light' | 'dark')}
            className="bg-secondary p-1 rounded-lg border border-border"
          >
            <ToggleGroupItem
              value="dark"
              className="w-9 h-9 data-[state=on]:text-accent data-[state=on]:shadow-[inset_0_0_0_1px_hsl(var(--accent))]"
              title="ESPHome Dark"
            >
              <MoonIcon className="w-[18px] h-[18px]" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="light"
              className="w-9 h-9 data-[state=on]:text-accent data-[state=on]:shadow-[inset_0_0_0_1px_hsl(var(--accent))]"
              title="ESPHome Light"
            >
              <SunIcon className="w-[18px] h-[18px]" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </header>

      <YAMLModal isOpen={yamlOpen} onClose={() => setYamlOpen(false)} />
    </>
  );
}
