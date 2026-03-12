// src/components/AppShell/Footer.tsx
import { Github, ExternalLink, Flame, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const REPO_URL = 'https://github.com/P4uLT/equitherm-studio';
const ESPHOME_DOCS = 'https://esphome.io/components/climate/equitherm/';
const ESPHOME_WEB = 'https://esphome.io/';

interface FooterLinkProps {
  href: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  external?: boolean;
  'aria-label'?: string;
}

function FooterLink({ href, icon, children, external, 'aria-label': ariaLabel }: FooterLinkProps) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      aria-label={ariaLabel}
      className={cn(
        'inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground',
        'transition-colors duration-200 hover:underline underline-offset-4'
      )}
    >
      {icon}
      {children}
      {external && <ExternalLink className="w-2.5 h-2.5 opacity-50" />}
    </a>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto pt-6 pb-2">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-1">
        {/* Left: Built for ESPHome */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="opacity-70">Built for</span>
          <a
            href={ESPHOME_WEB}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ESPHome website (opens in new tab)"
            className="inline-flex items-center gap-1 hover:text-accent transition-colors"
          >
            <Flame className="w-3 h-3 text-accent/80" />
            <span className="font-medium">ESPHome</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-40" />
          </a>
          <span className="inline-flex items-center gap-1.5 text-muted-foreground/80" title="All calculations run in your browser">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Runs locally</span>
          </span>
        </div>

        {/* Center: Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <FooterLink href={REPO_URL} icon={<Github className="w-3 h-3" />} external aria-label="GitHub repository (opens in new tab)">
            GitHub
          </FooterLink>
          <FooterLink href={ESPHOME_DOCS} external aria-label="ESPHome equitherm documentation (opens in new tab)">
            Documentation
          </FooterLink>
        </div>

        {/* Right: Version & License */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground/60">
          <span className="font-mono">v{__APP_VERSION__}</span>
          <span className="opacity-30">·</span>
          <a
            href={`${REPO_URL}/blob/main/LICENSE`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="MIT License (opens in new tab)"
            className="hover:text-muted-foreground transition-colors"
          >
            MIT
          </a>
        </div>
      </div>
    </footer>
  );
}
