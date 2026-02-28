// src/components/Header/PresetsDropdown.tsx
import { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { loadAllConfigs, loadConfig, saveConfig, deleteConfig } from '../../config/storage';
import type { SavedConfig } from '../../types';
import { showToast } from '../Toast/Toast';
import styles from './PresetsDropdown.module.css';

export function PresetsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [configs, setConfigs] = useState<SavedConfig[]>([]);
  const [saveName, setSaveName] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmOverwrite, setConfirmOverwrite] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      setConfirmOverwrite(null);
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const doSave = (name: string) => {
    saveConfig(name, { curve, pid, ui });
    setConfigs(loadAllConfigs());
    setSaveName('');
    setConfirmOverwrite(null);
    showToast(`Saved: ${name}`, 'success');
  };

  const handleSave = () => {
    const name = saveName.trim();
    if (!name) return;

    const exists = configs.some(c => c.name === name);
    if (exists) {
      setConfirmOverwrite(name);
    } else {
      doSave(name);
    }
  };

  const handleConfirmOverwrite = () => {
    if (confirmOverwrite) doSave(confirmOverwrite);
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
    if (confirmDelete === configName) {
      deleteConfig(configName);
      setConfigs(loadAllConfigs());
      setConfirmDelete(null);
      showToast('Deleted', 'success');
    } else {
      setConfirmDelete(configName);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSave();
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        className={`${styles.trigger} ${isOpen ? styles.open : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Save and load presets"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
          <polyline points="17,21 17,13 7,13 7,21"/>
          <polyline points="7,3 7,8 15,8"/>
        </svg>
        <span>Presets</span>
        <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6,9 12,15 18,9"/>
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {/* Save section or overwrite confirmation */}
          {confirmOverwrite ? (
            <div className={styles.confirmOverwrite}>
              <span className={styles.confirmText}>
                Overwrite "<strong>{confirmOverwrite}</strong>"?
              </span>
              <div className={styles.confirmActions}>
                <button className={styles.cancelBtn} onClick={() => setConfirmOverwrite(null)}>
                  Cancel
                </button>
                <button className={styles.overwriteBtn} onClick={handleConfirmOverwrite}>
                  Overwrite
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.saveSection}>
              <input
                type="text"
                className={styles.saveInput}
                placeholder="New preset name..."
                value={saveName}
                onChange={e => setSaveName((e.target as HTMLInputElement).value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              <button
                className={styles.saveBtn}
                onClick={handleSave}
                disabled={!saveName.trim()}
              >
                Save
              </button>
            </div>
          )}

          {/* Divider */}
          {configs.length > 0 && <div className={styles.divider} />}

          {/* Saved configs */}
          {configs.length > 0 && (
            <div className={styles.configList}>
              {configs.map(c => (
                <div
                  key={c.name}
                  className={`${styles.configItem} ${confirmDelete === c.name ? styles.confirming : ''}`}
                >
                  <button
                    className={styles.configName}
                    onClick={() => handleLoad(c.name)}
                  >
                    {c.name}
                  </button>
                  <span className={styles.configDate}>
                    {new Date(c.timestamp).toLocaleDateString()}
                  </span>
                  <button
                    className={`${styles.deleteBtn} ${confirmDelete === c.name ? styles.confirm : ''}`}
                    onClick={() => handleDelete(c.name)}
                    title={confirmDelete === c.name ? 'Click to confirm' : 'Delete'}
                  >
                    {confirmDelete === c.name ? '✓' : '×'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {configs.length === 0 && (
            <div className={styles.empty}>No saved presets</div>
          )}
        </div>
      )}
    </div>
  );
}
