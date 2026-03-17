import type { VuepointCopyDepth } from "../types";

export function normalizeCopyDepth(
  copyDepth: VuepointCopyDepth | undefined,
): VuepointCopyDepth {
  return copyDepth ?? "standard";
}

export function isDetailedCopyDepth(copyDepth: VuepointCopyDepth): boolean {
  return copyDepth === "detailed";
}
