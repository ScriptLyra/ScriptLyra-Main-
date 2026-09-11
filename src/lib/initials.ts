/**
 * Initials for the bookplate device, derived from a display name — so a writer
 * gets a monogram without uploading a photograph, the same way the house
 * authors carry one. One or two letters, uppercase.
 */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
