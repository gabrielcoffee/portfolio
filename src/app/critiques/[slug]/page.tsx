import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getCritiqueBySlug, getAllCritiqueSlugs } from "~/lib/critiques";
import { mdxComponents } from "~/components/mdx";
import StarRating from "~/components/StarRating";
import BackButton from "~/components/BackButton";
import PageHeader from "~/components/PageHeader";
import type { Metadata } from "next";
import { pageTitle } from "~/data/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllCritiqueSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { metadata } = getCritiqueBySlug(slug);
  return {
    title: pageTitle(metadata.title),
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={metadata.image}
        alt={metadata.title}
        className="mb-wide aspect-square w-cover rounded-lg object-cover"
      />
      <PageHeader
        title={metadata.title}
        subtitle={
          <span className="flex items-center gap-snug">
            <StarRating rating={metadata.rating} />
            <span className="capitalize">{metadata.type}</span>
            <span>· {metadata.creator}</span>
            <span>· {readTime} min read</span>
          </span>
        }
      />
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
