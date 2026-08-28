import HomeContent from "~/components/HomeContent";
import { getAllWritings } from "~/lib/writings";
import { getAllCritiques } from "~/lib/critiques";

export default function Home() {
  const writings = getAllWritings().slice(0, 3);
  const critiques = getAllCritiques().slice(0, 3);

  return <HomeContent writings={writings} critiques={critiques} />;
}
