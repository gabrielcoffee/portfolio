import type { Metadata } from "next";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "Archive — Gabriel Pereira",
  description: "Photo gallery.",
};

function getArchiveImages() {
  const archiveDir = path.join(process.cwd(), "public", "archive");

  if (!fs.existsSync(archiveDir)) {
    return [];
  }

  const extensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

  return fs
    .readdirSync(archiveDir)
    .filter((file) => extensions.includes(path.extname(file).toLowerCase()))
    .map((file) => {
      const name = path.basename(file, path.extname(file)).replace(/-/g, " ");
      return { src: `/archive/${file}`, name };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export default function ArchivePage() {
  const images = getArchiveImages();

  return (
    <>
      <h1 className="mb-6 font-serif text-2xl font-medium">Archive</h1>
      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {images.map((image) => (
            <div key={image.src} className="group">
              <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                <img
                  src={image.src}
                  alt={image.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {image.name}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Drop images in <code className="text-xs">public/archive/</code> — filenames become titles (use dashes for spaces).
        </p>
      )}
    </>
  );
}
