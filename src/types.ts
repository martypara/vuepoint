export type VuepointCopyDepth = "standard" | "detailed";

export interface VuepointSourceContext {
  file: string;
  line: number;
  column: number;
  raw: string;
}

export interface VuepointElementSnapshot {
  tagName: string;
  id?: string;
  classes: string[];
  role?: string;
  ariaLabel?: string;
  href?: string;
  text?: string;
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  computedStyles: Record<string, string>;
}

export interface VuepointAnnotationTarget {
  element: string;
  elementPath: string;
  componentName?: string;
  nearbyText?: string;
  accessibility?: string;
  source: VuepointSourceContext;
  snapshot?: VuepointElementSnapshot;
}

export interface VuepointAnnotation {
  id: string;
  comment: string;
  element: string;
  elementPath: string;
  componentName?: string;
  pageUrl: string;
  viewport: string;
  timestamp: number;
  xPercent: number;
  yDoc: number;
  selectedText?: string;
  nearbyText?: string;
  source: VuepointSourceContext;
  snapshot?: VuepointElementSnapshot;
  targets: VuepointAnnotationTarget[];
}

export interface VuepointInstallOptions {
  enabled?: boolean;
  autoMount?: boolean;
  componentName?: string;
  storageKey?: string;
  accentColor?: string;
  zIndex?: number;
  copyDepth?: VuepointCopyDepth;
  clearOnCopy?: boolean;
  cursor?: string;
}

export interface VuepointRuntimeOptions extends Omit<Required<VuepointInstallOptions>, "copyDepth"> {
  copyDepth: VuepointCopyDepth;
}
