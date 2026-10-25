import type { Metadata } from "next";
import { pageTitle } from "~/data/site";
import BackButton from "~/components/BackButton";
import Filmstrip from "~/components/Filmstrip";
import { getPictures } from "~/lib/archive";

export const metadata: Metadata = {
  title: pageTitle("Pictures"),
  description: "Day to day life pictures.",
};

/* The one page that leaves the 40rem column: the rail wants the whole window,
   vertically centred, with nothing above it but the way back. */
export default function PicturesPage() {
  return (
    <div className="fixed inset-0 z-10 flex flex-col justify-center bg-background">
      <div className="absolute left-6 top-10">
        <BackButton href="/archive" />
      </div>
      <Filmstrip pictures={getPictures()} />
    </div>
  );
}
