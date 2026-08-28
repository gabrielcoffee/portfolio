import { getAllCritiques } from "~/lib/critiques";
import CritiquesGrid from "~/components/CritiquesGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Critiques — Gabriel Pereira",
  description: "Reviews of albums, books, movies, and games.",
};

export default function CritiquesPage() {
  const critiques = getAllCritiques();
  return <CritiquesGrid critiques={critiques} />;
}
