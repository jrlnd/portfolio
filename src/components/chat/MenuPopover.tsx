import { Popover } from "@base-ui-components/react/popover";

const DEFAULT_TRIGGER_CLASS =
  "squircle inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted transition-colors hover:bg-subtle hover:text-fg md:text-xs";

// `chat-card` re-scopes the theme variables so colors match the chat panel
// after the Portal escapes the .chat-card ancestor. `bg-bg` then resolves to
// the chat-card background instead of the root background.
const POPUP_CLASS =
  "chat-card squircle flex w-auto animate-pop-in flex-col gap-0.5 rounded-xl border-2 border-retro-ink bg-bg p-1.5 shadow-[3px_3px_0_var(--color-retro-ink)] md:flex-row md:items-stretch md:justify-center md:gap-1";

// Mobile rows stretch to the popup's content-width (so every label is left-
// aligned consistently). Desktop tiles are a fixed 64px square.
const ITEM_CLASS = [
  "squircle flex rounded-md font-medium text-fg no-underline transition-colors hover:bg-subtle",
  "items-center gap-2 px-2.5 py-2 text-xs",
  "md:w-16 md:flex-col md:items-center md:justify-center md:gap-1 md:px-2 md:text-[10px] md:uppercase md:tracking-wide",
].join(" ");

interface MenuPopoverProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerClassName?: string;
  triggerContent: React.ReactNode;
  triggerAriaLabel: string;
  popupAriaLabel: string;
  children: React.ReactNode;
}

export function MenuPopover({
  open,
  onOpenChange,
  triggerClassName,
  triggerContent,
  triggerAriaLabel,
  popupAriaLabel,
  children,
}: MenuPopoverProps) {
  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger
        aria-label={triggerAriaLabel}
        className={triggerClassName ?? DEFAULT_TRIGGER_CLASS}
      >
        {triggerContent}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner
          sideOffset={8}
          collisionPadding={8}
          className="z-50"
        >
          <Popover.Popup aria-label={popupAriaLabel} className={POPUP_CLASS}>
            {children}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
}

export function MenuItemButton({
  onClick,
  icon,
  label,
}: MenuItemProps & { onClick: () => void }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={ITEM_CLASS}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export function MenuItemLink({
  href,
  external,
  download,
  icon,
  label,
}: MenuItemProps & {
  href: string;
  external?: boolean;
  download?: string;
}) {
  return (
    <a
      role="menuitem"
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      download={download}
      className={ITEM_CLASS}
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}
