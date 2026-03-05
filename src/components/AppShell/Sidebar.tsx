// src/components/AppShell/Sidebar.tsx
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ControlsCard } from '../ControlsCard';
import { PIDPanel } from '../PIDPanel';
import { PresetsPanel } from '../SidePanel/PresetsPanel';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {

  return (
    <Card className={cn(
      "flex flex-col overflow-hidden",
      "h-full md:h-[560px] md:w-[340px] lg:w-[400px]",
      "border-border shadow-card"
    )}>
      {/* Tab Bar */}
      <Tabs value={activeTab} onValueChange={onTabChange} className="flex flex-col flex-1 min-h-0">
        <TabsList className={cn(
          "w-full rounded-none border-b border-border bg-secondary/50 shrink-0",
          "flex-row gap-0"
        )}>
          <TabsTrigger
            value="curve"
            className={cn(
              "relative flex-1 min-h-touch",
              "rounded-none text-xs font-ui font-medium tracking-wide uppercase",
              "transition-all duration-normal",
              "data-[state=active]:bg-transparent data-[state=active]:text-primary",
              "data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground",
              "after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5",
              "after:bg-transparent after:transition-all after:duration-normal",
              "data-[state=active]:after:bg-accent data-[state=active]:after:shadow-glow-heating"
            )}
          >
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h4l3-9 6 18 3-9h4"/>
              </svg>
              <span className="hidden sm:inline">Curve</span>
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="pid"
            className={cn(
              "relative flex-1 min-h-touch",
              "rounded-none text-xs font-ui font-medium tracking-wide uppercase",
              "transition-all duration-normal",
              "data-[state=active]:bg-transparent data-[state=active]:text-primary",
              "data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground",
              "after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5",
              "after:bg-transparent after:transition-all after:duration-normal",
              "data-[state=active]:after:bg-accent data-[state=active]:after:shadow-glow-heating"
            )}
          >
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>
              </svg>
              <span className="hidden sm:inline">PID</span>
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="presets"
            className={cn(
              "relative flex-1 min-h-touch",
              "rounded-none text-xs font-ui font-medium tracking-wide uppercase",
              "transition-all duration-normal",
              "data-[state=active]:bg-transparent data-[state=active]:text-primary",
              "data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground",
              "after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5",
              "after:bg-transparent after:transition-all after:duration-normal",
              "data-[state=active]:after:bg-accent data-[state=active]:after:shadow-glow-heating"
            )}
          >
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              <span className="hidden sm:inline">Presets</span>
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <ScrollArea className="flex-1 min-h-0">
          <TabsContent value="curve" className="m-0 focus-visible:outline-none">
            <div className="p-4">
              <ControlsCard />
            </div>
          </TabsContent>

          <TabsContent value="pid" className="m-0 focus-visible:outline-none">
            <div className="p-4">
              <PIDPanel />
            </div>
          </TabsContent>

          <TabsContent value="presets" className="m-0 focus-visible:outline-none">
            <div className="p-4">
              <PresetsPanel />
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </Card>
  );
}
