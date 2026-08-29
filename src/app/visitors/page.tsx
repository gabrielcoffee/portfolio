import type { Metadata } from "next";
import { pageTitle } from "~/data/site";
import { FadeIn } from "~/components/FadeIn";

export const metadata: Metadata = {
  title: pageTitle("Visitors"),
  description: "Sign the guestbook.",
};

export default function VisitorsPage() {
  return (
    <FadeIn
      index={0}
      className="rounded-lg border border-border p-8 text-center"
    >
      <p className="text-muted-foreground">Guestbook coming soon.</p>
      <p className="mt-2 text-small text-muted-foreground">
        Sign in with GitHub to leave a message.
      </p>
    </FadeIn>
  );
}
