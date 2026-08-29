import type { MDXComponents } from "mdx/types";
import Image from "next/image";

export const mdxComponents: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="mb-wide mt-section font-serif text-big font-medium">
      {children}
    </h1>
  ),
  // Heading levels separate by weight and color, never by a new size.
  h2: ({ children }) => (
    <h2 className="mb-base mt-section text-medium font-semibold text-foreground">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-cozy mt-wide text-medium font-medium text-foreground">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mb-snug mt-base text-medium font-medium text-muted-foreground">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="mb-base text-medium leading-[1.8] text-muted-foreground">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ href, children }) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      className="text-foreground underline decoration-muted-foreground/40 underline-offset-2 transition-colors hover:decoration-foreground"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="mb-base ml-wide list-disc space-y-tight text-medium leading-[1.8] text-muted-foreground">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-base ml-wide list-decimal space-y-tight text-medium leading-[1.8] text-muted-foreground">
      {children}
    </ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-base border-l-2 border-border pl-base font-serif italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded bg-muted px-snug py-hair text-small text-foreground">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="my-base overflow-x-auto rounded-lg bg-muted p-base text-small">
      {children}
    </pre>
  ),
  hr: () => <hr className="my-section border-border" />,
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img
      {...props}
      className="my-base rounded-lg"
      style={{
        maxWidth: "100%",
        height: "auto",
        ...((props.style as React.CSSProperties) ?? {}),
      }}
    />
  ),
};
