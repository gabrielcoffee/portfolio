"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, FileText, NotebookPen } from "lucide-react";
import { ICON, ICON_STROKE } from "~/components/icons";
import { formatDate } from "~/lib/date";
import type { WritingType } from "~/lib/writings";

/* One icon per writing type. */
export const typeIcons = {
  article: FileText,
  journal: NotebookPen,
} satisfies Record<WritingType, typeof FileText>;

/* A site's own favicon, straight from its domain. A project with no url has
   no favicon to fetch. */
function faviconOf(url: string): string | null {
  try {
    const { hostname } = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
  } catch {
    return null;
  }
}

function typeMark(type: WritingType) {
  const Icon = typeIcons[type];
  return (
    <Icon
      className={`${ICON} text-muted-foreground`}
      strokeWidth={ICON_STROKE}
      aria-label={type}
    />
  );
}

function faviconMark(url: string) {
  const src = faviconOf(url);
  // No favicon to show, but the slot still has to hold the title's edge.
  if (!src) return <span className={ICON} aria-hidden />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" aria-hidden className={ICON} />;
}

type PreviewProps =
  | {
      kind: "writing";
      type: WritingType;
      title: string;
      description: string;
      slug: string;
      date: string;
      basePath?: string;
    }
  | {
      kind: "project";
      title: string;
      description: string;
      /* "#" means the project has nowhere to go yet. */
      url: string;
    };

/* One row in a list — a writing or a project. They share a shape: a 16px mark,
   a title that grows an arrow on hover, a description under it, and an
   optional note on the right. What differs is only the mark and the note. */
export default function Preview(props: PreviewProps) {
  const [hovering, setHovering] = useState(false);

  /* Everything the two kinds differ by, settled in one place — TypeScript can
     only narrow the union at the discriminant, not through a boolean. */
  const { href, linked, external, mark, note } =
    props.kind === "writing"
      ? {
          href: `${props.basePath ?? "/writings"}/${props.slug}`,
          linked: true,
          external: false,
          mark: typeMark(props.type),
          note: formatDate(props.date, { month: "2-digit", year: "numeric" }),
        }
      : {
          href: props.url,
          linked: props.url !== "#",
          external: true,
          mark: faviconMark(props.url),
          note: null,
        };

  const body = (
    <>
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex items-center gap-2">
          {mark}
          <div
            className={`flex items-center transition-colors duration-150 ${
              linked ? "group-hover:text-muted-foreground" : ""
            }`}
          >
            {props.title}
            <AnimatePresence>
              {linked && hovering && (
                <motion.span
                  className="flex"
                  initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                  animate={{ opacity: 1, width: "auto", marginLeft: 6 }}
                  exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                  transition={{ duration: 0.15, ease: "easeInOut" }}
                >
                  <ArrowUpRight
                    className={`${ICON} text-muted-foreground`}
                    strokeWidth={ICON_STROKE}
                  />
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
        {/* Indented past the mark so descriptions line up under the titles. */}
        <p className="pl-6 text-small text-muted-foreground">
          {props.description}
        </p>
      </div>
      {note && (
        <span className="shrink-0 text-small text-muted-foreground">{note}</span>
      )}
    </>
  );

  const className = `group flex w-full items-center justify-between gap-4 py-3 ${
    linked ? "cursor-pointer" : ""
  }`;

  if (!linked) return <div className={className}>{body}</div>;

  const hover = {
    onMouseEnter: () => setHovering(true),
    onMouseLeave: () => setHovering(false),
    onFocus: () => setHovering(true),
    onBlur: () => setHovering(false),
  };

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...hover}
      >
        {body}
      </a>
    );
  }

  return (
    <Link href={href} className={className} {...hover}>
      {body}
    </Link>
  );
}
