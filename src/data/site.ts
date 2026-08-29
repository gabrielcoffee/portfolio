/* Single source of truth for who this site belongs to.
   Change it here and it changes everywhere. */
export const site = {
  /** Display name — the h1, and the suffix on every page title. */
  name: "Gabriel Pereira",
  /** Longer form, used where the full name reads better (browser tab, image alt). */
  fullName: "Gabriel Fernandes Pereira",
  description: "Software Engineer",
  instagram: "https://www.instagram.com/fernandesworks",
} as const;

/** "Journal" -> "Journal — Gabriel Pereira" */
export function pageTitle(page: string) {
  return `${page} — ${site.name}`;
}
