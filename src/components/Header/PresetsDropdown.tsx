// src/components/Header/PresetsDropdown.tsx
import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { loadAllConfigs, loadConfig, saveConfig, deleteConfig } from '../../config/storage';
import type { SavedConfig } from '../../types';
import { showToast } from '@/lib/toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Save, ChevronDown, Trash2, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PresetsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [configs, setConfigs] = useState<SavedConfig[]>([]);
  const [saveName, setSaveName] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [overwriteDialogOpen, setOverwriteDialogOpen] = useState(false);
  const [pendingOverwriteName, setPendingOverwriteName] = useState<string | null>(null);

  const curve = useStore(s => s.curve);
  const pid = useStore(s => s.pid);
  const ui = useStore(s => s.ui);
  const loadConfigToStore = useStore(s => s.loadConfig);

  // Load configs on open
  useEffect(() => {
    if (isOpen) {
      setConfigs(loadAllConfigs());
      setSaveName('');
      setConfirmDelete(null);
    }
  }, [isOpen]);

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

  const handleConfirmOverwrite = () => {
    if (pendingOverwriteName) doSave(pendingOverwriteName);
  };

  const handleLoad = (configName: string) => {
    const data = loadConfig(configName);
    if (data) {
      loadConfigToStore(data);
      showToast(`Loaded: ${configName}`, 'success');
      setIsOpen(false);
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
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'h-7 gap-1.5 px-2 text-xs text-muted-foreground border-border',
              'hover:text-foreground hover:border-primary hover:bg-secondary/80',
              isOpen && 'border-primary text-primary'
            )}
            data-state={isOpen ? 'open' : 'closed'}
          >
            <Save className="h-3 w-3" />
            <span>Presets</span>
            <ChevronDown className={cn('h-2.5 w-2.5 transition-transform duration-150', isOpen && 'rotate-180')} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-60 p-2">
          {/* Save section */}
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="New preset name..."
              value={saveName}
              onChange={e => setSaveName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-8 text-sm"
            />
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!saveName.trim()}
              className="h-8 px-3 shrink-0"
            >
              Save
            </Button>
          </div>

          {/* Saved configs */}
          {configs.length > 0 && (
            <>
              <DropdownMenuSeparator className="my-1.5" />
              <DropdownMenuGroup className="max-h-52 overflow-y-auto -mx-1 px-1">
                {configs.map(c => (
                  <div
                    key={c.name}
                    className={cn(
                      'group flex items-center gap-1 rounded-sm px-2 py-1.5 text-sm transition-colors',
                      confirmDelete === c.name && 'bg-destructive/10'
                    )}
                  >
                    <DropdownMenuItem
                      className={cn(
                        'flex-1 cursor-pointer gap-2 px-2 py-1 focus:bg-accent focus:text-accent-foreground',
                        confirmDelete === c.name && 'text-destructive'
                      )}
                      onClick={() => handleLoad(c.name)}
                    >
                      <FolderOpen className="h-3 w-3 shrink-0 opacity-50" />
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap flex-1">{c.name}</span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {new Date(c.timestamp).toLocaleDateString()}
                      </span>
                    </DropdownMenuItem>
                    {confirmDelete === c.name ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleDelete(c.name)}
                        title="Confirm delete"
                      >
                        <span className="text-xs">✓</span>
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive focus:opacity-100 group-hover:opacity-100"
                        onClick={() => setConfirmDelete(c.name)}
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </DropdownMenuGroup>
            </>
          )}

          {/* Empty state */}
          {configs.length === 0 && (
            <div className="py-3 text-center text-xs text-muted-foreground">No saved presets</div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

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
            <Button variant="destructive" onClick={handleConfirmOverwrite}>
              Overwrite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
