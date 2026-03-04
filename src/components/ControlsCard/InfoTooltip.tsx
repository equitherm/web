// src/components/ControlsCard/InfoTooltip.tsx
import { useState, useEffect, useCallback } from 'react';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  MOBILE_BREAKPOINT,
  ANIMATION_DELAY,
} from './InfoTooltip.constants';

interface InfoTooltipProps {
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  position?: 'sideLeft';
  size?: 'small';
}

export function InfoTooltip({ title, children, icon, position, size }: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle open state changes from the Tooltip component
  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  // Handle click for mobile/touch
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (isMobile) {
      e.preventDefault();
      e.stopPropagation();
      setIsOpen((prev) => !prev);
    }
  }, [isMobile]);

  // Handle hover for desktop
  const handleMouseEnter = useCallback(() => {
    if (!isMobile) setIsOpen(true);
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    if (!isMobile) setIsOpen(false);
  }, [isMobile]);

  // Close on outside click (mobile)
  useEffect(() => {
    if (!isOpen || !isMobile) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-info-tooltip]')) {
        setIsOpen(false);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleOutsideClick);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen, isMobile]);

  const isSmall = size === 'small';
  const isSideLeft = position === 'sideLeft';

  return (
    <Tooltip open={isOpen} onOpenChange={handleOpenChange} delayDuration={ANIMATION_DELAY}>
      <TooltipTrigger asChild>
        <span
          data-info-tooltip
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={cn(
            'inline-flex items-center justify-center rounded-full cursor-help transition-all duration-150 shrink-0 align-middle bg-border text-muted-foreground',
            'hover:bg-primary hover:text-background hover:scale-[1.15]',
            isOpen && 'bg-primary text-background',
            isSmall ? 'w-4 h-4 ml-0.5' : 'w-7 h-7 ml-1.5'
          )}
        >
          <Info className={cn(isSmall ? 'w-2 h-2' : 'w-2.5 h-2.5', 'stroke-[2.5]')} />
        </span>
      </TooltipTrigger>
      <TooltipContent
        side={isSideLeft ? 'left' : 'top'}
        align="center"
        sideOffset={12}
        className={cn(
          'p-3.5 w-[17.5rem] rounded-lg border border-border bg-card text-secondary-foreground shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.03)_inset] max-w-[min(280px,calc(100vw-32px))]',
          '[&>svg]:hidden',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=top]:slide-in-from-bottom-2 data-[side=left]:slide-in-from-right-2'
        )}
      >
        {/* Header with icon and title */}
        {(icon || title) && (
          <div className="flex items-center gap-2 mb-2.5 pb-2.5 border-b border-border">
            {icon && <div className="w-6 h-6 flex items-center justify-center bg-primary/12 rounded-md text-primary shrink-0 dark:bg-primary/25 [&>svg]:w-3.5 [&>svg]:h-3.5">{icon}</div>}
            {title && <span className="text-[13px] font-semibold text-foreground tracking-wide">{title}</span>}
          </div>
        )}

        {/* Body content */}
        <div className="text-xs leading-relaxed text-secondary-foreground [&_p]:m-0 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_strong]:text-primary [&_strong]:font-medium [&_code]:bg-secondary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[11px] [&_code]:text-[var(--accent-secondary)] [&_code]:font-mono">{children}</div>
      </TooltipContent>
    </Tooltip>
  );
}
