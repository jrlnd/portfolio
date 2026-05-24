import { useEffect, useRef, useState } from "react";

interface Props {
  className?: string;
}

export default function JasperButton({ className = "" }: Props) {
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
    <div ref={containerRef} className={`group/jasper relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="About JASPER"
        aria-expanded={open}
        aria-haspopup="dialog"
        className="squircle inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent transition-colors hover:bg-accent/10 md:text-xs"
      >
        <BotIcon />
        JASPER
      </button>

      {!open && (
        <div
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-0 z-20 mb-2 hidden whitespace-nowrap rounded-md border-2 border-retro-ink bg-bg px-2 py-1 text-xs text-fg opacity-0 shadow-[3px_3px_0_var(--color-retro-ink)] transition-opacity duration-150 group-hover/jasper:block group-hover/jasper:opacity-100"
        >
          JR's Adaptive System for Portfolio Engineering &amp; Reasoning
        </div>
      )}

      {open && (
        <div
          role="dialog"
          aria-label="About JASPER"
          className="squircle absolute bottom-full left-0 z-30 mb-2 w-72 animate-pop-in rounded-xl border-2 border-retro-ink bg-bg p-4 shadow-[3px_3px_0_var(--color-retro-ink)]"
        >
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-accent">
            <BotIcon />
            JASPER
          </div>
          <p className="text-xs leading-relaxed text-muted">
            <span className="font-semibold text-fg">J</span>R's{" "}
            <span className="font-semibold text-fg">A</span>daptive{" "}
            <span className="font-semibold text-fg">S</span>ystem for{" "}
            <span className="font-semibold text-fg">P</span>ortfolio{" "}
            <span className="font-semibold text-fg">E</span>ngineering &amp;{" "}
            <span className="font-semibold text-fg">R</span>easoning.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-fg">
            A portfolio assistant briefed on JR's bio, experience, and projects.
            Powered by Google's Gemini 2.5 Flash with a custom system prompt.
          </p>
        </div>
      )}
    </div>
  );
}

function BotIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-3.5 w-3.5"
    >
      <path d="M8.5 10A1.5 2 0 1 0 8.5 14 1.5 2 0 1 0 8.5 10z" />
      <path d="M15.5 10A1.5 2 0 1 0 15.5 14 1.5 2 0 1 0 15.5 10z" />
      <path d="M8 16H16V18H8z" />
      <path d="m21,11v-3c0-1.1-.9-2-2-2h-6v-1.39c.3-.27.5-.67.5-1.11,0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5,1.5c0,.44.2.84.5,1.11v1.39h-6c-1.1,0-2,.9-2,2v3c-.55,0-1,.45-1,1v4c0,.55.45,1,1,1v3c0,1.1.9,2,2,2h14c1.1,0,2-.9,2-2v-3c.55,0,1-.45,1-1v-4c0-.55-.45-1-1-1ZM5,20v-12h14v4s0,0,0,0v4s0,0,0,0v4s-14,0-14,0Z" />
    </svg>
  );
}
