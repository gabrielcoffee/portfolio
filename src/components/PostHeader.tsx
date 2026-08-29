import PageHeader from "~/components/PageHeader";
import { formatDate } from "~/lib/date";

interface PostHeaderProps {
  title: string;
  date: string;
  readTime: number;
}

/* A post's header is a page header whose subtitle is its metadata line. */
export default function PostHeader({ title, date, readTime }: PostHeaderProps) {
  const formattedDate = formatDate(date, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <PageHeader
      title={title}
      subtitle={`${formattedDate} · ${readTime} min read`}
    />
  );
}
