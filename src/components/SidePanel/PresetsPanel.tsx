// src/components/SidePanel/PresetsPanel.tsx
import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { loadAllConfigs, loadConfig, saveConfig, deleteConfig } from '@/config/storage';
import type { SavedConfig } from '@/types';
import { showToast } from '@/lib/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Save, Trash2, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PresetsPanel() {
  const [configs, setConfigs] = useState<SavedConfig[]>([]);
  const [saveName, setSaveName] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [overwriteDialogOpen, setOverwriteDialogOpen] = useState(false);
  const [pendingOverwriteName, setPendingOverwriteName] = useState<string | null>(null);

  const curve = useStore(s => s.curve);
  const pid = useStore(s => s.pid);
  const ui = useStore(s => s.ui);
  const loadConfigToStore = useStore(s => s.loadConfig);

  useEffect(() => {
    setConfigs(loadAllConfigs());
  }, []);

  const doSave = (name: string) => {
    saveConfig(name, { curve, pid, ui });
    setConfigs(loadAllConfigs());
    setSaveName('');
    setOverwriteDialogOpen(false);
    setPendingOverwriteName(null);
    showToast(`Saved: ${name}`, 'success');
  };

  const handleSave = () => {
    const name = saveName.trim();
    if (!name) return;
    const exists = configs.some(c => c.name === name);
    if (exists) {
      setPendingOverwriteName(name);
      setOverwriteDialogOpen(true);
    } else {
      doSave(name);
    }
  };

  const handleLoad = (configName: string) => {
    const data = loadConfig(configName);
    if (data) {
      loadConfigToStore(data);
      showToast(`Loaded: ${configName}`, 'success');
    }
  };

  const handleDelete = (configName: string) => {
    deleteConfig(configName);
    setConfigs(loadAllConfigs());
    setConfirmDelete(null);
    showToast('Deleted', 'success');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSave();
  };

  return (
    <>
      <div className="p-4 flex flex-col gap-3">
        {/* Save section */}
        <div>
          <span className="block text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
            Save Current
          </span>
          <div className="flex gap-2">
            <Input
              placeholder="Preset name..."
              value={saveName}
              onChange={e => setSaveName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-10 text-sm"
            />
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!saveName.trim()}
              className="h-10 px-4 shrink-0 gap-1.5"
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>

        {/* Saved configs */}
        {configs.length > 0 && (
          <div>
            <span className="block text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
              Saved Presets
            </span>
            <div className="flex flex-col gap-1">
              {configs.map(c => (
                <div
                  key={c.name}
                  className={cn(
                    'group flex items-center gap-1 rounded-md px-2 py-2 text-sm transition-colors hover:bg-secondary min-h-touch',
                    confirmDelete === c.name && 'bg-destructive/10'
                  )}
                >
                  <button
                    className={cn(
                      'flex-1 flex items-center gap-2 text-left cursor-pointer min-w-0 min-h-touch',
                      confirmDelete === c.name && 'text-destructive'
                    )}
                    onClick={() => handleLoad(c.name)}
                  >
                    <FolderOpen className="h-4 w-4 shrink-0 opacity-50" />
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap flex-1 text-sm">
                      {c.name}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {new Date(c.timestamp).toLocaleDateString()}
                    </span>
                  </button>
                  {confirmDelete === c.name ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-9 w-9 p-0 shrink-0"
                      onClick={() => handleDelete(c.name)}
                      title="Confirm delete"
                    >
                      <span className="text-xs">✓</span>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0 shrink-0 opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive focus:opacity-100 group-hover:opacity-100"
                      onClick={() => setConfirmDelete(c.name)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {configs.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">No saved presets</p>
        )}
      </div>

      {/* Overwrite confirmation dialog */}
      <Dialog open={overwriteDialogOpen} onOpenChange={setOverwriteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Overwrite Preset?</DialogTitle>
            <DialogDescription>
              A preset named "<strong className="text-foreground">{pendingOverwriteName}</strong>" already exists.
              Do you want to overwrite it?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setOverwriteDialogOpen(false);
                setPendingOverwriteName(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => pendingOverwriteName && doSave(pendingOverwriteName)}>
              Overwrite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
