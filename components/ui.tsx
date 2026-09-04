import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-brand">
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  center = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow ? (
        <div className={center ? "flex justify-center" : ""}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
      ) : null}
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {body ? (
        <p className="mt-4 text-lg leading-8 text-slate-300/90">{body}</p>
      ) : null}
    </div>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  // external links open in a new tab
  external?: boolean;
  // fire-and-forget side effect on click (e.g. an analytics event); does not block navigation
  onClick?: () => void;
};

const variants = {
  primary:
    "bg-brand text-ink hover:bg-white shadow-[0_8px_30px_-8px_rgba(56,189,248,0.6)]",
  secondary:
    "border border-white/15 bg-white/5 text-white hover:bg-white/10 hover:border-white/25",
  ghost: "text-white/80 hover:text-white",
} as const;

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  external = false,
  onClick,
}: ButtonProps) {
  const cls = `inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-all duration-200 ${variants[variant]} ${className}`;
  if (external || href.startsWith("http")) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} onClick={onClick}>
      {children}
    </Link>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-colors hover:border-white/20 ${className}`}
    >
      {children}
    </div>
  );
}

// ── One standard loader for the whole site ────────────────────────────────
// `tone="light"` → white spinner for dark surfaces (the app); `tone="dark"` → slate spinner for the
// white Stripe surfaces. Use <Spinner> inline (buttons, rows) and <Loader> to fill an area.
export function Spinner({
  label,
  tone = "light",
  size = "md",
  className = "",
}: {
  label?: string;
  tone?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dim = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-8 w-8" : "h-5 w-5";
  const ring =
    tone === "dark"
      ? "border-slate-300 border-t-slate-600"
      : "border-white/20 border-t-white/80";
  const text = tone === "dark" ? "text-slate-500" : "text-slate-300";
  return (
    <span className={`inline-flex items-center gap-2.5 text-sm ${text} ${className}`}>
      <span
        aria-hidden
        className={`shrink-0 animate-spin rounded-full border-2 ${dim} ${ring}`}
      />
      {label ? <span>{label}</span> : null}
    </span>
  );
}

// Centers a Spinner in a min-height block — the standard "loading a whole view" state.
export function Loader({
  label,
  tone = "light",
  className = "",
  minH = "min-h-[200px]",
}: {
  label?: string;
  tone?: "light" | "dark";
  className?: string;
  minH?: string;
}) {
  return (
    <div className={`flex items-center justify-center ${minH} ${className}`}>
      <Spinner label={label} tone={tone} />
    </div>
  );
}
