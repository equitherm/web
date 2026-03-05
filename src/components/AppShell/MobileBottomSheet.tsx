import { useState } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ControlsCard } from '../ControlsCard';
import { PIDPanel } from '../PIDPanel';
import { PresetsPanel } from '../SidePanel/PresetsPanel';
import { cn } from '@/lib/utils';

interface MobileBottomSheetProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { value: 'curve', label: 'Curve', icon: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12h4l3-9 6 18 3-9h4"/>
    </svg>
  )},
  { value: 'pid', label: 'PID', icon: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>
    </svg>
  )},
  { value: 'presets', label: 'Presets', icon: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
  )},
];

export function MobileBottomSheet({ activeTab, onTabChange }: MobileBottomSheetProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleTabClick = (tab: string) => {
    if (activeTab === tab && isOpen) {
      setIsOpen(false);
    } else {
      onTabChange(tab);
      setIsOpen(true);
    }
  };

  // Render all panels to preserve state, hide non-active with CSS
  const renderContent = () => (
    <>
      <div className={cn(activeTab !== 'curve' && 'hidden')}>
        <ControlsCard />
      </div>
      <div className={cn(activeTab !== 'pid' && 'hidden')}>
        <PIDPanel />
      </div>
      <div className={cn(activeTab !== 'presets' && 'hidden')}>
        <PresetsPanel />
      </div>
    </>
  );

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      {/* Tab Bar */}
      <div className="flex items-center justify-around bg-card/95 backdrop-blur-sm border-t border-border px-2 py-1 pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabClick(tab.value)}
            aria-label={tab.label}
            aria-pressed={activeTab === tab.value && isOpen}
            className={cn(
              "flex flex-col items-center justify-center min-w-touch min-h-touch rounded-lg transition-all duration-fast",
              activeTab === tab.value && isOpen
                ? "text-accent"
                : "text-muted-foreground"
            )}
          >
            {tab.icon}
            <span className="text-[0.6rem] font-ui font-medium uppercase tracking-wide mt-0.5">
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="bottom"
          className="h-[60vh] rounded-t-2xl border-t border-border bg-card p-0"
        >
          {/* Drag Handle */}
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
          </div>

          {/* Content */}
          <div className="overflow-y-auto h-[calc(100%-2rem)] p-4">
            {renderContent()}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
