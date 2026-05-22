import { useEffect, useRef, useState } from "react";

type Theme = "light" | "dark" | "auto";

function getInitialTheme(): Theme {
  if (typeof localStorage === "undefined") return "auto";
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return "auto";
}

function systemPrefersDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolveDark(theme: Theme): boolean {
  if (theme === "dark") return true;
  if (theme === "light") return false;
  return systemPrefersDark();
}

const THEMES: readonly Theme[] = ["light", "dark", "auto"];

const LABEL: Record<Theme, string> = {
  light: "Light",
  dark: "Dark",
  auto: "Auto",
};

// rem dimensions used to position the popover so its selected option sits
// directly on top of the trigger. Kept here so they stay in sync with the
// classNames below (h-9 w-9 / p-1 / gap-1). Border is the only fixed-px piece.
// Using rem (not px) keeps positioning correct regardless of the root font-size
// — this project sets html to 112.5%, so 1rem = 18px, not 16px.
const BUTTON_REM = 2.25; // h-9 w-9
const GAP_REM = 0.25; // gap-1
const PAD_REM = 0.25; // p-1
const STEP_REM = BUTTON_REM + GAP_REM;

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function AutoIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

const ICON: Record<Theme, () => React.JSX.Element> = {
  light: SunIcon,
  dark: MoonIcon,
  auto: AutoIcon,
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Apply the resolved class and persist the user's pick. `auto` is stored as
  // "no value" so the inline theme script in BaseLayout falls back to the
  // system preference on first paint.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolveDark(theme));
    if (theme === "auto") {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  // While in auto mode, react live to the user flipping their OS theme.
  useEffect(() => {
    if (theme !== "auto") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    function handler(e: MediaQueryListEvent) {
      document.documentElement.classList.toggle("dark", e.matches);
    }
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  // Close picker on outside click / Escape.
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

  function selectTheme(t: Theme) {
    setTheme(t);
    setOpen(false);
  }

  // Align popover so the currently-selected option overlaps the trigger.
  const idx = THEMES.indexOf(theme);
  const popoverLeft = `calc(-1px - ${PAD_REM}rem - ${idx * STEP_REM}rem)`;
  const popoverTop = `calc(-1px - ${PAD_REM}rem)`;
  const originX = `calc(1px + ${PAD_REM}rem + ${idx * STEP_REM + BUTTON_REM / 2}rem)`;
  const originY = `calc(1px + ${PAD_REM + BUTTON_REM / 2}rem)`;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Theme: ${LABEL[theme]}. Open theme picker.`}
        aria-haspopup="menu"
        aria-expanded={open}
        title={`Theme: ${LABEL[theme]}`}
        className="squircle inline-flex h-9 w-9 items-center justify-center rounded-md border-2 border-retro-ink bg-sidebar text-fg shadow-[2px_2px_0_var(--color-retro-ink)] transition-all duration-100 hover:bg-chat active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
      >
        {(() => {
          const Icon = ICON[theme];
          return <Icon />;
        })()}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Theme picker"
          className="squircle absolute z-30 flex animate-pop-in gap-1 rounded-xl border-2 border-retro-ink bg-bg p-1 shadow-[3px_3px_0_var(--color-retro-ink)]"
          style={{
            top: popoverTop,
            left: popoverLeft,
            transformOrigin: `${originX}px ${originY}px`,
          }}
        >
          {THEMES.map((t) => {
            const active = theme === t;
            const Icon = ICON[t];
            const label = `${LABEL[t]} theme`;
            return (
              <button
                key={t}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                aria-label={label}
                title={label}
                onClick={() => selectTheme(t)}
                className={[
                  "squircle flex h-9 w-9 items-center justify-center rounded-md border-2 transition-colors duration-150",
                  active
                    ? "border-retro-ink bg-accent text-on-accent"
                    : "border-transparent text-fg hover:bg-subtle",
                ].join(" ")}
              >
                <Icon />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
