import type { VuepointSourceContext } from "../types";

const LOC_ATTR = "data-vuepoint-loc";
const PLUGIN_MARKER = 'meta[name="vuepoint-vite-plugin"]';

interface VuepointSourceElement extends HTMLElement {
  __vnode?: {
    props?: Record<string, unknown>;
  };
}

let hasWarnedMissingPlugin = false;
let hasWarnedMissingLocation = false;

function parseRawLocation(raw: string): VuepointSourceContext | null {
  const match = raw.match(/^(.*):(\d+):(\d+)$/);
  if (!match) return null;

  const [, file, line, column] = match;
  return {
    file,
    line: Number(line),
    column: Number(column),
    raw,
  };
}

function getPluginMarkerPresent(): boolean {
  return typeof document !== "undefined" && Boolean(document.querySelector(PLUGIN_MARKER));
}

function warnMissingPlugin(): void {
  if (hasWarnedMissingPlugin) return;

  hasWarnedMissingPlugin = true;
  console.warn(
    "Vuepoint source mapping is missing. Add the Vuepoint Vite plugin to enable exact file/line/column capture.",
  );
}

function warnMissingLocation(): void {
  if (hasWarnedMissingLocation) return;

  hasWarnedMissingLocation = true;
  console.warn(
    "Vuepoint could not find source metadata for this element. Make sure the element is rendered from a Vue SFC transformed by the Vuepoint Vite plugin.",
  );
}

function readSourceFromElement(element: HTMLElement): VuepointSourceContext | null {
  const vnodeRaw = (element as VuepointSourceElement).__vnode?.props?.__vuepoint_loc;
  if (typeof vnodeRaw === "string") {
    const parsed = parseRawLocation(vnodeRaw);
    if (parsed) return parsed;
  }

  const attrRaw = element.getAttribute(LOC_ATTR);
  if (attrRaw) {
    const parsed = parseRawLocation(attrRaw);
    if (parsed) return parsed;
  }

  return null;
}

export function getSourceContext(element: HTMLElement): VuepointSourceContext | null {
  let current: HTMLElement | null = element;

  while (current) {
    const source = readSourceFromElement(current);
    if (source) return source;
    current = current.parentElement;
  }

  if (!getPluginMarkerPresent()) {
    warnMissingPlugin();
    return null;
  }

  warnMissingLocation();
  return null;
}
