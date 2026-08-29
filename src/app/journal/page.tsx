import { getAllWritings } from "~/lib/writings";
import PostPreview from "~/components/PostPreview";
import { FadeIn } from "~/components/FadeIn";
import type { Metadata } from "next";
import { pageTitle } from "~/data/site";

export const metadata: Metadata = {
  title: pageTitle("Journal"),
  description: "Writings and thoughts.",
};

export default function JournalPage() {
  const writings = getAllWritings();

  return (
    <>
      {writings.length > 0 ? (
        <ul className="flex flex-col">
          {writings.map((writing, i) => (
            <FadeIn as="li" index={i} key={writing.slug}>
              <PostPreview
                title={writing.title}
                description={writing.description}
                date={writing.date}
                slug={writing.slug}
                showDate
              />
            </FadeIn>
          ))}
        </ul>
      ) : (
        <p className="text-small text-muted-foreground">No writings yet.</p>
      )}
    </>
  );
}
