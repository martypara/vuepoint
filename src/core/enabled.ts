export function isVuepointDevelopment(): boolean {
  return typeof process !== "undefined" && process.env.NODE_ENV !== "production";
}

export function resolveVuepointEnabled(enabled: boolean | undefined): boolean {
  return isVuepointDevelopment() && enabled !== false;
}
