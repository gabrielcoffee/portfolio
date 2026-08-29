import fs from "fs";
import path from "path";

const EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const picturesDirectory = path.join(
  process.cwd(),
  "public",
  "archive",
  "pictures",
);

export interface Picture {
  src: string;
  title: string;
  year?: string;
}

/* Filenames are the metadata: an optional `YYYY-` prefix is the year, the rest
   becomes the caption. `2019-summer-in-rio.jpg` -> "summer in rio", 2019. */
function parseName(file: string): Omit<Picture, "src"> {
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
    }))
    .sort((a, b) => {
      if (a.year !== b.year) return (b.year ?? "").localeCompare(a.year ?? "");
      return a.title.localeCompare(b.title);
    });
}
