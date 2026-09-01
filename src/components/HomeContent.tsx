"use client";

import { useAtom } from "jotai";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowUp } from "lucide-react";
import { ICON, ICON_STROKE } from "~/components/icons";
import { expandedProjectsAtom } from "~/lib/atoms";
import { FadeIn } from "~/components/FadeIn";
import Section from "~/components/Section";
import Preview from "~/components/Preview";
import LinkArrow from "~/components/LinkArrow";
import type { WritingMetadata } from "~/lib/writings";
import { projects } from "~/data/projects";
import { site } from "~/data/site";

interface HomeContentProps {
  writings: WritingMetadata[];
  hasOlderWritings: boolean;
}

/* AVATAR — the knobs */
const AVATAR_SIZE = "5rem";
const AVATAR_ZOOM = 1; // 1 = whole picture, 1.4 = crop 40% in
const AVATAR_FOCUS = "center"; // what stays in frame: "center", "top", "60% 40%"

const socials = [
  { href: "https://x.com/gabrielfp101", label: "X" },
  { href: "https://github.com/gabrielcoffee", label: "GitHub" },
  { href: "mailto:gfernandespereira18@gmail.com", label: "Email" },
  { href: "https://www.youtube.com/@coffeehead01", label: "YouTube" },
];

export default function HomeContent({
  writings,
  hasOlderWritings,
}: HomeContentProps) {
  const [showMoreProjects, setShowMoreProjects] = useAtom(expandedProjectsAtom);
  const visibleProjects = projects.slice(0, 3);
  const hiddenProjects = projects.slice(3);

  // Every FadeIn takes the next number, so sections can be reordered freely.
  let step = 0;
  const next = () => step++;

  return (
    <div className="gap-2">
      {/* BIO */}
      <div className="flex flex-row items-center gap-3 pb-16">
        <FadeIn index={next()}>
          {/* The picture is the link — no label, so finding it is the secret. */}
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${site.fullName} on Instagram`}
            className="block shrink-0 overflow-hidden rounded-xl"
            style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
          >
            <img
              src="/avatar.png"
              alt={site.fullName}
              className="h-full w-full object-cover"
              style={{
                transform: `scale(${AVATAR_ZOOM})`,
                objectPosition: AVATAR_FOCUS,
              }}
            />
          </a>
        </FadeIn>

        <div className="flex flex-col">
          <FadeIn index={next()}>
            <h1 className="font-serif text-big font-medium">{site.name}</h1>
          </FadeIn>

          <FadeIn index={next()}>
            <p className="text-balance text-small text-muted-foreground">
              Software, games, music, and whatever else I feel like creating.
            </p>
          </FadeIn>
        </div>
      </div>

      <Section
        title="Projects"
        index={next()}
        className="grid grid-cols-1"
        /* Nothing to expand into — no toggle. */
        action={
          hiddenProjects.length > 0 && (
            <button
              onClick={() => setShowMoreProjects(!showMoreProjects)}
              className="group flex items-center transition-all duration-200 ease-in-out hover:text-foreground"
            >
              {showMoreProjects ? "Less" : "More"}
              {showMoreProjects ? (
                <ArrowUp className={`ml-1 ${ICON}`} strokeWidth={ICON_STROKE} />
              ) : (
                <ArrowDown className={`ml-1 ${ICON}`} strokeWidth={ICON_STROKE} />
              )}
            </button>
          )
        }
      >
        {visibleProjects.map((project) => (
          <FadeIn key={project.id} index={next()}>
            <Preview
              kind="project"
              title={project.name}
              description={project.description}
              url={project.url}
            />
          </FadeIn>
        ))}
        {/* initial={false}: arriving with the list already open should not
            replay the expansion. */}
        <AnimatePresence initial={false}>
          {showMoreProjects && (
            <motion.div
              initial={{ opacity: 0, filter: "blur(4px)", height: 0 }}
              animate={{ opacity: 1, filter: "blur(0px)", height: "auto" }}
              exit={{ opacity: 0, filter: "blur(4px)", height: 0 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0 }}
              className="grid grid-cols-1"
            >
              {hiddenProjects.map((project) => (
                <Preview
                  key={project.id}
                  kind="project"
                  title={project.name}
                  description={project.description}
                  url={project.url}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </Section>

      <Section
        title="Writings"
        index={next()}
        className="flex flex-col"
        action={hasOlderWritings && <LinkArrow href="/writings">Older</LinkArrow>}
      >
        <ul className="flex flex-col">
          {writings.map((writing) => (
            <FadeIn as="li" index={next()} key={writing.slug}>
              <Preview
                kind="writing"
                title={writing.title}
                description={writing.description}
                type={writing.type}
                slug={writing.slug}
                date={writing.date}
              />
            </FadeIn>
          ))}
        </ul>
      </Section>

      <Section title="Find Me" index={next()} last className="flex flex-col">
        {socials.map((social) => (
          <FadeIn key={social.href} index={next()} className="py-3">
            <LinkArrow href={social.href} external>
              {social.label}
            </LinkArrow>
          </FadeIn>
        ))}
      </Section>
    </div>
  );
}
