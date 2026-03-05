import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { SliderPair } from './slider-pair';
import { YAMLModal } from '../Modals/YAMLModal';
import { InfoTooltip } from '../ControlsCard/InfoTooltip';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export function ExportSheet() {
  const pid = useStore(s => s.pid);
  const setPidParam = useStore(s => s.setPidParam);
  const [open, setOpen] = useState(false);
  const [showYaml, setShowYaml] = useState(false);
  const [includeSensors, setIncludeSensors] = useState(false);
  const [includeNumbers, setIncludeNumbers] = useState(false);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 min-h-touch h-8 hover:shadow-glow-focus transition-shadow duration-fast"
          >
            <DownloadIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-xs">Export</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[400px] sm:w-[540px] flex flex-col p-0">
          <SheetHeader className="px-6 pt-6 pb-4">
            <SheetTitle className="flex items-center gap-2">
              <DownloadIcon className="w-5 h-5 text-accent" />
              ESPHome Export
            </SheetTitle>
            <SheetDescription>
              Configure time-domain parameters and export options for your ESPHome YAML configuration.
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="flex-1 px-6">
            {/* Time-Domain PID Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">Time-Domain PID</h4>
                <InfoTooltip title="Time-Domain Parameters" icon={<span>⏱</span>} position="sideLeft" size="small">
                  <p><strong>Export only</strong> — These values require real-time sensor data over time.</p>
                  <p>Ki accumulates error. Kd measures rate of change.</p>
                </InfoTooltip>
              </div>
              <p className="text-xs text-muted-foreground italic">
                These parameters don&apos;t affect the curve preview but are included in the YAML export.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <SliderPair
                  id="export-ki"
                  label="Ki (Integral)"
                  min={0}
                  max={0.5}
                  step={0.0001}
                  value={pid.ki}
                  onChange={(v) => setPidParam('ki', v)}
                />
                <SliderPair
                  id="export-kd"
                  label="Kd (Derivative)"
                  min={0}
                  max={2}
                  step={0.05}
                  value={pid.kd}
                  onChange={(v) => setPidParam('kd', v)}
                />
              </div>
            </section>

            <Separator className="my-6" />

            {/* Deadband Multipliers Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">Deadband Multipliers</h4>
                <InfoTooltip title="Deadband Multipliers" icon={<span>⚖</span>} position="sideLeft" size="small">
                  <p>Gain Reduction Factors applied when room temp is within the deadband zone.</p>
                  <p>Often set to 0 for Ki to prevent integral windup.</p>
                </InfoTooltip>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <SliderPair
                  id="export-ki-mult"
                  label="Ki Multiplier"
                  min={0}
                  max={1}
                  step={0.0001}
                  value={pid.deadbandKiMultiplier}
                  onChange={(v) => setPidParam('deadbandKiMultiplier', v)}
                />
                <SliderPair
                  id="export-kd-mult"
                  label="Kd Multiplier"
                  min={0}
                  max={1}
                  step={0.05}
                  value={pid.deadbandKdMultiplier}
                  onChange={(v) => setPidParam('deadbandKdMultiplier', v)}
                />
              </div>
            </section>

            <Separator className="my-6" />

            {/* Export Options Section */}
            <section className="space-y-4 pb-6">
              <h4 className="text-sm font-semibold text-foreground">Export Options</h4>

              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <span className="text-sm text-foreground">Diagnostic Sensors</span>
                  <p className="text-xs text-muted-foreground">Include additional sensors in YAML</p>
                </div>
                <Switch
                  checked={includeSensors}
                  onCheckedChange={setIncludeSensors}
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <span className="text-sm text-foreground">Runtime Tuning</span>
                  <p className="text-xs text-muted-foreground">Add number inputs for live adjustment</p>
                </div>
                <Switch
                  checked={includeNumbers}
                  onCheckedChange={setIncludeNumbers}
                />
              </div>
            </section>
          </ScrollArea>

          <SheetFooter className="px-6 py-4 border-t border-border bg-card/50">
            <Button
              className="w-full gap-2"
              onClick={() => setShowYaml(true)}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Preview YAML
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <YAMLModal
        isOpen={showYaml}
        onClose={() => setShowYaml(false)}
        includeSensors={includeSensors}
        includeNumbers={includeNumbers}
      />
    </>
  );
}
