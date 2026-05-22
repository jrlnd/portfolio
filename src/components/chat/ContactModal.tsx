import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  open: boolean;
  onClose: () => void;
}

type Status = "idle" | "sending" | "success" | "error";

export default function ContactModal({ open, onClose }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) firstFieldRef.current?.focus();
  }, [open]);

  // Lock body scroll while modal is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  function reset() {
    setName("");
    setEmail("");
    setCompany("");
    setMessage("");
    setHoneypot("");
    setStatus("idle");
    setErrorMsg("");
  }

  function handleClose() {
    onClose();
    // Defer reset so the closing animation doesn't show empty fields mid-fade.
    window.setTimeout(reset, 300);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, company, message, honeypot }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Couldn't send your message. Please try again.",
      );
    }
  }

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Send a message"
      className="fixed inset-0 z-[100] flex animate-fade-in items-center justify-center px-4"
    >
      <button
        type="button"
        onClick={handleClose}
        aria-label="Close"
        className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
      />
      <div
        ref={dialogRef}
        className="squircle relative z-10 w-full max-w-md animate-pop-in rounded-2xl border-2 border-retro-ink bg-sidebar p-5 shadow-[4px_4px_0_var(--color-retro-ink)] sm:p-6"
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="squircle absolute -right-3 -top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-retro-ink bg-bg text-fg shadow-[2px_2px_0_var(--color-retro-ink)] transition-all duration-150 hover:bg-subtle active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
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
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
        <div className="mb-4">
          <h2 className="text-2xl font-black tracking-wide text-white [-webkit-text-stroke:3px_var(--color-retro-ink)] [paint-order:stroke_fill] [text-shadow:3px_3px_0_var(--color-retro-ink)]">
            Send a message
          </h2>
        </div>

        {status === "success" ? (
          <div className="py-4 text-center">
            <p className="text-lg font-semibold text-fg">
              Thanks — your message is on its way.
            </p>
            <p className="mt-2 text-sm text-muted">
              I'll reply within a day or two.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="squircle mt-5 inline-flex items-center justify-center gap-2 rounded-md border-2 border-retro-ink bg-accent px-4 py-2 text-sm font-medium text-on-accent shadow-[3px_3px_0_var(--color-retro-ink)] transition-all duration-100 hover:opacity-90 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <Field label="Name" htmlFor="contact-name" required>
              <input
                ref={firstFieldRef}
                id="contact-name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={status === "sending"}
                className={fieldClass}
              />
            </Field>

            <Field label="Email" htmlFor="contact-email" required>
              <input
                id="contact-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "sending"}
                className={fieldClass}
              />
            </Field>

            <Field label="Company / Role" htmlFor="contact-company">
              <input
                id="contact-company"
                type="text"
                autoComplete="organization"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                disabled={status === "sending"}
                className={fieldClass}
              />
            </Field>

            <Field label="Message" htmlFor="contact-message" required>
              <textarea
                id="contact-message"
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={status === "sending"}
                className={`${fieldClass} resize-y`}
              />
            </Field>

            {/* Honeypot: hidden from sighted users + keyboard nav. */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              aria-hidden="true"
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
            />

            {status === "error" && (
              <p role="alert" className="text-xs text-accent">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="squircle mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md border-2 border-retro-ink bg-accent px-4 py-2 text-sm font-medium text-on-accent shadow-[3px_3px_0_var(--color-retro-ink)] transition-all duration-100 hover:opacity-90 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-60 disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-[3px_3px_0_var(--color-retro-ink)]"
            >
              {status === "sending" ? "Sending..." : "Send"}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}

const fieldClass =
  "squircle w-full rounded-md border-2 border-retro-ink bg-bg px-3 py-2 text-sm text-fg placeholder:text-muted focus:outline-none focus:shadow-[2px_2px_0_var(--color-retro-ink)] disabled:cursor-not-allowed disabled:opacity-60";

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1 block text-xs font-medium text-fg"
      >
        {label}
        {required && <span className="ml-0.5 text-accent">*</span>}
      </label>
      {children}
    </div>
  );
}
