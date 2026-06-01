"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Callout({
  kind,
  children,
}: {
  kind: "guide-overview" | "mentor-note" | "key-takeaway" | "common-mistake" | "practice";
  children: React.ReactNode;
}) {
  const title =
    kind === "guide-overview"
      ? "Overview"
      : kind === "mentor-note"
      ? "Mentor note"
      : kind === "key-takeaway"
      ? "Key takeaway"
      : kind === "common-mistake"
      ? "Common mistake"
      : "Practice";

  const accent =
    kind === "guide-overview"
      ? "border-l-[rgba(35,70,213,0.9)] bg-[rgba(67,97,238,0.05)]"
      : kind === "mentor-note"
      ? "border-l-[color:var(--primary)] bg-[rgba(67,97,238,0.06)]"
      : kind === "key-takeaway"
      ? "border-l-[rgba(0,101,41,0.9)] bg-[rgba(0,101,41,0.06)]"
      : kind === "common-mistake"
      ? "border-l-[rgba(186,26,26,0.9)] bg-[rgba(186,26,26,0.06)]"
      : "border-l-[rgba(99,57,219,0.9)] bg-[rgba(99,57,219,0.06)]";

  return (
    <div className={"rounded-xl border border-[color:var(--border)] border-l-4 p-4 " + accent}>
      <div className="text-xs font-semibold tracking-wide text-[color:var(--muted-foreground)]">
        {title.toUpperCase()}
      </div>
      <div className="mt-2 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function splitLearnMapBlocks(md: string) {
  const src = String(md || "");
  const lines = src.split(/\r?\n/);

  const parts: Array<
    | { type: "md"; md: string }
    | {
        type: "block";
        kind:
          | "guide-overview"
          | "mentor-note"
          | "key-takeaway"
          | "common-mistake"
          | "practice";
        md: string;
      }
  > = [];

  let buf: string[] = [];
  function flushBuf() {
    const text = buf.join("\n").trim();
    if (text) parts.push({ type: "md", md: text + "\n" });
    buf = [];
  }

  let i = 0;
  while (i < lines.length) {
    const line = String(lines[i] ?? "");
    const trimmed = line.trim();

    if (trimmed.startsWith(":::")) {
      const tag = trimmed.slice(3).trim();
      const kind =
        tag === "guide-overview" ||
        tag === "mentor-note" ||
        tag === "key-takeaway" ||
        tag === "common-mistake" ||
        tag === "practice"
          ? (tag as any)
          : null;

      if (kind) {
        flushBuf();
        i++;
        const block: string[] = [];
        while (i < lines.length && String(lines[i] ?? "").trim() !== ":::") {
          block.push(String(lines[i] ?? ""));
          i++;
        }
        if (i < lines.length) i++; // skip closing :::

        const blockMd = block.join("\n").trim();
        parts.push({ type: "block", kind, md: blockMd + "\n" });

        while (i < lines.length && String(lines[i] ?? "").trim() === "") i++;
        continue;
      }
    }

    buf.push(line);
    i++;
  }

  flushBuf();
  return parts;
}

export default function GuideMarkdown({ md }: { md: string }) {
  const parts = splitLearnMapBlocks(md);

  return (
    <div className="flex flex-col gap-4">
      {parts.map((p, idx) => {
        if (p.type === "block") {
          return (
            <Callout key={idx} kind={p.kind}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-[22px] font-extrabold leading-tight tracking-[-0.02em]">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="pt-2 text-[16px] font-bold">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="pt-2 text-[14px] font-bold">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="mt-2 list-disc pl-5 text-sm leading-relaxed">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mt-2 list-decimal pl-5 text-sm leading-relaxed">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => <li className="mt-1">{children}</li>,
                  code: ({ children, className }) => {
                    const inline = !className;
                    if (inline) {
                      return (
                        <code className="rounded bg-[rgba(67,97,238,0.08)] px-1 py-[1px] text-[0.95em]">
                          {children}
                        </code>
                      );
                    }
                    return <code>{children}</code>;
                  },
                }}
              >
                {p.md}
              </ReactMarkdown>
            </Callout>
          );
        }

        return (
          <ReactMarkdown
            key={idx}
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-[26px] font-extrabold leading-tight tracking-[-0.02em]">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="pt-2 text-[18px] font-bold">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="pt-2 text-[16px] font-bold">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="mt-2 list-disc pl-5 text-sm leading-relaxed">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="mt-2 list-decimal pl-5 text-sm leading-relaxed">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li className="mt-1">{children}</li>,
              pre: ({ children }) => (
                <pre className="mt-3 overflow-x-auto rounded-xl border border-[color:var(--border)] bg-white p-4 text-xs">
                  {children}
                </pre>
              ),
              code: ({ children, className }) => {
                const inline = !className;
                if (inline) {
                  return (
                    <code className="rounded bg-[rgba(67,97,238,0.08)] px-1 py-[1px] text-[0.95em]">
                      {children}
                    </code>
                  );
                }
                return <code>{children}</code>;
              },
              a: ({ children, href }) => (
                <a
                  href={href}
                  className="text-[color:var(--primary)] underline underline-offset-2"
                  target="_blank"
                  rel="noreferrer"
                >
                  {children}
                </a>
              ),
            }}
          >
            {p.md}
          </ReactMarkdown>
        );
      })}
    </div>
  );
}
