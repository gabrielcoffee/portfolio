import type { Metadata } from "next";
import { pageTitle } from "~/data/site";
import BackButton from "~/components/BackButton";
import PolaroidWall from "~/components/PolaroidWall";
import { getPictures } from "~/lib/archive";

export const metadata: Metadata = {
  title: pageTitle("Pictures"),
  description: "Day to day life pictures.",
};

export default function PicturesPage() {
  return (
    <>
      <BackButton href="/archive" />
      <PolaroidWall pictures={getPictures()} />
    </>
  );
}
