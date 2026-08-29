import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getWritingBySlug, getAllWritingSlugs } from "~/lib/writings";
import { mdxComponents } from "~/components/mdx";
import BackButton from "~/components/BackButton";
import { FadeIn } from "~/components/FadeIn";
import PageHeader from "~/components/PageHeader";
import { formatDate } from "~/lib/date";
import type { Metadata } from "next";
import { pageTitle } from "~/data/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllWritingSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { metadata } = getWritingBySlug(slug);
  return {
    title: pageTitle(metadata.title),
    description: metadata.description,
  };
}

export default async function WritingPage({ params }: PageProps) {
  const { slug } = await params;
  const { metadata, content } = getWritingBySlug(slug);
  const readTime = Math.max(1, Math.ceil(content.split(/\s+/).length / 150));
  const date = formatDate(metadata.date, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <FadeIn index={0}>
        <BackButton href="/journal" />
      </FadeIn>
      <FadeIn index={1}>
        <PageHeader
          title={metadata.title}
          subtitle={`${date} · ${readTime} min read`}
        />
      </FadeIn>
      <FadeIn index={2}>
        <article>
          <MDXRemote
            source={content}
            components={mdxComponents}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </article>
      </FadeIn>
    </>
  );
}
