import fs from "fs";
import path from "path";
import matter from "gray-matter";

const critiquesDirectory = path.join(process.cwd(), "src", "content", "critiques");

export type CritiqueType = "album" | "book" | "game" | "movie";

export interface CritiqueMetadata {
  title: string;
  type: CritiqueType;
  creator: string;
  image: string;
  rating: number;
  slug: string;
  date: string;
}

export interface Critique {
  metadata: CritiqueMetadata;
  content: string;
}

export function getAllCritiques(): CritiqueMetadata[] {
  if (!fs.existsSync(critiquesDirectory)) return [];

  const fileNames = fs.readdirSync(critiquesDirectory);
  const mdxFiles = fileNames.filter((f) => path.extname(f) === ".mdx");

  const critiques: CritiqueMetadata[] = mdxFiles.map((fileName) => {
    const filePath = path.join(critiquesDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);
    return data as CritiqueMetadata;
  });

  return critiques.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getCritiqueBySlug(slug: string): Critique {
  const filePath = path.join(critiquesDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  return { metadata: data as CritiqueMetadata, content };
}

export function getAllCritiqueSlugs(): string[] {
  if (!fs.existsSync(critiquesDirectory)) return [];
  return fs
    .readdirSync(critiquesDirectory)
    .filter((f) => path.extname(f) === ".mdx")
    .map((f) => f.replace(/\.mdx$/, ""));
}
