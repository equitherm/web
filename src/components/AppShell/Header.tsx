// src/components/AppShell/Header.tsx
import { useTheme } from '@/contexts/ThemeContext';
import { OutputDisplay, OutdoorSlider } from './OutputDisplay';
import { ExportSheet } from './ExportSheet';
import { showToast } from '@/lib/toast';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Flame, Link2 } from 'lucide-react';

export function Header() {
  const { theme, setTheme } = useTheme();

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
    <header className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-3 bg-card border border-border rounded-xl mb-3 sm:mb-4">
      {/* Row 1: Logo + Output + Actions */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Logo - visible on sm+ instead of lg+ for balance */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent/10 border border-accent/30 shadow-glow-heating transition-shadow duration-normal">
            <Flame className="w-5 h-5 text-accent" />
          </div>
          <div className="flex flex-col">
            <span className="font-ui font-bold text-foreground text-sm leading-none tracking-tight">Equitherm</span>
            <span className="font-ui text-[0.6rem] text-muted-foreground uppercase tracking-widest">Studio</span>
          </div>
        </div>

        {/* Output Display - Main Hero */}
        <div className="flex-1 min-w-0">
          <OutputDisplay />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 min-h-touch h-8 hover:shadow-glow-focus transition-shadow duration-fast"
            onClick={handleShare}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-xs">Share</span>
          </Button>

          <ExportSheet />

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
              "bg-secondary border border-border hover:border-accent/50",
            )}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg className="w-4 h-4 text-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9-9-9a6 6 0 0 1 9-9z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Row 2: Outdoor Slider (mobile only, full width) */}
      <div className="sm:hidden">
        <OutdoorSlider />
      </div>
    </header>
  );
}
