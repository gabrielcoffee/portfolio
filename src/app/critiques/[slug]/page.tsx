import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getCritiqueBySlug, getAllCritiqueSlugs } from "~/lib/critiques";
import { mdxComponents } from "~/components/mdx";
import StarRating from "~/components/StarRating";
import BackButton from "~/components/BackButton";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllCritiqueSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { metadata } = getCritiqueBySlug(slug);
  return {
    title: `${metadata.title} — Gabriel Pereira`,
    description: `${metadata.type} by ${metadata.creator}`,
  };
}

export default async function CritiquePage({ params }: PageProps) {
  const { slug } = await params;
  const { metadata, content } = getCritiqueBySlug(slug);
  const readTime = Math.max(1, Math.ceil(content.split(/\s+/).length / 150));

  return (
    <>
      <BackButton href="/critiques" />
      <div className="mb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={metadata.image}
          alt={metadata.title}
          className="mb-6 aspect-square w-48 rounded-lg object-cover"
        />
        <h1 className="mb-1 font-serif text-big font-medium">
          {metadata.title}
        </h1>
        <p className="mb-2 text-small text-muted-foreground">{metadata.creator}</p>
        <div className="flex items-center gap-3">
          <StarRating rating={metadata.rating} />
          <span className="text-small capitalize text-muted-foreground">
            {metadata.type}
          </span>
          <span className="text-small text-muted-foreground">
            · {readTime} min read
          </span>
        </div>
      </div>
      <article>
        <MDXRemote
          source={content}
          components={mdxComponents}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
      </article>
    </>
  );
}
