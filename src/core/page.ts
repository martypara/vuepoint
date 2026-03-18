export function getCurrentPageKey(): string {
  if (typeof window === "undefined") return "";

  return `${window.location.origin}${window.location.pathname}`;
}

export function normalizeAnnotationPageKey(pageUrl: string, pageKey?: string): string {
  if (typeof pageKey === "string" && pageKey.length > 0) {
    return pageKey;
  }

  try {
    const url = new URL(pageUrl);
    return `${url.origin}${url.pathname}`;
  } catch {
    return pageUrl;
  }
}
