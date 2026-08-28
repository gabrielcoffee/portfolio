interface PostHeaderProps {
  title: string;
  date: string;
  readTime: number;
}

export default function PostHeader({ title, date, readTime }: PostHeaderProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="mb-8">
      <h1 className="mb-2 font-serif text-big font-medium">{title}</h1>
      <p className="text-small text-muted-foreground">
        {formattedDate} · {readTime} min read
      </p>
    </div>
  );
}
