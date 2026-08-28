"use client";

import { useAtom } from "jotai";
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

interface HomeContentProps {
  writings: WritingMetadata[];
  critiques: CritiqueMetadata[];
}

export default function HomeContent({ writings, critiques }: HomeContentProps) {
  const [shouldAnimate, setShouldAnimate] = useAtom(animateAtom);
  const [showMoreProjects, setShowMoreProjects] = useAtom(expandedProjectsAtom);
  const wasExpandedOnMount = useRef(showMoreProjects);

  useEffect(() => {
    wasExpandedOnMount.current = false;
  }, []);

  useEffect(() => {
    if (shouldAnimate) {
      setTimeout(() => setShouldAnimate(false), 2000);
    }
  }, [shouldAnimate, setShouldAnimate]);

  const visibleProjects = projects.slice(0, 3);
  const hiddenProjects = projects.slice(3);

  return (
    <div className="flex flex-col gap-2">
      {/* BIO */}
      <div className="pb-2">
        <FadeIn index={0} animate={shouldAnimate} className="flex flex-col items-start">
          <a
            href="https://www.instagram.com/fernandesworks"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative mb-2 flex items-center gap-3"
          >
            <img
              src="/avatar.png"
              alt="Gabriel Pereira"
              className="h-20 w-20 rounded-full object-cover transition-transform duration-200 group-hover:scale-[1.2]"
            />
            <span className="pointer-events-none whitespace-nowrap text-xs text-muted-foreground opacity-0 transition-opacity duration-200 delay-500 group-hover:opacity-100">
              click for a little secret
            </span>
          </a>
        </FadeIn>
        <FadeIn index={1} animate={shouldAnimate} className="flex flex-col items-start pb-2">
          <h1 className="font-serif text-xl font-medium">Gabriel Pereira</h1>
        </FadeIn>
        <FadeIn index={2} animate={shouldAnimate}>
          <p className="text-balance pb-8 text-sm tracking-[0.01em] text-muted-foreground">
            Brazilian software engineer who loves to build, listen to music, and
            learn new things.
          </p>
        </FadeIn>
      </div>

      {/* PROJECTS */}
      <div>
        <FadeIn index={3} animate={shouldAnimate}>
          <h2 className="flex items-center justify-between pb-1 text-sm tracking-[0.01em] text-muted-foreground">
            Projects
            <button
              onClick={() => setShowMoreProjects(!showMoreProjects)}
              className="group flex items-center transition-all duration-200 ease-in-out hover:text-foreground"
            >
              {showMoreProjects ? "Less" : "More"}
              {showMoreProjects ? (
                <ArrowUp className="ml-1 h-2.5" strokeWidth={2.6} />
              ) : (
                <ArrowDown className="ml-1 h-2.5" strokeWidth={2.6} />
              )}
            </button>
          </h2>
        </FadeIn>
        <div className="grid grid-cols-1 pb-8">
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
          className="flex justify-between pb-4 align-middle text-sm tracking-[0.01em] text-muted-foreground"
        >
          Journal
          <LinkArrow href="/journal">Older</LinkArrow>
        </FadeIn>
        <ul className="flex flex-col pb-8">
          {writings.map((writing, i) => (
            <FadeIn as="li" index={8 + i} animate={shouldAnimate} key={writing.slug}>
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
              <p className="py-3 text-sm text-muted-foreground">No writings yet.</p>
            </FadeIn>
          )}
        </ul>
      </div>

      {/* CRITIQUES */}
      <div>
        <FadeIn
          index={11}
          animate={shouldAnimate}
          className="flex justify-between pb-6 align-middle text-sm tracking-[0.01em] text-muted-foreground"
        >
          Critiques
          <LinkArrow href="/critiques">More</LinkArrow>
        </FadeIn>
        <FadeIn index={12} animate={shouldAnimate}>
          {critiques.length > 0 ? (
            <ul className="grid grid-cols-3 gap-x-8 pb-20">
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
            <p className="pb-20 text-sm text-muted-foreground">
              No critiques yet.
            </p>
          )}
        </FadeIn>
      </div>

      {/* SOCIAL LINKS */}
      <div>
        <div className="flex gap-4 tracking-[0.01em] md:gap-6">
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
