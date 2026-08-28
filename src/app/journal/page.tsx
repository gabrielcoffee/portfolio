import { getAllWritings } from "~/lib/writings";
import PostPreview from "~/components/PostPreview";
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
      <h1 className="mb-6 font-serif text-big font-medium">Journal</h1>
      {writings.length > 0 ? (
        <ul className="flex flex-col">
          {writings.map((writing) => (
            <li key={writing.slug}>
              <PostPreview
                title={writing.title}
                description={writing.description}
                date={writing.date}
                slug={writing.slug}
                showDate
                basePath="/journal"
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-small text-muted-foreground">No writings yet.</p>
      )}
    </>
  );
}
