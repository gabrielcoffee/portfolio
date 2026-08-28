import { getAllCritiques } from "~/lib/critiques";
import CritiquesGrid from "~/components/CritiquesGrid";
import type { Metadata } from "next";
import { pageTitle } from "~/data/site";

export const metadata: Metadata = {
  title: pageTitle("Critiques"),
  description: "Reviews of albums, books, movies, and games.",
};

export default function CritiquesPage() {
  const critiques = getAllCritiques();
  return <CritiquesGrid critiques={critiques} />;
}
