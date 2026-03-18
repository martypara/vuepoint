import type { VuepointSourceContext } from "../types";
interface VuepointDomElement extends HTMLElement {
  __vueParentComponent?: {
    type?: {
      name?: string;
      __name?: string;
      displayName?: string;
    };
  };
}

const IGNORED_COMPONENT_NAMES = new Set([
  "Transition",
  "TransitionGroup",
  "KeepAlive",
  "Teleport",
  "Suspense",
  "RouterLink",
  "NuxtLink",
  "ClientOnly",
  "NuxtPage",
  "NuxtLayout",
  "NuxtIsland",
  "Primitive",
  "Slot",
  "FocusScope",
  "Presence",
  "Anonymous",
  "Component",
]);

function sanitizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function clipText(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}...`;
}

function getSimpleElementLabel(element: HTMLElement): string {
  const tag = element.tagName.toLowerCase();
  if (element.id) return `${tag}#${element.id}`;

  return tag;
}

function getComponentNameFromSource(source?: VuepointSourceContext): string | undefined {
  if (!source) return undefined;

  const match = source.file.match(/([^/\\]+)\.vue$/i);
  if (!match) return undefined;
  return `<${match[1]}>`;
}

function getElementRole(element: HTMLElement): string {
  const explicitRole = element.getAttribute("role");
  if (explicitRole) return explicitRole;

  const tag = element.tagName.toLowerCase();

  if (tag === "button") return "button";
  if (tag === "a" && element.hasAttribute("href")) return "link";
  if (tag === "select") return "combobox";
  if (tag === "textarea") return "textbox";
  if (tag === "input") {
    const type = (element.getAttribute("type") || "text").toLowerCase();
    if (type === "checkbox") return "checkbox";
    if (type === "radio") return "radio";
    if (type === "range") return "slider";
    return "textbox";
  }

  return "none";
}

function getFocusableSummary(element: HTMLElement): string {
  const tabindexAttr = element.getAttribute("tabindex");
  const tabindexValue = element.tabIndex;
  const tag = element.tagName.toLowerCase();
  const isNativelyFocusable = ["button", "input", "select", "textarea"].includes(tag) ||
    (tag === "a" && element.hasAttribute("href"));
  const isFocusable = !element.hasAttribute("disabled") && (tabindexValue >= 0 || isNativelyFocusable);

  if (tabindexAttr !== null) {
    return `focusable=${String(isFocusable)} (tabindex="${tabindexAttr}")`;
  }

  return `focusable=${String(isFocusable)}`;
}

export function getAccessibilitySummary(element: HTMLElement): string {
  const role = getElementRole(element);
  const ariaLabel = element.getAttribute("aria-label");
  const ariaLabelText = ariaLabel && ariaLabel.trim().length > 0 ? ariaLabel : "none";

  return `role="${role}" | ${getFocusableSummary(element)} | aria-label=${ariaLabelText}`;
}

export function getVueComponentName(
  element: HTMLElement,
  source?: VuepointSourceContext,
): string | undefined {
  let current: HTMLElement | null = element;
  let fallbackName: string | undefined;

  while (current) {
    const instance = (current as VuepointDomElement).__vueParentComponent;
    const type = instance?.type;
    const name = (type?.name || type?.__name || type?.displayName)?.trim();
    if (name) {
      if (!fallbackName) {
        fallbackName = `<${name}>`;
      }

      if (!IGNORED_COMPONENT_NAMES.has(name)) {
        return `<${name}>`;
      }
    }
    current = current.parentElement;
  }

  return getComponentNameFromSource(source) ?? fallbackName;
}

export function getElementLabel(element: HTMLElement): string {
  const text = sanitizeText(element.textContent ?? "");
  const ariaLabel = sanitizeText(element.getAttribute("aria-label") ?? "");
  const labelText = text || ariaLabel;
  const baseLabel = getSimpleElementLabel(element);

  if (labelText) {
    return `${baseLabel} "${clipText(labelText, 22)}"`;
  }

  return baseLabel;
}

export function getHoverLabel(element: HTMLElement): string {
  return getSimpleElementLabel(element);
}

export function getNearbyText(element: HTMLElement): string | undefined {
  const chunks: string[] = [];
  const previous = sanitizeText(element.previousElementSibling?.textContent ?? "");
  const own = sanitizeText(element.textContent ?? "");
  const next = sanitizeText(element.nextElementSibling?.textContent ?? "");

  if (previous) chunks.push(`before: ${clipText(previous, 40)}`);
  if (own) chunks.push(`self: ${clipText(own, 80)}`);
  if (next) chunks.push(`after: ${clipText(next, 40)}`);

  return chunks.length > 0 ? chunks.join(" | ") : undefined;
}
