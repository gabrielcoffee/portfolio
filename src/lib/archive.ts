import fs from "fs";
import path from "path";
import { imageSize } from "~/lib/image-size";

const EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const picturesDirectory = path.join(
  process.cwd(),
  "public",
  "archive",
  "pictures",
);

/* Stands in for a photo whose header would not parse, so one odd file cannot
   collapse the rail. */
const FALLBACK_SIZE = { width: 1200, height: 900 };

export interface Picture {
  src: string;
  title: string;
  year?: string;
  width: number;
  height: number;
}

/* Filenames are the metadata: an optional `YYYY-` prefix is the year, the rest
   becomes the caption. `2019-summer-in-rio.jpg` -> "summer in rio", 2019. */
function parseName(file: string): { title: string; year?: string } {
  const name = path.basename(file, path.extname(file));
  const [, year, rest] = /^(\d{4})-(.+)$/.exec(name) ?? [];

  return {
    title: (rest ?? name).replace(/-/g, " "),
    year,
  };
}

export function getPictures(): Picture[] {
  if (!fs.existsSync(picturesDirectory)) return [];

  return fs
    .readdirSync(picturesDirectory)
    .filter((file) => EXTENSIONS.includes(path.extname(file).toLowerCase()))
    .map((file) => ({
      // Filenames may hold spaces, which are not legal in a URL path.
      src: `/archive/pictures/${encodeURIComponent(file)}`,
      ...parseName(file),
      ...(imageSize(path.join(picturesDirectory, file)) ?? FALLBACK_SIZE),
    }))
    .sort((a, b) => {
      if (a.year !== b.year) return (b.year ?? "").localeCompare(a.year ?? "");
      return a.title.localeCompare(b.title);
    });
}
