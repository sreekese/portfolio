export function siteUrl(): URL {
  const value = process.env.SITE_URL || "http://localhost:3000";
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol))
    throw new Error("SITE_URL must be an HTTP(S) origin");
  return new URL(url.origin);
}
