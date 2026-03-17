import type { VuepointAnnotation, VuepointCopyDepth } from "../types";
import { isDetailedCopyDepth } from "./copyDepth";

function appendEnvironment(
  lines: string[],
  pageUrl: string,
  viewport: string,
  copyDepth: VuepointCopyDepth,
  userAgent?: string,
  timestamp?: string,
): void {
  lines.push("# Page Feedback", "", "Environment:", `- URL: ${pageUrl}`, `- Viewport: ${viewport}`);

  if (isDetailedCopyDepth(copyDepth) && userAgent) {
    lines.push(`- User Agent: ${userAgent}`);
  }

  if (isDetailedCopyDepth(copyDepth) && timestamp) {
    lines.push(`- Timestamp: ${timestamp}`);
  }
}

function appendSnapshot(
  lines: string[],
  snapshot: NonNullable<VuepointAnnotation["snapshot"]>,
): void {
  const computedStyles = Object.entries(snapshot.computedStyles)
    .filter(([, value]) => Boolean(value))
    .map(([property, value]) => `${property}: ${value}`)
    .join(", ");

  lines.push(
    `Bounds: x=${snapshot.rect.x}, y=${snapshot.rect.y}, width=${snapshot.rect.width}, height=${snapshot.rect.height}`,
  );

  if (computedStyles) {
    lines.push(`Computed Styles: ${computedStyles}`);
  }
}

function appendTargetDetails(
  lines: string[],
  target: VuepointAnnotation["targets"][number],
  copyDepth: VuepointCopyDepth,
): void {
  lines.push(`Source: ${target.source.file}:${target.source.line}:${target.source.column}`);

  if (target.componentName) {
    lines.push(`Vue Component: ${target.componentName}`);
  }

  lines.push(`DOM Path: ${target.elementPath}`);

  if (target.nearbyText) {
    lines.push(`Context: ${target.nearbyText}`);
  }

  if (isDetailedCopyDepth(copyDepth) && target.accessibility) {
    lines.push(`Accessibility: ${target.accessibility}`);
  }

  if (isDetailedCopyDepth(copyDepth) && target.snapshot) {
    appendSnapshot(lines, target.snapshot);
  }
}

function appendSingleTargetAnnotation(
  lines: string[],
  annotation: VuepointAnnotation,
  index: number,
  copyDepth: VuepointCopyDepth,
): void {
  const [target] = annotation.targets;

  lines.push(`## ${index + 1}. ${annotation.element}`, "", `Instruction: ${annotation.comment}`, "");
  appendTargetDetails(lines, target, copyDepth);
}

function appendMultiTargetAnnotation(
  lines: string[],
  annotation: VuepointAnnotation,
  index: number,
  copyDepth: VuepointCopyDepth,
): void {
  lines.push(`## ${index + 1}. ${annotation.element}`, "", `Instruction: ${annotation.comment}`, "");

  annotation.targets.forEach((target, targetIndex) => {
    lines.push(`### ${index + 1}.${targetIndex + 1}. ${target.element}`);
    appendTargetDetails(lines, target, copyDepth);

    if (targetIndex < annotation.targets.length - 1) {
      lines.push("");
    }
  });
}

export function buildMarkdownExport(
  annotations: VuepointAnnotation[],
  pageUrl: string,
  viewport: string,
  copyDepth: VuepointCopyDepth,
  userAgent?: string,
  timestamp?: string,
): string {
  const lines: string[] = [];

  appendEnvironment(lines, pageUrl, viewport, copyDepth, userAgent, timestamp);

  if (annotations.length === 0) {
    return lines.join("\n");
  }

  lines.push("", "---", "");

  annotations.forEach((annotation, index) => {
    if (annotation.targets.length === 1) {
      appendSingleTargetAnnotation(lines, annotation, index, copyDepth);
    } else {
      appendMultiTargetAnnotation(lines, annotation, index, copyDepth);
    }

    if (index < annotations.length - 1) {
      lines.push("", "---", "");
    }
  });

  return lines.join("\n");
}
