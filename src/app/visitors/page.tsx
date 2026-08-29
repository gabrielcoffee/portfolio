import type { Metadata } from "next";
import { pageTitle } from "~/data/site";
import PageHeader from "~/components/PageHeader";

export const metadata: Metadata = {
  title: pageTitle("Visitors"),
  description: "Sign the guestbook.",
};

export default function VisitorsPage() {
  return (
    <>
      <PageHeader title="Visitors" subtitle="Sign the guestbook!" />
      <div className="rounded-lg border border-border p-section text-center">
        <p className="text-muted-foreground">Guestbook coming soon.</p>
        <p className="mt-snug text-small text-muted-foreground">
          Sign in with GitHub to leave a message.
        </p>
      </div>
    </>
  );
}
