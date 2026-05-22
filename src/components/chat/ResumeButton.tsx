import { useEffect, useRef, useState } from "react";
import { profile } from "../../content/profile";

const RESUME_URL = profile.links.resume;
const DOWNLOAD_NAME = "JR-Gaoat-Resume.pdf";

interface Props {
  className?: string;
  triggerClassName?: string;
  triggerContent?: React.ReactNode;
  triggerAriaLabel?: string;
}

export default function ResumeButton({
  className = "",
  triggerClassName,
  triggerContent,
  triggerAriaLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("mousedown", handleClick);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={triggerAriaLabel ?? "Resume options"}
        aria-haspopup="menu"
        aria-expanded={open}
        className={
          triggerClassName ??
          "squircle inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-muted transition-colors hover:bg-subtle hover:text-fg"
        }
      >
        {triggerContent ?? (
          <>
            <DocIcon />
            Resume
          </>
        )}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Resume options"
          className="squircle absolute bottom-full left-1/2 z-30 mb-2 flex -translate-x-1/2 animate-pop-in items-stretch gap-1 rounded-xl border-2 border-retro-ink bg-bg p-1.5 shadow-[3px_3px_0_var(--color-retro-ink)]"
        >
          <ItemLink
            href={RESUME_URL}
            external
            icon={<EyeIcon />}
            label="Preview"
          />
          <ItemLink
            href={RESUME_URL}
            download={DOWNLOAD_NAME}
            icon={<DownloadIcon />}
            label="Download"
          />
        </div>
      )}
    </div>
  );
}

interface ItemProps {
  icon: React.ReactNode;
  label: string;
}

const itemClass =
  "squircle flex w-16 flex-col items-center justify-center gap-1 rounded-md px-2 py-2 text-[10px] font-medium uppercase tracking-wide text-fg no-underline transition-colors hover:bg-subtle";

function ItemLink({
  href,
  external,
  download,
  icon,
  label,
}: ItemProps & { href: string; external?: boolean; download?: string }) {
  return (
    <a
      role="menuitem"
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      download={download}
      className={itemClass}
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}

function DocIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5 shrink-0"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
