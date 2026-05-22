import { useEffect, useRef, useState } from "react";
import ContactModal from "./ContactModal";

interface Props {
  email: string;
  children: React.ReactNode;
  className?: string;
}

export default function EmailMenu({ email, children, className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  const gmailUrl = `https://mail.google.com/mail/?extsrc=mailto&url=${encodeURIComponent(`mailto:${email}`)}`;
  const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(email)}`;
  const mailtoUrl = `mailto:${email}`;

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

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(t);
  }, [copied]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // Clipboard API unavailable — silently noop.
    }
  }

  return (
    <span ref={containerRef} className={`relative inline-block ${className}`}>
      <a
        href={mailtoUrl}
        onClick={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
        className="animate-fade-in text-secondary underline decoration-secondary underline-offset-2 transition-opacity hover:opacity-80"
      >
        {children}
      </a>

      {open && (
        <span
          role="menu"
          aria-label="Email options"
          className="squircle absolute bottom-full left-1/2 z-30 mb-2 flex -translate-x-1/2 animate-pop-in items-stretch gap-1 rounded-xl border-2 border-retro-ink bg-bg p-1.5 shadow-[3px_3px_0_var(--color-retro-ink)]"
        >
          <ItemLink
            href={gmailUrl}
            external
            icon={<GmailIcon />}
            label="Gmail"
          />
          <ItemLink
            href={outlookUrl}
            external
            icon={<OutlookIcon />}
            label="Outlook"
          />
          <ItemButton
            onClick={copyEmail}
            icon={copied ? <CheckIcon /> : <CopyIcon />}
            label={copied ? "Copied" : "Copy"}
          />
          <ItemButton
            onClick={() => {
              setOpen(false);
              setModalOpen(true);
            }}
            icon={<FormIcon />}
            label="Form"
          />
          <ItemLink href={mailtoUrl} icon={<MailIcon />} label="Default" />
        </span>
      )}

      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </span>
  );
}

interface ItemProps {
  icon: React.ReactNode;
  label: string;
}

const itemClass =
  "squircle flex w-16 flex-col items-center justify-center gap-1 rounded-md px-2 py-2 text-[10px] font-medium uppercase tracking-wide text-fg no-underline transition-colors hover:bg-subtle";

function ItemButton({
  onClick,
  icon,
  label,
}: ItemProps & { onClick: () => void }) {
  return (
    <button type="button" role="menuitem" onClick={onClick} className={itemClass}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function ItemLink({
  href,
  external,
  icon,
  label,
}: ItemProps & { href: string; external?: boolean }) {
  return (
    <a
      role="menuitem"
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={itemClass}
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}

function MailIcon() {
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
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CopyIcon() {
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
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function FormIcon() {
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
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function GmailIcon() {
  return (
    <svg
      aria-label="Gmail"
      viewBox="0 0 800 636.3632"
      className="h-4 w-4 shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <defs>
        <linearGradient
          id="email-menu-gmail-a"
          x1="165"
          x2="165"
          y1="44"
          y2="166"
          gradientTransform="translate(-36.3627 -118.1803) scale(4.5454426)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#60d673" />
          <stop offset=".17" stopColor="#42c868" />
          <stop offset=".39" stopColor="#0ebc5f" />
          <stop offset=".62" stopColor="#00a9bb" />
          <stop offset=".86" stopColor="#3c90ff" />
          <stop offset="1" stopColor="#3186ff" />
        </linearGradient>
        <linearGradient
          id="email-menu-gmail-b"
          x1="8"
          x2="184"
          y1="46.13"
          y2="46.13"
          gradientTransform="translate(-36.3627 -118.1803) scale(4.5454426)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".08" stopColor="#ff63a0" />
          <stop offset=".3" stopColor="#fc413d" />
          <stop offset=".5" stopColor="#fc413d" />
          <stop offset=".65" stopColor="#fc413d" />
          <stop offset=".72" stopColor="#fc5c30" />
          <stop offset=".86" stopColor="#feb10c" />
          <stop offset=".91" stopColor="#fec700" />
          <stop offset=".96" stopColor="#ffdb0f" />
        </linearGradient>
      </defs>
      <path
        fill="url(#email-menu-gmail-a)"
        d="M627.272 81.8192h172.7267V581.818c0 30.1227-24.4226 54.5453-54.5453 54.5453h-90.9088a27.2727 27.2727 0 0 1-27.2727-27.2726z"
      />
      <path
        fill="#fc413d"
        d="M172.7277 81.8192H.0009V581.818c0 30.1227 24.4226 54.5453 54.5453 54.5453h90.9088a27.2727 27.2727 0 0 0 27.2727-27.2726z"
      />
      <path
        fill="url(#email-menu-gmail-b)"
        d="M141.9369 20.2557C105.4233-10.435 50.9461-5.7169 20.2552 30.7967c-30.6908 36.509-25.9726 90.986 10.541 121.6814l345.8081 290.6765a36.3635 36.3635 0 0 0 46.7953 0l345.8082-290.681c36.509-30.6909 41.2272-85.168 10.5364-121.6815-30.6909-36.509-85.168-41.2272-121.677-10.5364L399.9998 237.1825Z"
      />
    </svg>
  );
}

function OutlookIcon() {
  return (
    <svg
      aria-label="Outlook"
      viewBox="60 90.4 570.02 539.67"
      className="h-4 w-4 shrink-0"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="email-menu-outlook-a"
          x1="9.9891"
          x2="30.9322"
          y1="22.3649"
          y2="9.375"
          gradientTransform="scale(15)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#20a7fa" />
          <stop offset=".4" stopColor="#3bd5ff" />
          <stop offset="1" stopColor="#c4b0ff" />
        </linearGradient>
        <linearGradient
          id="email-menu-outlook-b"
          x1="17.1972"
          x2="28.8562"
          y1="26.7945"
          y2="8.1258"
          gradientTransform="scale(15)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#165ad9" />
          <stop offset=".5008" stopColor="#1880e5" />
          <stop offset="1" stopColor="#8587ff" />
        </linearGradient>
        <linearGradient
          id="email-menu-outlook-d"
          x1="24.0534"
          x2="44.51"
          y1="31.1099"
          y2="18.0177"
          gradientTransform="scale(15)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#1a43a6" />
          <stop offset=".4923" stopColor="#2052cb" />
          <stop offset="1" stopColor="#5f20cb" />
        </linearGradient>
        <linearGradient
          id="email-menu-outlook-g"
          x1="41.998"
          x2="23.8517"
          y1="29.9431"
          y2="29.9431"
          gradientTransform="scale(15)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#4dc4ff" />
          <stop offset=".1961" stopColor="#0fafff" />
        </linearGradient>
        <radialGradient
          id="email-menu-outlook-j"
          cx="0"
          cy="0"
          r="1"
          fx="0"
          fy="0"
          gradientTransform="rotate(123.339 27.9562 281.58) scale(310.886994 806.788501)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#49deff" />
          <stop offset=".7243" stopColor="#29c3ff" />
        </radialGradient>
        <radialGradient
          id="email-menu-outlook-l"
          cx="0"
          cy="0"
          r="1"
          fx="0"
          fy="0"
          gradientTransform="rotate(46.9242 -378.504 245.2493) scale(315.927)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".0389" stopColor="#0091ff" />
          <stop offset=".9191" stopColor="#183dad" />
        </radialGradient>
      </defs>
      <path
        fill="url(#email-menu-outlook-a)"
        fillRule="nonzero"
        d="M463.9844 140.1445 119.6367 358.4141l-29.6133-46.7188v-40.2578c0-14.6562 7.422-28.3164 19.7188-36.293l200.168-129.8867c30.496-19.789 69.7773-19.793 100.2773-.0078Zm0 0"
      />
      <path
        fill="url(#email-menu-outlook-b)"
        fillRule="nonzero"
        d="M407.1016 103.3398c1.0351.6133 2.0625 1.254 3.082 1.9141l156.2148 101.332-387.3359 245.5196-59.4375-93.7696 284.2695-180.5351c26.9258-17.1016 28.1055-55.5703 3.207-74.461m0 0"
      />
      <path
        fill="url(#email-menu-outlook-d)"
        fillRule="nonzero"
        d="m333.6016 498.9883-154.5352-46.879L507.629 243.836c27.6719-17.539 27.6016-57.9375-.1328-75.3789l-1.4805-.9297 4.2617 2.6485 99.9961 64.8672c12.3008 7.9765 19.7227 21.6406 19.7227 36.3007v38.961Zm0 0"
      />
      <path
        fill="url(#email-menu-outlook-g)"
        fillRule="nonzero"
        d="M315.7695 630.0508h220.4493c51.7773 0 93.75-41.9727 93.75-93.75V272.1406c0 15.3008-7.8633 29.5274-20.8204 37.664L281.2422 515.6954c-17.6875 11.1094-28.4219 30.5274-28.4219 51.414.004 34.7618 28.1836 62.9415 62.9492 62.9415m0 0"
      />
      <path
        fill="url(#email-menu-outlook-j)"
        fillRule="nonzero"
        d="M405.4023 630.0352h-221.664c-51.7774 0-93.75-41.9727-93.75-93.75V271.9453c0 15.2735 7.836 29.4766 20.7539 37.6211l327.582 206.5195c17.9336 11.3047 28.8086 31.0274 28.8086 52.2266-.0039 34.0898-27.6406 61.7227-61.7305 61.7227m0 0"
      />
      <path
        fill="url(#email-menu-outlook-l)"
        fillRule="nonzero"
        d="M108.75 345h142.5c26.9258 0 48.75 21.8242 48.75 48.75v142.5c0 26.9258-21.8242 48.75-48.75 48.75h-142.5C81.8242 585 60 563.1758 60 536.25v-142.5C60 366.8242 81.8242 345 108.75 345m0 0"
      />
      <path
        fill="#ffffff"
        fillRule="nonzero"
        d="M179.332 535.8477c-19.7695 0-36-6.375-48.6914-19.129-12.6875-12.7539-19.0351-29.3984-19.0351-49.9296 0-21.6836 6.4414-39.2188 19.3242-52.6094 12.8828-13.3945 29.75-20.0899 50.6016-20.0899 19.703 0 35.7421 6.4102 48.1132 19.2266 12.4375 12.8203 18.6524 29.7188 18.6524 50.6992 0 21.5508-6.4414 38.9297-19.3203 52.129-12.8203 13.1367-29.3672 19.703-49.6446 19.703m.5703-27.0665c10.7774 0 19.4532-3.7968 26.0196-11.3828 6.5703-7.5898 9.8515-18.1445 9.8515-31.664 0-14.0938-3.1875-25.0586-9.5625-32.9024-6.3789-7.8437-14.8906-11.7656-25.539-11.7656-10.9727 0-19.8047 4.0469-26.5 12.1484-6.6953 8.0313-10.043 18.6836-10.043 31.9454 0 13.457 3.3477 24.1054 10.043 31.9492 6.6953 7.7812 15.2734 11.6719 25.7304 11.6719m0 0"
      />
    </svg>
  );
}
