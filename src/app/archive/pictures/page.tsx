import type { Metadata } from "next";
import { pageTitle } from "~/data/site";
import BackButton from "~/components/BackButton";
import Filmstrip from "~/components/Filmstrip";
import { getPictures } from "~/lib/archive";

export const metadata: Metadata = {
  title: pageTitle("Pictures"),
  description: "Day to day life pictures.",
};

export default function PicturesPage() {
  return (
    <>
      <BackButton href="/archive" />
      <Filmstrip pictures={getPictures()} />
    </>
  );
}
