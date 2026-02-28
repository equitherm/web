// src/components/Modals/SaveModal.tsx
import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { saveConfig, loadAllConfigs, loadConfig, deleteConfig } from '../../config/storage';
import type { SavedConfig } from '../../types';
import { showToast } from '../Toast/Toast';
import styles from './Modal.module.css';

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SaveModal({ isOpen, onClose }: SaveModalProps) {
  const [name, setName] = useState('');
  const [configs, setConfigs] = useState<SavedConfig[]>([]);
  const [confirmOverwrite, setConfirmOverwrite] = useState<string | null>(null);
  const curve = useStore(s => s.curve);
  const pid = useStore(s => s.pid);
  const ui = useStore(s => s.ui);
  const loadConfigToStore = useStore(s => s.loadConfig);

  // Refresh configs list when modal opens
  useEffect(() => {
    if (isOpen) {
      setConfigs(loadAllConfigs());
      setConfirmOverwrite(null);
    }
  }, [isOpen]);

  const doSave = (configName: string) => {
    saveConfig(configName, { curve, pid, ui });
    setConfigs(loadAllConfigs());
    showToast(`Config saved: ${configName}`, 'success');
    setName('');
    setConfirmOverwrite(null);
  };

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    // Check if config already exists
    const exists = configs.some(c => c.name === trimmedName);
    if (exists) {
      setConfirmOverwrite(trimmedName);
    } else {
      doSave(trimmedName);
    }
  };

  const handleConfirmOverwrite = () => {
    if (confirmOverwrite) doSave(confirmOverwrite);
  };

  const handleLoad = (configName: string) => {
    const data = loadConfig(configName);
    if (data) {
      loadConfigToStore(data);
      showToast(`Config loaded: ${configName}`, 'success');
      onClose();
    }
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>, configName: string) => {
    e.stopPropagation();
    deleteConfig(configName);
    setConfigs(loadAllConfigs());
    showToast('Config deleted', 'success');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h3 className={styles.title}>Save Configuration</h3>

        {confirmOverwrite ? (
          <>
            <p className={styles.confirmText}>
              Overwrite "<strong>{confirmOverwrite}</strong>"?
            </p>
            <div className={styles.actions}>
              <button className={styles.cancelBtn} onClick={() => setConfirmOverwrite(null)}>
                Cancel
              </button>
              <button className={styles.deleteBtn} onClick={handleConfirmOverwrite}>
                Overwrite
              </button>
            </div>
          </>
        ) : (
          <>
            <input
              type="text"
              className={styles.input}
              placeholder="Configuration name..."
              value={name}
              onChange={e => setName((e.target as HTMLInputElement).value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <div className={styles.actions}>
              <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
              <button className={styles.saveBtn} onClick={handleSave}>Save</button>
            </div>
          </>
        )}

        {/* Saved configs list */}
        {configs.length > 0 && (
          <div className={styles.configList}>
            <div className={styles.configListHeader}>Saved Configs</div>
            {configs.map(c => (
              <div
                key={c.name}
                className={styles.configItem}
                onClick={() => handleLoad(c.name)}
              >
                <span className={styles.configName}>{c.name}</span>
                <span className={styles.configDate}>
                  {new Date(c.timestamp).toLocaleDateString()}
                </span>
                <button
                  className={styles.configDelete}
                  onClick={e => handleDelete(e, c.name)}
                  title="Delete"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
