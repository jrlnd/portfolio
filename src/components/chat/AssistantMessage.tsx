import EmailMenu from "./EmailMenu";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MAILTO_RE = /^mailto:/i;

type Inline =
  | { type: "text"; value: string }
  | { type: "bold"; children: Inline[] }
  | { type: "italic"; children: Inline[] }
  | { type: "code"; value: string }
  | { type: "link"; text: string; url: string };

type Block =
  | { type: "text"; value: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  let i = 0;
  let buf = "";
  const flush = () => {
    if (buf) {
      out.push({ type: "text", value: buf });
      buf = "";
    }
  };
  while (i < text.length) {
    // [text](url)
    if (text[i] === "[") {
      const closeBracket = text.indexOf("]", i + 1);
      if (closeBracket > i + 1 && text[closeBracket + 1] === "(") {
        const closeParen = text.indexOf(")", closeBracket + 2);
        if (closeParen > closeBracket + 2) {
          flush();
          out.push({
            type: "link",
            text: text.slice(i + 1, closeBracket),
            url: text.slice(closeBracket + 2, closeParen),
          });
          i = closeParen + 1;
          continue;
        }
      }
    }
    if (text[i] === "*" && text[i + 1] === "*") {
      const close = text.indexOf("**", i + 2);
      if (close > i + 2) {
        flush();
        out.push({
          type: "bold",
          children: parseInline(text.slice(i + 2, close)),
        });
        i = close + 2;
        continue;
      }
    }
    if (text[i] === "*" && text[i + 1] !== "*") {
      const close = text.indexOf("*", i + 1);
      if (close > i + 1 && text[close - 1] !== " ") {
        flush();
        out.push({
          type: "italic",
          children: parseInline(text.slice(i + 1, close)),
        });
        i = close + 1;
        continue;
      }
    }
    if (text[i] === "`") {
      const close = text.indexOf("`", i + 1);
      if (close > i + 1) {
        flush();
        out.push({ type: "code", value: text.slice(i + 1, close) });
        i = close + 1;
        continue;
      }
    }
    buf += text[i];
    i++;
  }
  flush();
  return out;
}

// Block-level pass: group consecutive list lines into ul / ol blocks, leave
// everything else as a text block (newlines within preserved by pre-wrap).
function parseBlocks(content: string): Block[] {
  const lines = content.split("\n");
  const blocks: Block[] = [];
  let i = 0;
  let textBuf: string[] = [];

  const flushText = () => {
    while (textBuf.length && textBuf[textBuf.length - 1] === "") textBuf.pop();
    while (textBuf.length && textBuf[0] === "") textBuf.shift();
    if (textBuf.length) {
      blocks.push({ type: "text", value: textBuf.join("\n") });
      textBuf = [];
    }
  };

  while (i < lines.length) {
    const line = lines[i];
    if (/^[-*] (.+)/.test(line)) {
      flushText();
      const items: string[] = [];
      while (i < lines.length) {
        const m = /^[-*] (.+)/.exec(lines[i]);
        if (!m) break;
        items.push(m[1]);
        i++;
      }
      blocks.push({ type: "ul", items });
    } else if (/^\d+\. (.+)/.test(line)) {
      flushText();
      const items: string[] = [];
      while (i < lines.length) {
        const m = /^\d+\. (.+)/.exec(lines[i]);
        if (!m) break;
        items.push(m[1]);
        i++;
      }
      blocks.push({ type: "ol", items });
    } else {
      textBuf.push(line);
      i++;
    }
  }
  flushText();
  return blocks;
}

// Stable keys mean React reuses existing spans across renders and only mounts
// new ones for incoming stream tokens — the CSS fade-in fires only for the
// freshly-mounted spans.
function tokenize(text: string): string[] {
  return text.match(/\S+|\s+/g) ?? [];
}

function renderText(text: string, keyPrefix: string, animate: boolean) {
  const tokens = tokenize(text);
  // Streaming: emit one span per token so the staggered fade-in can fire as
  // each new token mounts.
  if (animate) {
    return tokens.map((tok, ti) => {
      const key = `${keyPrefix}-${ti}`;
      if (EMAIL_REGEX.test(tok)) {
        return (
          <EmailMenu key={key} email={tok}>
            {tok}
          </EmailMenu>
        );
      }
      return (
        <span key={key} className="animate-fade-in">
          {tok}
        </span>
      );
    });
  }
  // Static: collapse contiguous non-email tokens into plain strings so we
  // don't litter the DOM with empty <span>s.
  const out: React.ReactNode[] = [];
  let buf = "";
  let idx = 0;
  for (const tok of tokens) {
    if (EMAIL_REGEX.test(tok)) {
      if (buf) {
        out.push(buf);
        buf = "";
      }
      out.push(
        <EmailMenu key={`${keyPrefix}-${idx++}`} email={tok}>
          {tok}
        </EmailMenu>,
      );
    } else {
      buf += tok;
    }
  }
  if (buf) out.push(buf);
  return out;
}

function renderInline(nodes: Inline[], keyPrefix: string, animate: boolean) {
  return nodes.map((node, ni) => {
    const key = `${keyPrefix}-${ni}`;
    switch (node.type) {
      case "bold":
        return (
          <strong key={key} className="font-semibold">
            {renderInline(node.children, key, animate)}
          </strong>
        );
      case "italic":
        return (
          <em key={key} className="italic">
            {renderInline(node.children, key, animate)}
          </em>
        );
      case "code":
        return (
          <code
            key={key}
            className={`rounded bg-subtle px-1 py-0.5 font-mono text-[0.9em] text-fg ${animate ? "animate-fade-in" : ""}`}
          >
            {node.value}
          </code>
        );
      case "link": {
        const isMailto = MAILTO_RE.test(node.url);
        if (isMailto) {
          const email = node.url.replace(MAILTO_RE, "");
          return (
            <EmailMenu key={key} email={email}>
              {node.text}
            </EmailMenu>
          );
        }
        const isExternal = /^https?:\/\//i.test(node.url);
        return (
          <a
            key={key}
            href={node.url}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noreferrer" : undefined}
            className={`text-secondary underline decoration-secondary underline-offset-2 transition-opacity hover:opacity-80 ${animate ? "animate-fade-in" : ""}`}
          >
            {node.text}
          </a>
        );
      }
      case "text":
        return renderText(node.value, key, animate);
    }
  });
}

function renderBlocks(blocks: Block[], animate: boolean) {
  return blocks.map((block, bi) => {
    const key = `b${bi}`;
    switch (block.type) {
      case "text": {
        // Split on blank lines so each paragraph becomes its own <p>. Single
        // paragraphs skip the wrapping <div> so the natural flow is cleaner.
        const paragraphs = block.value
          .split(/\n\s*\n/)
          .map((p) => p.trim())
          .filter(Boolean);
        if (paragraphs.length === 1) {
          return (
            <p key={key} className="whitespace-pre-wrap leading-relaxed">
              {renderInline(parseInline(paragraphs[0]), key, animate)}
            </p>
          );
        }
        return (
          <div key={key} className="space-y-4">
            {paragraphs.map((para, pi) => (
              <p
                key={`${key}-${pi}`}
                className="whitespace-pre-wrap leading-relaxed"
              >
                {renderInline(parseInline(para), `${key}-${pi}`, animate)}
              </p>
            ))}
          </div>
        );
      }
      case "ul":
        return (
          <ul key={key} className="list-disc space-y-1 pl-5">
            {block.items.map((item, ii) => {
              const itemKey = `${key}-${ii}`;
              return (
                <li key={itemKey}>
                  {renderInline(parseInline(item), itemKey, animate)}
                </li>
              );
            })}
          </ul>
        );
      case "ol":
        return (
          <ol key={key} className="list-decimal space-y-1 pl-5">
            {block.items.map((item, ii) => {
              const itemKey = `${key}-${ii}`;
              return (
                <li key={itemKey}>
                  {renderInline(parseInline(item), itemKey, animate)}
                </li>
              );
            })}
          </ol>
        );
    }
  });
}

interface Props {
  content: string;
  isStreaming: boolean;
  animate: boolean;
  // When rendered inside a parent that already constrains width (e.g. a
  // bubble wrapper), skip the internal max-w so content fills the parent.
  inBubble?: boolean;
}

export default function AssistantMessage({
  content,
  isStreaming,
  inBubble,
}: Props) {
  const wrapperClass = inBubble ? "" : "max-w-[85%]";

  if (!content) {
    return (
      <div className={`${wrapperClass} text-fg`}>
        <span className="inline-flex gap-1">
          <Dot delay="0ms" />
          <Dot delay="160ms" />
          <Dot delay="320ms" />
        </span>
      </div>
    );
  }

  const blocks = parseBlocks(content);

  return (
    <div className={wrapperClass}>
      <div className="space-y-2 text-fg">
        {renderBlocks(blocks, isStreaming)}
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 animate-dot rounded-full bg-muted"
      style={{ animationDelay: delay }}
    />
  );
}
