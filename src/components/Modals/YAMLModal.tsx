// src/components/Modals/YAMLModal.tsx
import { useState, useEffect, useMemo } from 'react';
import hljs from 'highlight.js/lib/core';
import yaml from 'highlight.js/lib/languages/yaml';
import { useStore } from '../../store/useStore';
import { generateYAML } from '../../config/yaml';
import { showToast } from '../Toast/Toast';
import styles from './Modal.module.css';

// Register YAML language
hljs.registerLanguage('yaml', yaml);

// SVG Icons
const LayersIcon = () => (
  <svg className={styles.yamlIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
    <path d="M2 17l10 5 10-5"/>
    <path d="M2 12l10 5 10-5"/>
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

interface YAMLModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function YAMLModal({ isOpen, onClose }: YAMLModalProps) {
  const curve = useStore(s => s.curve);
  const pid = useStore(s => s.pid);
  const [includeSensors, setIncludeSensors] = useState(false);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [copied, setCopied] = useState(false);

  // Map store state to YAML generator params
  const yamlParams = useMemo(() => ({
    t: curve.tTarget,
    hc: curve.hc,
    n: curve.n,
    s: curve.shift,
    min: curve.minFlow,
    max: curve.maxFlow,
    pid: pid.enabled,
    kp: pid.kp,
    ki: pid.ki,
    kd: pid.kd,
    db: pid.deadbandEnabled,
    tl: pid.deadbandThresholdLow,
    th: pid.deadbandThresholdHigh,
    kpm: pid.deadbandKpMultiplier,
    kim: pid.deadbandKiMultiplier,
    kdm: pid.deadbandKdMultiplier,
  }), [curve, pid]);

  const rawYaml = useMemo(() => generateYAML(yamlParams, { includeSensors, includeNumbers }), [yamlParams, includeSensors, includeNumbers]);

  // Syntax highlighted YAML using highlight.js
  const highlightedYaml = useMemo(() => {
    return hljs.highlight(rawYaml, { language: 'yaml' }).value;
  }, [rawYaml]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawYaml);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') onClose();
  };

  useEffect(() => {
    if (isOpen) setCopied(false);
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const lineCount = rawYaml.split('\n').length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1).join('\n');

  return (
    <div className={styles.overlay} onClick={onClose} onKeyDown={handleKeyDown}>
      <div className={styles.yamlEditor} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.yamlHeader}>
          <div className={styles.yamlTab}>
            <LayersIcon />
            <span className={styles.yamlFilename}>equitherm.yaml</span>
          </div>
          <button className={styles.yamlClose} onClick={onClose} title="Close">
            <CloseIcon />
          </button>
        </div>

        {/* Options Bar */}
        <div className={styles.yamlOptions}>
          <label className={styles.yamlOption}>
            <input type="checkbox" checked={includeSensors} onChange={e => setIncludeSensors((e.target as HTMLInputElement).checked)} />
            <span>Diagnostic sensors</span>
          </label>
          <label className={styles.yamlOption}>
            <input type="checkbox" checked={includeNumbers} onChange={e => setIncludeNumbers((e.target as HTMLInputElement).checked)} />
            <span>Runtime tuning</span>
          </label>
        </div>

        {/* Code Area */}
        <div className={styles.yamlCodeWrapper}>
          <div className={styles.yamlLineNumbers}>{lineNumbers}</div>
          <pre className={styles.yamlCode}>
            <code className="language-yaml hljs" dangerouslySetInnerHTML={{ __html: highlightedYaml }} />
          </pre>
        </div>

        {/* Status Bar */}
        <div className={styles.yamlStatusbar}>
          <div className={styles.yamlStatusLeft}>
            <a
              href="https://esphome.io/components/climate/equitherm.html"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.yamlDocsLink}
            >
              <BookIcon />
              Docs
            </a>
            <span className={styles.yamlSeparator}>|</span>
            <span>YAML</span>
            <span className={styles.yamlSeparator}>|</span>
            <span>{lineCount} lines</span>
          </div>
          <button className={`${styles.yamlCopyBtn} ${copied ? styles.copied : ''}`} onClick={handleCopy}>
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}
