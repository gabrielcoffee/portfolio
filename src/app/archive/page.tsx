import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { pageTitle } from "~/data/site";
import { FadeIn } from "~/components/FadeIn";
import { getPictures } from "~/lib/archive";

export const metadata: Metadata = {
  title: pageTitle("Archive"),
  description: "Mini manga, drawings and pictures.",
};

export default function ArchivePage() {
  const cover = getPictures()[0];

  const sections = [
    {
      title: "Mini Manga",
      description: "My childhood comic book company.",
      href: null,
      cover: null,
    },
    {
      title: "Drawings",
      description: "Recent years of drawings and doodling.",
      href: null,
      cover: null,
    },
    {
      title: "Pictures",
      description: "Day to day life.",
      href: "/archive/pictures",
      cover: cover?.src ?? null,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {sections.map((section, i) => {
        const tile = (
          <>
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              {section.cover && (
                <Image
                  src={section.cover}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
            </div>
            <p className="mt-2 flex items-baseline gap-2">
              {section.title}
              {!section.href && (
                <span className="text-small text-muted-foreground">soon</span>
              )}
            </p>
            <p className="text-small text-muted-foreground">
              {section.description}
            </p>
          </>
        );

        return (
          <FadeIn key={section.title} index={i}>
            {/* An unfinished section is a plain div: no pointer, no hover, no
                promise of a destination. */}
            {section.href ? (
              <Link href={section.href} className="group relative block">
                {tile}
              </Link>
            ) : (
              <div className="relative opacity-60">{tile}</div>
            )}
          </FadeIn>
        );
      })}
    </div>
  );
}
