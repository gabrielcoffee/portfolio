"use client";

import { useAtom, useAtomValue } from "jotai";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowUp } from "lucide-react";
import { animateAtom, expandedProjectsAtom } from "~/lib/atoms";
import { FadeIn } from "~/components/FadeIn";
import ProjectPreview from "~/components/ProjectPreview";
import PostPreview from "~/components/PostPreview";
import CritiqueCard from "~/components/CritiqueCard";
import LinkArrow from "~/components/LinkArrow";
import type { WritingMetadata } from "~/lib/writings";
import type { CritiqueMetadata } from "~/lib/critiques";
import { projects } from "~/data/projects";
import { site } from "~/data/site";

interface HomeContentProps {
  writings: WritingMetadata[];
  critiques: CritiqueMetadata[];
}

/* The picture is the link — no label, so finding it is the secret. */
function SecretLink() {
  return (
    <div className="mb-snug flex items-center gap-cozy">
      <a
        href={site.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${site.fullName} on Instagram`}
      >
        <img
          src="/avatar.png"
          alt={site.fullName}
          className="h-avatar w-avatar rounded-xl object-cover"
        />
      </a>
    </div>
  );
}

export default function HomeContent({ writings, critiques }: HomeContentProps) {
  // Header owns clearing this — it is the one component on every route.
  const shouldAnimate = useAtomValue(animateAtom);
  const [showMoreProjects, setShowMoreProjects] = useAtom(expandedProjectsAtom);
  const wasExpandedOnMount = useRef(showMoreProjects);

  useEffect(() => {
    wasExpandedOnMount.current = false;
  }, []);

  const visibleProjects = projects.slice(0, 3);
  const hiddenProjects = projects.slice(3);

  return (
    <div className="gap-snug">
      {/* BIO */}
      <div className="pb-snug gap-snug flex flex-row pb-section">
        <FadeIn
          index={0}
          animate={shouldAnimate}
          className="flex flex-col items-start"
        >
          <SecretLink />
        </FadeIn>

        <div className="flex flex-col gap-0">
          <FadeIn
            index={1}
            animate={shouldAnimate}
            className="flex flex-col items-start"
          >
            <h1 className="font-serif text-big font-medium">{site.name}</h1>
          </FadeIn>

          <FadeIn index={2} animate={shouldAnimate}>
            <p className="text-balance ptext-small text-muted-foreground">
              Software, games, music, and whatever else I feel like creating.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* PROJECTS */}
      <div>
        <FadeIn index={3} animate={shouldAnimate}>
          <h2 className="flex items-center justify-between pb-tight text-medium text-muted-foreground">
            Projects
            <button
              onClick={() => setShowMoreProjects(!showMoreProjects)}
              className="group flex items-center transition-all duration-200 ease-in-out hover:text-foreground"
            >
              {showMoreProjects ? "Less" : "More"}
              {showMoreProjects ? (
                <ArrowUp className="ml-tight h-icon" strokeWidth={2.6} />
              ) : (
                <ArrowDown className="ml-tight h-icon" strokeWidth={2.6} />
              )}
            </button>
          </h2>
        </FadeIn>
        <div className="grid grid-cols-1 pb-section">
          {visibleProjects.map((project, i) => (
            <FadeIn key={project.id} index={4 + i} animate={shouldAnimate}>
              <ProjectPreview
                title={project.name}
                description={project.description}
                url={project.url}
                logo={project.logo}
              />
            </FadeIn>
          ))}
          <AnimatePresence>
            {showMoreProjects && (
              <motion.div
                initial={
                  wasExpandedOnMount.current
                    ? false
                    : { opacity: 0, filter: "blur(4px)", height: 0 }
                }
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

      {/* WRITING */}
      <div>
        <FadeIn
          index={7}
          animate={shouldAnimate}
          className="flex justify-between pb-base align-middle text-medium text-muted-foreground"
        >
          Journal
          <LinkArrow href="/journal">Older</LinkArrow>
        </FadeIn>
        <ul className="flex flex-col pb-section">
          {writings.map((writing, i) => (
            <FadeIn
              as="li"
              index={8 + i}
              animate={shouldAnimate}
              key={writing.slug}
            >
              <PostPreview
                title={writing.title}
                description={writing.description}
                slug={writing.slug}
                showDate={false}
              />
            </FadeIn>
          ))}
          {writings.length === 0 && (
            <FadeIn index={8} animate={shouldAnimate}>
              <p className="py-cozy text-small text-muted-foreground">
                No writings yet.
              </p>
            </FadeIn>
          )}
        </ul>
      </div>

      {/* CRITIQUES */}
      <div>
        <FadeIn
          index={11}
          animate={shouldAnimate}
          className="flex justify-between pb-wide align-middle text-medium text-muted-foreground"
        >
          Critiques
          <LinkArrow href="/critiques">More</LinkArrow>
        </FadeIn>
        <FadeIn index={12} animate={shouldAnimate}>
          {critiques.length > 0 ? (
            <ul className="grid grid-cols-3 gap-x-section pb-page">
              {critiques.map((critique) => (
                <li key={critique.slug}>
                  <CritiqueCard
                    title={critique.title}
                    type={critique.type}
                    creator={critique.creator}
                    image={critique.image}
                    rating={critique.rating}
                    slug={critique.slug}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="pb-page text-small text-muted-foreground">
              No critiques yet.
            </p>
          )}
        </FadeIn>
      </div>

      {/* SOCIAL LINKS */}
      <div>
        <div className="flex gap-base md:gap-wide">
          <FadeIn index={13} animate={shouldAnimate}>
            <LinkArrow href="https://x.com/coffeehead01" external>
              X
            </LinkArrow>
          </FadeIn>
          <FadeIn index={14} animate={shouldAnimate}>
            <LinkArrow href="https://github.com/gabrielcoffee" external>
              GitHub
            </LinkArrow>
          </FadeIn>
          <FadeIn index={15} animate={shouldAnimate}>
            <LinkArrow href="mailto:gfernandespereira18@gmail.com" external>
              Email
            </LinkArrow>
          </FadeIn>
          <FadeIn index={16} animate={shouldAnimate}>
            <LinkArrow href="https://www.youtube.com/@coffeehead01" external>
              YouTube
            </LinkArrow>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
