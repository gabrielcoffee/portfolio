import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visitors — Gabriel Pereira",
  description: "Sign the guestbook.",
};

export default function VisitorsPage() {
  return (
    <>
      <h1 className="mb-4 font-serif text-big font-medium">Visitors</h1>
      <p className="mb-8 text-small text-muted-foreground">
        Sign the guestbook!
      </p>
      <div className="rounded-lg border border-border p-8 text-center">
        <p className="text-muted-foreground">Guestbook coming soon.</p>
        <p className="mt-2 text-small text-muted-foreground">
          Sign in with GitHub to leave a message.
        </p>
      </div>
    </>
  );
}
