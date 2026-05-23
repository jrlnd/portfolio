import { profile } from "../../content/profile";
import type { ContactCardData, Message, Session } from "./sessions";

function newId(): string {
  return crypto.randomUUID();
}

function formatBio(): string {
  // Split on blank lines (real paragraph breaks), then collapse any internal
  // whitespace within each paragraph so source-code line wraps don't become
  // visible line breaks.
  return profile.bio
    .split(/\n\s*\n/)
    .map((para) => para.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n\n");
}

function experienceMessages(): Message[] {
  const name = profile.preferredName ?? profile.name;
  const messages: Message[] = [
    {
      role: "assistant",
      content: `Here's ${name}'s work history, most recent first.`,
    },
  ];
  for (const e of profile.experience) {
    const where = e.location ? `, ${e.location}` : "";
    messages.push({
      role: "assistant",
      // Plain-text fallback used by API history and accessibility.
      content: `${e.role}, ${e.company} — ${e.dates}${where}\n\n${e.narrative}`,
      bubbled: true,
      experience: {
        role: e.role,
        company: e.company,
        companyUrl: (e as { companyUrl?: string }).companyUrl,
        dates: e.dates,
        location: e.location,
        narrative: e.narrative,
        skills: (e as { skills?: readonly string[] }).skills
          ? [...(e as { skills: readonly string[] }).skills]
          : undefined,
      },
    });
  }
  return messages;
}

function projectMessages(): Message[] {
  const name = profile.preferredName ?? profile.name;
  const messages: Message[] = [
    {
      role: "assistant",
      content: `Here are ${name}'s personal projects:`,
    },
  ];
  for (const p of profile.projects) {
    const status =
      "status" in p && typeof p.status === "string" ? p.status : undefined;
    messages.push({
      role: "assistant",
      content: `${p.title}${status ? ` (${status})` : ""}\n${p.summary}\nBuilt with ${p.tags.join(", ")}.`,
      bubbled: true,
      project: {
        title: p.title,
        titleUrl: (p as { url?: string }).url,
        status,
        summary: p.summary,
        tags: [...p.tags],
        image: (p as { image?: string }).image,
        imageAlt: (p as { imageAlt?: string }).imageAlt,
        gallery: (p as unknown as { gallery?: readonly string[] }).gallery
          ? [...(p as unknown as { gallery: readonly string[] }).gallery!]
          : undefined,
      },
    });
  }
  return messages;
}

function contactMessages(): Message[] {
  const name = profile.preferredName ?? profile.name;
  const cards: ContactCardData[] = [
    {
      kind: "email",
      label: "Email",
      handle: profile.links.email,
      url: `mailto:${profile.links.email}`,
    },
  ];
  if (profile.links.linkedin) {
    const handle =
      profile.links.linkedin.match(/in\/([^/]+)/)?.[1] ?? "LinkedIn";
    cards.push({
      kind: "linkedin",
      label: "LinkedIn",
      handle: `/in/${handle}`,
      url: profile.links.linkedin,
    });
  }
  if (profile.links.github) {
    const handle =
      profile.links.github.replace(/^https?:\/\/github\.com\//, "@") ?? "GitHub";
    cards.push({
      kind: "github",
      label: "GitHub",
      handle,
      url: profile.links.github,
    });
  }
  if (profile.links.resume) {
    cards.push({
      kind: "resume",
      label: "Resume",
      handle: "PDF",
      url: profile.links.resume,
    });
  }

  const handleSummary = cards
    .map((c) => `${c.label} (${c.handle ?? c.url})`)
    .join(", ");

  return [
    {
      role: "assistant",
      content: `The fastest way to reach ${name} is email, but here are all the places you'll find him 👇`,
    },
    {
      role: "assistant",
      content: handleSummary,
      contacts: cards,
    },
  ];
}

/**
 * Build the canned starter sessions a fresh visitor sees in the sidebar.
 * Timestamps are staggered so they sort Welcome / Experience / Projects /
 * Contact. As the visitor interacts, their own sessions float above these.
 */
export function buildPresets(): Session[] {
  const now = Date.now();
  const name = profile.preferredName ?? profile.name;

  const welcomeReply = [
    `Here's a brief intro from ${name}:`,
    `Hi there! 👋🏼`,
    formatBio(),
  ].join("\n\n");

  return [
    {
      id: newId(),
      title: "New chat",
      createdAt: now,
      updatedAt: now,
      messages: [],
    },
    {
      id: newId(),
      title: "About",
      createdAt: now - 1,
      updatedAt: now - 1,
      locked: true,
      messages: [
        { role: "user", content: `Hi! Tell me about ${name}.` },
        { role: "assistant", content: welcomeReply },
      ],
    },
    {
      id: newId(),
      title: "Experience",
      createdAt: now - 2,
      updatedAt: now - 2,
      locked: true,
      messages: [
        { role: "user", content: `What's ${name}'s work experience?` },
        ...experienceMessages(),
      ],
    },
    {
      id: newId(),
      title: "Projects",
      createdAt: now - 3,
      updatedAt: now - 3,
      locked: true,
      messages: [
        { role: "user", content: `What projects has ${name} worked on?` },
        ...projectMessages(),
      ],
    },
    {
      id: newId(),
      title: "Contact",
      createdAt: now - 4,
      updatedAt: now - 4,
      locked: true,
      messages: [
        { role: "user", content: `How can I get in touch with ${name}?` },
        ...contactMessages(),
      ],
    },
  ];
}
