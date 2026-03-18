import type { VuepointAnnotationTarget } from "../types";
import { getElementLabel } from "./labels";

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
  const candidates = Array.from(
    document.querySelectorAll<HTMLElement>(`[data-vuepoint-loc="${CSS.escape(target.source.raw)}"]`),
  );

  const matchingPath = candidates.find((element) => getElementPath(element) === target.elementPath);
  if (matchingPath) return matchingPath;

  const matchingLabel = candidates.find((element) => getElementLabel(element) === target.element);
  if (matchingLabel) return matchingLabel;

  return candidates[0] ?? null;
}
