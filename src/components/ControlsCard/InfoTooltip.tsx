// src/components/ControlsCard/InfoTooltip.tsx
import { useState, useEffect, useRef } from 'react';
import styles from './InfoTooltip.module.css';

interface InfoTooltipProps {
  title?: string;
     children: React.ReactNode;
  icon?: React.ReactNode;
  position?: 'sideLeft';
  size?: 'small';
}

export function InfoTooltip({ title, children, icon, position, size }: InfoTooltipProps) {
  const [visible, setVisible] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);

  // Click outside to close
  useEffect(() => {
    if (!visible) return;

    const handleClickOutside = (e: globalThis.MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setVisible(false);
      }
    };

    // Delay to avoid immediate close from the same click that opened it
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [visible]);

  const handleMouseEnter = () => {
    if (window.innerWidth > 768) {
      setVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth > 768) {
      setVisible(false);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setVisible(v => !v);
  };

  const triggerClasses = [
    styles.trigger,
    visible && styles.active,
    size === 'small' && styles.triggerSmall,
  ].filter(Boolean).join(' ');

  const tooltipClasses = [
    styles.tooltip,
    visible && styles.visible,
    position === 'sideLeft' && styles.posSideLeft,
  ].filter(Boolean).join(' ');

  return (
    <span
      ref={triggerRef}
      className={triggerClasses}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 16v-4M12 8h.01"/>
      </svg>
      <div className={tooltipClasses}>
        <div className={styles.header}>
          {icon && <div className={styles.icon}>{icon}</div>}
          <span className={styles.title}>{title}</span>
        </div>
        <div className={styles.body}>
          {children}
        </div>
      </div>
    </span>
  );
}
