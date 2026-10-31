import { Fragment, ReactNode } from "react";

// Models reply in light markdown. This handles what they actually use, and since
// it builds React elements (never raw HTML), a reply can't inject markup.
function renderInline(text: string): ReactNode[] {
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\((?:https?:\/\/|mailto:)[^\s)]+\)|https?:\/\/[^\s)]+)/g;

  return text.split(pattern).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <a key={i} href={link[2]} target="_blank" rel="noopener noreferrer" className="text-link">
          {link[1]}
        </a>
      );
    }
    if (/^https?:\/\//.test(part)) {
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-link break-all">
          {part}
        </a>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export default function ChatMarkdown({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let bullets: string[] = [];

  const flushBullets = () => {
    if (bullets.length) {
      blocks.push(
        <ul key={blocks.length}>
          {bullets.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ul>,
      );
      bullets = [];
    }
  };

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    const bullet = line.match(/^(?:[-*•]|\d+\.)\s+(.*)$/);
    if (bullet) {
      bullets.push(bullet[1]);
      continue;
    }
    flushBullets();
    if (line) {
      blocks.push(
        <p key={blocks.length}>{renderInline(line.replace(/^#{1,6}\s+/, ""))}</p>,
      );
    }
  }
  flushBullets();

  return <div className="chat-prose">{blocks}</div>;
}
