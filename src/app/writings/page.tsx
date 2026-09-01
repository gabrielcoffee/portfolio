import { getAllWritings } from "~/lib/writings";
import Preview from "~/components/Preview";
import { FadeIn } from "~/components/FadeIn";
import type { Metadata } from "next";
import { pageTitle } from "~/data/site";

export const metadata: Metadata = {
  title: pageTitle("Writings"),
  description: "Articles and journal entries.",
};

export default function WritingsPage() {
  const writings = getAllWritings();

  return (
    <ul className="flex flex-col">
      {writings.map((writing, i) => (
        <FadeIn as="li" index={i} key={writing.slug}>
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
  );
}
