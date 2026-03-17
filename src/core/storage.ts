import type { VuepointAnnotation } from "../types";

function isStoredAnnotation(value: unknown): value is VuepointAnnotation {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<VuepointAnnotation>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.comment === "string" &&
    typeof candidate.element === "string" &&
    typeof candidate.elementPath === "string" &&
    typeof candidate.pageUrl === "string" &&
    typeof candidate.viewport === "string" &&
    typeof candidate.timestamp === "number" &&
    typeof candidate.xPercent === "number" &&
    typeof candidate.yDoc === "number" &&
    Array.isArray(candidate.targets) &&
    candidate.targets.length > 0 &&
    !!candidate.source &&
    typeof candidate.source.file === "string" &&
    typeof candidate.source.line === "number" &&
    typeof candidate.source.column === "number" &&
    typeof candidate.source.raw === "string"
  );
}

export function readStoredAnnotations(storageKey: string): VuepointAnnotation[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isStoredAnnotation);
  } catch {
    return [];
  }
}

export function writeStoredAnnotations(
  storageKey: string,
  annotations: VuepointAnnotation[],
): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey, JSON.stringify(annotations));
}
