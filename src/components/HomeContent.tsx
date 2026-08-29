"use client";

import { useAtom } from "jotai";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowUp } from "lucide-react";
import { expandedProjectsAtom } from "~/lib/atoms";
import { FadeIn } from "~/components/FadeIn";
import ProjectPreview from "~/components/ProjectPreview";
import PostPreview from "~/components/PostPreview";
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
  { href: "https://x.com/coffeehead01", label: "X" },
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

      {/* PROJECTS */}
      <div>
        <FadeIn index={next()}>
          <h2 className="flex items-center justify-between pb-1 text-medium text-muted-foreground">
            Projects
            {/* Nothing to expand into — no toggle. */}
            {hiddenProjects.length > 0 && (
              <button
                onClick={() => setShowMoreProjects(!showMoreProjects)}
                className="group flex items-center transition-all duration-200 ease-in-out hover:text-foreground"
              >
                {showMoreProjects ? "Less" : "More"}
                {showMoreProjects ? (
                  <ArrowUp className="ml-1 h-3" strokeWidth={2.6} />
                ) : (
                  <ArrowDown className="ml-1 h-3" strokeWidth={2.6} />
                )}
              </button>
            )}
          </h2>
        </FadeIn>
        {/* 3.25rem + the preview's own py-3 = the same 4rem gap the bio leaves. */}
        <div className="grid grid-cols-1 pb-[3.25rem]">
          {visibleProjects.map((project) => (
            <FadeIn key={project.id} index={next()}>
              <ProjectPreview
                title={project.name}
                description={project.description}
                url={project.url}
                logo={project.logo}
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
                  <ProjectPreview
                    key={project.id}
                    title={project.name}
                    description={project.description}
                    url={project.url}
                    logo={project.logo}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* JOURNAL */}
      <div>
        <FadeIn
          index={next()}
          className="flex justify-between pb-1 align-middle text-medium text-muted-foreground"
        >
          Journal
          {hasOlderWritings && <LinkArrow href="/journal">Older</LinkArrow>}
        </FadeIn>
        <ul className="flex flex-col pb-[3.25rem]">
          {writings.map((writing) => (
            <FadeIn as="li" index={next()} key={writing.slug}>
              <PostPreview
                title={writing.title}
                description={writing.description}
                slug={writing.slug}
              />
            </FadeIn>
          ))}
          {writings.length === 0 && (
            <FadeIn index={next()}>
              <p className="py-3 text-small text-muted-foreground">
                No writings yet.
              </p>
            </FadeIn>
          )}
        </ul>
      </div>

      {/* FIND ME */}
      <div>
        <FadeIn index={next()}>
          <h2 className="pb-1 text-medium text-muted-foreground">Find Me</h2>
        </FadeIn>
        {/* pt-3 stands in for the py-3 the preview cards carry, so the drop
            from every section heading to its first row matches. */}
        <div className="flex flex-col gap-2 pt-3">
          {socials.map((social) => (
            <FadeIn key={social.href} index={next()}>
              <LinkArrow href={social.href} external>
                {social.label}
              </LinkArrow>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
