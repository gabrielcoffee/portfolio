import fs from "fs";
import path from "path";
import matter from "gray-matter";

const writingsDirectory = path.join(process.cwd(), "src", "content", "writings");

export interface WritingMetadata {
  title: string;
  description: string;
  date: string;
  slug: string;
}

export interface Writing {
  metadata: WritingMetadata;
  content: string;
}

export function getAllWritings(): WritingMetadata[] {
  if (!fs.existsSync(writingsDirectory)) return [];

  const fileNames = fs.readdirSync(writingsDirectory);
  const mdxFiles = fileNames.filter((f) => path.extname(f) === ".mdx");

  const writings: WritingMetadata[] = mdxFiles.map((fileName) => {
    const filePath = path.join(writingsDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);
    return data as WritingMetadata;
  });

  return writings.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getWritingBySlug(slug: string): Writing {
  const filePath = path.join(writingsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  return { metadata: data as WritingMetadata, content };
}

export function getAllWritingSlugs(): string[] {
  if (!fs.existsSync(writingsDirectory)) return [];
  return fs
    .readdirSync(writingsDirectory)
    .filter((f) => path.extname(f) === ".mdx")
    .map((f) => f.replace(/\.mdx$/, ""));
}
