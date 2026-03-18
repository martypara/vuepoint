import type { VuepointAnnotationTarget } from "../types";
import { getElementLabel, getNearbyText } from "./labels";
import { captureElementSnapshot } from "./snapshot";

export function getElementSelectorSegment(
  element: HTMLElement,
  _options: { includeScopeAttributes?: boolean } = {},
): string {
  const tag = element.tagName.toLowerCase();
  const id = element.id ? `#${element.id}` : "";
  return `${tag}${id}`;
}

export function getElementPath(element: HTMLElement, maxDepth = 5): string {
  const parts: string[] = [];
  let current: HTMLElement | null = element;
  let depth = 0;

  while (current && depth < maxDepth) {
    const tag = current.tagName.toLowerCase();
    if (tag === "html" || tag === "body") break;

    parts.unshift(getElementSelectorSegment(current));
    current = current.parentElement;
    depth += 1;
  }

  return parts.join(" > ");
}

export function isVuepointTarget(target: EventTarget | null): boolean {
  if (target instanceof Element) {
    return Boolean(target.closest("[data-vuepoint-ui]"));
  }

  if (target instanceof Node && target.parentElement) {
    return Boolean(target.parentElement.closest("[data-vuepoint-ui]"));
  }

  return false;
}

export function isVuepointEvent(event: Event): boolean {
  return event.composedPath().some((entry) =>
    entry instanceof Element && Boolean(entry.closest("[data-vuepoint-ui]"))
  );
}

export function getTargetElement(clientX: number, clientY: number): HTMLElement | null {
  const element = document.elementFromPoint(clientX, clientY);
  return element instanceof HTMLElement ? element : null;
}

export function resolveAnnotationTargetElement(target: VuepointAnnotationTarget): HTMLElement | null {
  const sourceRoots = Array.from(
    document.querySelectorAll<HTMLElement>(`[data-vuepoint-loc="${CSS.escape(target.source.raw)}"]`),
  );

  const candidates = Array.from(new Set(sourceRoots.flatMap((root) => {
    const descendants = Array.from(root.querySelectorAll<HTMLElement>("*"));
    return [root, ...descendants];
  })));

  if (candidates.length <= 1) {
    return candidates[0] ?? null;
  }

  const scoredCandidates = candidates.map((element) => {
    let score = 0;

    if (getElementLabel(element) === target.element) {
      score += 5;
    }

    if (target.nearbyText && getNearbyText(element) === target.nearbyText) {
      score += 4;
    }

    if (getElementPath(element) === target.elementPath) {
      score += 2;
    }

    const snapshot = target.snapshot ? captureElementSnapshot(element) : null;
    if (snapshot && target.snapshot) {
      if (snapshot.text === target.snapshot.text) {
        score += 3;
      }

      if (snapshot.classes.join(" ") === target.snapshot.classes.join(" ")) {
        score += 1;
      }
    }

    const rectDistance = snapshot && target.snapshot
      ? Math.abs(snapshot.rect.x - target.snapshot.rect.x) + Math.abs(snapshot.rect.y - target.snapshot.rect.y)
      : Number.POSITIVE_INFINITY;

    return { element, score, rectDistance };
  });

  scoredCandidates.sort((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score;
    }

    return left.rectDistance - right.rectDistance;
  });

  return scoredCandidates[0]?.element ?? null;
}
