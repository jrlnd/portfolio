import { profile } from "../../content/profile";
import { MenuItemLink, MenuPopover } from "./MenuPopover";

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
  return (
    <div className={className}>
      <MenuPopover
        triggerClassName={triggerClassName}
        triggerAriaLabel={triggerAriaLabel ?? "Resume options"}
        popupAriaLabel="Resume options"
        triggerContent={
          triggerContent ?? (
            <>
              <DocIcon />
              Resume
            </>
          )
        }
      >
        <MenuItemLink
          href={RESUME_URL}
          external
          icon={<EyeIcon />}
          label="Preview"
        />
        <MenuItemLink
          href={RESUME_URL}
          download={DOWNLOAD_NAME}
          icon={<DownloadIcon />}
          label="Download"
        />
      </MenuPopover>
    </div>
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
