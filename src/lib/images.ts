/** True for values an <img> or next/image can actually load. */
export function isUsableImage(src?: string | null): src is string {
  if (!src) return false;
  return src.startsWith("/") || /^https?:\/\/\S+$/i.test(src);
}

export function isVectorImage(src: string): boolean {
  return /\.svg(\?.*)?$/i.test(src);
}

/** next/image only accepts hosts in next.config, and rejects SVG by default. */
export function canOptimize(src: string): boolean {
  if (isVectorImage(src)) return false;
  return (
    src.startsWith("/") ||
    src.startsWith("https://res.cloudinary.com/") ||
    src.startsWith("https://images.unsplash.com/")
  );
}

/** Asks Cloudinary for a sensibly sized, modern-format copy of an upload. */
export function sizedImage(src: string, width: number): string {
  if (isVectorImage(src)) return src;
  return src.replace(
    /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)/,
    `$1f_auto,q_auto,w_${width},c_limit/`,
  );
}

/** Only http(s) links are ever rendered as hrefs. */
export function safeLink(url?: string | null): string | null {
  if (!url) return null;
  return /^https?:\/\//i.test(url.trim()) ? url.trim() : null;
}

export function linkLabel(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
