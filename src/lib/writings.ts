import fs from "fs";
import path from "path";
import matter from "gray-matter";

const writingsDirectory = path.join(process.cwd(), "src", "content", "writings");

/* The folder a file sits in is its type — no frontmatter field to forget. */
export const WRITING_TYPES = ["article", "journal"] as const;
export type WritingType = (typeof WRITING_TYPES)[number];

const FOLDERS: Record<WritingType, string> = {
  article: "articles",
  journal: "journal",
};

export interface WritingMetadata {
  title: string;
  description: string;
  date: string;
  slug: string;
  type: WritingType;
}

export interface Writing {
  metadata: WritingMetadata;
  content: string;
}

interface WritingFile {
  type: WritingType;
  slug: string;
  filePath: string;
}

/* Every .mdx under the type folders, as {type, slug, path}. The route is flat
   (/writings/[slug]), so a slug reused across folders would make two files
   fight over one URL — louder to fail here than to serve whichever won. */
function listFiles(): WritingFile[] {
  const files: WritingFile[] = [];
  const seen = new Map<string, string>();

  for (const type of WRITING_TYPES) {
    const dir = path.join(writingsDirectory, FOLDERS[type]);
    if (!fs.existsSync(dir)) continue;

    for (const fileName of fs.readdirSync(dir)) {
      if (path.extname(fileName) !== ".mdx") continue;

      const slug = path.basename(fileName, ".mdx");
      const filePath = path.join(dir, fileName);
      const clash = seen.get(slug);
      if (clash) {
        throw new Error(
          `Duplicate writing slug "${slug}": ${clash} and ${filePath} both want /writings/${slug}.`,
        );
      }

      seen.set(slug, filePath);
      files.push({ type, slug, filePath });
    }
  }

  return files;
}

function read({ type, slug, filePath }: WritingFile): Writing {
  const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
  // Folder and filename win over frontmatter, so the two can never disagree.
  return {
    metadata: { ...(data as WritingMetadata), slug, type },
    content,
  };
}

export function getAllWritings(): WritingMetadata[] {
  return listFiles()
    .map((file) => read(file).metadata)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getWritingBySlug(slug: string): Writing {
  const file = listFiles().find((f) => f.slug === slug);
  if (!file) throw new Error(`No writing found for slug "${slug}".`);
  return read(file);
}

export function getAllWritingSlugs(): string[] {
  return listFiles().map((f) => f.slug);
}
