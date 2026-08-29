import HomeContent from "~/components/HomeContent";
import { getAllWritings } from "~/lib/writings";

export default function Home() {
  const allWritings = getAllWritings();
  const writings = allWritings.slice(0, 3);

  return (
    <HomeContent writings={writings} hasOlderWritings={allWritings.length > 3} />
  );
}
