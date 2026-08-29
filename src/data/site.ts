export const site = {
  name: "Gabriel Fernandes Pereira",
  fullName: "Gabriel Fernandes Pereira",
  description: "Software Engineer",
  instagram: "https://www.instagram.com/fernandesworks",
} as const;

/* "Journal" -> "Journal — Gabriel Pereira" */
export function pageTitle(page: string) {
  return `${page} - ${site.name}`;
}
