/* `new Date("2026-02-08")` parses as UTC midnight, so west of Greenwich the
   day renders as the one before. Building from the parts pins it to local
   midnight, which also keeps server and browser agreeing through hydration. */
function parseCalendarDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  if (year && month && day) return new Date(year, month - 1, day);
  return new Date(value);
}

export function formatDate(value: string, options: Intl.DateTimeFormatOptions) {
  return parseCalendarDate(value).toLocaleDateString("en-US", options);
}
