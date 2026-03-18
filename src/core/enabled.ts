function hasViteDevClient(): boolean {
  if (typeof document === "undefined") return false;
  return Boolean(document.querySelector('script[type="module"][src*="/@vite/client"]'));
}

export function isVuepointDevelopment(): boolean {
  if (hasViteDevClient()) return true;
  return typeof process !== "undefined" && process.env.NODE_ENV !== "production";
}

export function resolveVuepointEnabled(enabled: boolean | undefined): boolean {
  return isVuepointDevelopment() && enabled !== false;
}
