import {
  getAccessibilitySummary,
  captureElementSnapshot,
  getElementLabel,
  getHoverLabel,
  getElementPath,
  getNearbyText,
  getVueComponentName,
} from "./dom";
import type {
  VuepointAnnotation,
  VuepointAnnotationTarget,
  VuepointSourceContext,
} from "../types";

export interface CreateAnnotationTargetInput {
  element: HTMLElement;
  source: VuepointSourceContext;
}

export interface CreateAnnotationInput {
  comment: string;
  targets: CreateAnnotationTargetInput[];
  selectedText?: string;
  xPercent: number;
  yDoc: number;
}

export function createAnnotationTarget({
  element,
  source,
}: CreateAnnotationTargetInput): VuepointAnnotationTarget {
  return {
    element: getElementLabel(element),
    displayLabel: getHoverLabel(element),
    elementPath: getElementPath(element),
    componentName: getVueComponentName(element, source),
    nearbyText: getNearbyText(element),
    accessibility: getAccessibilitySummary(element),
    source,
    snapshot: captureElementSnapshot(element),
  };
}

export function createAnnotation({
  comment,
  targets,
  selectedText,
  xPercent,
  yDoc,
}: CreateAnnotationInput): VuepointAnnotation {
  const annotationTargets = targets.map(createAnnotationTarget);
  const primaryTarget = annotationTargets[0];

  return {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`,
    comment,
    element:
      annotationTargets.length === 1
        ? primaryTarget.element
        : `${annotationTargets.length} elements selected`,
    displayLabel: annotationTargets.length === 1 ? primaryTarget.displayLabel : undefined,
    elementPath: primaryTarget.elementPath,
    componentName: primaryTarget.componentName,
    pageUrl: window.location.href,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    timestamp: Date.now(),
    xPercent,
    yDoc,
    selectedText,
    nearbyText:
      annotationTargets.length === 1 ? primaryTarget.nearbyText : `${annotationTargets.length} targets`,
    source: primaryTarget.source,
    snapshot: annotationTargets.length === 1 ? primaryTarget.snapshot : undefined,
    targets: annotationTargets,
  };
}
