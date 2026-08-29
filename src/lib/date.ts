/* Frontmatter dates are calendar days ("2026-02-08"), not instants.

   `new Date("2026-02-08")` reads that as UTC midnight, and toLocaleDateString
   then renders it in the local zone — so anywhere west of Greenwich the day
   lands on the one before. Building the date from its parts pins it to local
   midnight instead, which formats back as the day that was written, in every
   timezone. That also keeps server and browser agreeing, so the rendered date
   survives hydration. */
function parseCalendarDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  if (year && month && day) return new Date(year, month - 1, day);
  // Not a plain Y-M-D: hand it to the parser and take what it gives.
  return new Date(value);
}

export function formatDate(value: string, options: Intl.DateTimeFormatOptions) {
  return parseCalendarDate(value).toLocaleDateString("en-US", options);
}
