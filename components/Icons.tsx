import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

export function ShieldIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function BoltIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M13 3L4 14h6l-1 7 9-11h-6l1-7z" />
    </svg>
  );
}

export function LockIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </svg>
  );
}

export function EyeOffIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M3 3l18 18" />
      <path d="M10.6 5.2A9 9 0 0121 12c-.5 1-1.2 2-2 2.8M6.3 6.3A9 9 0 003 12c1.6 3.2 5 6 9 6 1.3 0 2.6-.3 3.7-.8" />
      <path d="M9.9 9.9a3 3 0 004.2 4.2" />
    </svg>
  );
}

export function GlobeIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.4 2.5 15.6 0 18M12 3c-2.5 2.4-2.5 15.6 0 18" />
    </svg>
  );
}

export function DevicesIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <rect x="2" y="5" width="14" height="10" rx="1.5" />
      <path d="M2 18h14" />
      <rect x="17" y="9" width="5" height="11" rx="1.2" />
    </svg>
  );
}

export function ServerIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <rect x="4" y="4" width="16" height="6" rx="1.5" />
      <rect x="4" y="14" width="16" height="6" rx="1.5" />
      <path d="M8 7h.01M8 17h.01" />
    </svg>
  );
}

export function PlayIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M10 9l5 3-5 3V9z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SplitIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M4 7h4l3 5m9-5h-4l-3 5m0 0l-3 5H4m16 0h-4l-3-5" />
      <circle cx="20" cy="7" r="1.4" />
      <circle cx="20" cy="17" r="1.4" />
      <circle cx="4" cy="12" r="1.4" />
    </svg>
  );
}

export function CheckIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M5 12l4 4 10-10" />
    </svg>
  );
}

export function SparkleIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
    </svg>
  );
}

export function MenuIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function AppleIcon(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
      <path d="M16.4 12.8c0-2.2 1.8-3.3 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.4 0-2.8.8-3.5 2.1-1.5 2.6-.4 6.4 1.1 8.5.7 1 1.5 2.2 2.6 2.1 1-.04 1.4-.7 2.7-.7 1.2 0 1.6.7 2.7.6 1.1-.02 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.4-.02-.01-2.1-.8-2.1-3.2zM14.3 6.3c.6-.7 1-1.7.9-2.7-.9.04-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6 1 .08 1.9-.5 2.5-1.2z" />
    </svg>
  );
}

export function AndroidIcon(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
      <path d="M6 9h12v8a1 1 0 01-1 1h-1v3a1 1 0 11-2 0v-3h-2v3a1 1 0 11-2 0v-3H9a1 1 0 01-1-1V9h-2zM4 9.5a1 1 0 112 0v5a1 1 0 11-2 0v-5zM18 9.5a1 1 0 112 0v5a1 1 0 11-2 0v-5zM8.3 7.5C8.3 5 10 3.3 12 3.3S15.7 5 15.7 7.5H8.3zm1.7-2.2a.6.6 0 100-1.2.6.6 0 000 1.2zm4 0a.6.6 0 100-1.2.6.6 0 000 1.2z" />
    </svg>
  );
}

export function TvIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

export const iconMap = {
  shield: ShieldIcon,
  bolt: BoltIcon,
  lock: LockIcon,
  eyeOff: EyeOffIcon,
  globe: GlobeIcon,
  devices: DevicesIcon,
  server: ServerIcon,
  play: PlayIcon,
  split: SplitIcon,
  check: CheckIcon,
  sparkle: SparkleIcon,
  apple: AppleIcon,
  android: AndroidIcon,
  tv: TvIcon,
} as const;

export type IconName = keyof typeof iconMap;
