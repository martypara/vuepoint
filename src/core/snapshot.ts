import type { VuepointElementSnapshot } from "../types";

const DETAILED_STYLE_PROPERTIES = [
  "display",
  "position",
  "padding",
  "margin",
  "gap",
  "align-items",
  "justify-content",
  "font-family",
  "font-size",
  "font-weight",
  "line-height",
  "color",
  "background-color",
  "border",
  "border-radius",
  "box-shadow",
] as const;

function roundRectValue(value: number): number {
  return Number(value.toFixed(2));
}

export function captureElementSnapshot(element: HTMLElement): VuepointElementSnapshot {
  const rect = element.getBoundingClientRect();
  const computedStyles = window.getComputedStyle(element);

  return {
    tagName: element.tagName.toLowerCase(),
    id: element.id || undefined,
    classes: Array.from(element.classList),
    role: element.getAttribute("role") || undefined,
    ariaLabel: element.getAttribute("aria-label") || undefined,
    href: element.getAttribute("href") || undefined,
    text: element.textContent?.trim().slice(0, 200) || undefined,
    rect: {
      x: roundRectValue(rect.x),
      y: roundRectValue(rect.y),
      width: roundRectValue(rect.width),
      height: roundRectValue(rect.height),
    },
    computedStyles: Object.fromEntries(
      DETAILED_STYLE_PROPERTIES.map((property) => [property, computedStyles.getPropertyValue(property)]),
    ),
  };
}
