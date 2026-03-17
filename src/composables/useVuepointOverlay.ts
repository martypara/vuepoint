import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { ComputedRef } from "vue";
import { createAnnotation } from "../core/annotations";
import {
  getElementLabel,
  getHoverLabel,
  getTargetElement,
  isVuepointEvent,
  isVuepointTarget,
  resolveAnnotationTargetElement,
} from "../core/dom";
import { buildMarkdownExport } from "../core/export";
import {
  disableInteractionBlock,
  disableMotionPause,
  enableInteractionBlock,
  enableMotionPause,
} from "../core/freeze";
import { getSourceContext } from "../core/source";
import { readStoredAnnotations, writeStoredAnnotations } from "../core/storage";
import type {
  VuepointAnnotation,
  VuepointAnnotationTarget,
  VuepointCopyDepth,
  VuepointRuntimeOptions,
  VuepointSourceContext,
} from "../types";

interface DraftSelectionTarget {
  element: HTMLElement;
  source: VuepointSourceContext;
}

interface HighlightBox {
  key: string;
  rect: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
}

type DraftPlacement = "top" | "bottom";

const DRAFT_VIEWPORT_MARGIN = 20;
const DRAFT_ESTIMATED_HEIGHT = 260;
const FORCE_CURSOR_ATTR = "data-vuepoint-force-cursor";

export function useVuepointOverlay(options: ComputedRef<VuepointRuntimeOptions>) {
  const active = ref(false);
  const draftOpen = ref(false);
  const draftComment = ref("");
  const scrollY = ref(0);
  const hoverRect = ref<DOMRect | null>(null);
  const hoverLabel = ref("");
  const cursorPoint = ref({ x: 0, y: 0 });
  const targetElement = ref<HTMLElement | null>(null);
  const draftPoint = ref({ xPercent: 0, yDoc: 0 });
  const draftPlacement = ref<DraftPlacement>("bottom");
  const annotations = ref<VuepointAnnotation[]>([]);
  const copyDepth = ref<VuepointCopyDepth>(options.value.copyDepth);
  const clearOnCopy = ref(options.value.clearOnCopy);
  const pageFrozen = ref(false);
  const editingAnnotationId = ref<string | null>(null);
  const hoveredAnnotationId = ref<string | null>(null);
  const previousCursor = ref<string | null>(null);
  const currentSource = ref<VuepointSourceContext | null>(null);
  const draftTargets = ref<DraftSelectionTarget[]>([]);
  const draftQuote = ref<string | undefined>(undefined);
  const pendingShiftSelection = ref(false);
  const textSelectionSuppressed = ref(false);
  const blockedDraftClickCount = ref(0);

  function readAnnotations() {
    annotations.value = readStoredAnnotations(options.value.storageKey);
  }

  function persistAnnotations() {
    writeStoredAnnotations(options.value.storageKey, annotations.value);
  }

  function resetHoverState() {
    hoverRect.value = null;
    hoverLabel.value = "";
  }

  function resetDraftState() {
    draftOpen.value = false;
    draftComment.value = "";
    editingAnnotationId.value = null;
    currentSource.value = null;
    draftTargets.value = [];
    draftQuote.value = undefined;
    pendingShiftSelection.value = false;
    textSelectionSuppressed.value = false;
    targetElement.value = null;
  }

  function applyPageCursor(cursorValue: string | null) {
    if (typeof document === "undefined") return;

    if (cursorValue === null) {
      if (previousCursor.value !== null) {
        document.body.style.cursor = previousCursor.value;
        previousCursor.value = null;
      }
      document.documentElement.removeAttribute(FORCE_CURSOR_ATTR);
      document.body.removeAttribute(FORCE_CURSOR_ATTR);
      document.documentElement.style.removeProperty("--vuepoint-page-cursor");
      return;
    }

    if (previousCursor.value === null) {
      previousCursor.value = document.body.style.cursor;
    }

    document.documentElement.setAttribute(FORCE_CURSOR_ATTR, "");
    document.body.setAttribute(FORCE_CURSOR_ATTR, "");
    document.documentElement.style.setProperty("--vuepoint-page-cursor", cursorValue);
    document.body.style.cursor = cursorValue;
  }

  function applyTextSelectionSuppression(nextValue: boolean) {
    if (typeof document === "undefined") return;

    document.documentElement.toggleAttribute("data-vuepoint-no-select", nextValue);
    document.body.toggleAttribute("data-vuepoint-no-select", nextValue);
  }

  function getDraftPlacementFromViewportY(viewportY: number): DraftPlacement {
    const availableBelow = window.innerHeight - viewportY - DRAFT_VIEWPORT_MARGIN;
    const availableAbove = viewportY - DRAFT_VIEWPORT_MARGIN;
    return availableBelow < DRAFT_ESTIMATED_HEIGHT && availableAbove > availableBelow
      ? "top"
      : "bottom";
  }

  function setDraftPointFromClick(clientX: number, clientY: number) {
    draftPoint.value = {
      xPercent: (clientX / window.innerWidth) * 100,
      yDoc: clientY + window.scrollY,
    };
    draftPlacement.value = getDraftPlacementFromViewportY(clientY);
  }

  function setActive(nextValue: boolean) {
    active.value = nextValue;
    hoveredAnnotationId.value = null;

    if (nextValue) return;

    resetDraftState();
    resetHoverState();
    if (pageFrozen.value) {
      pageFrozen.value = false;
      disableMotionPause();
      disableInteractionBlock();
    }
    textSelectionSuppressed.value = false;
  }

  function togglePageFreeze() {
    pageFrozen.value = !pageFrozen.value;

    if (pageFrozen.value) {
      enableMotionPause();
      enableInteractionBlock();
      return;
    }

    disableMotionPause();
    disableInteractionBlock();
  }

  function openDraftPopup() {
    if (editingAnnotationId.value) return;
    if (draftTargets.value.length === 0) return;

    hoveredAnnotationId.value = null;
    resetHoverState();
    draftComment.value = "";
    draftOpen.value = true;
    pendingShiftSelection.value = false;
    textSelectionSuppressed.value = false;
  }

  function triggerBlockedDraftClickFeedback() {
    blockedDraftClickCount.value += 1;
  }

  function handleMouseMove(event: MouseEvent) {
    if (!active.value || draftOpen.value) return;
    if (isVuepointTarget(event.target)) {
      resetHoverState();
      return;
    }

    const element = getTargetElement(event.clientX, event.clientY);
    cursorPoint.value = { x: event.clientX, y: event.clientY };
    if (!element) return;

    targetElement.value = element;
    hoverRect.value = element.getBoundingClientRect();
    hoverLabel.value = getHoverLabel(element);
  }

  function handleClick(event: MouseEvent) {
    if (!active.value) return;
    if (isVuepointEvent(event)) return;

    if (draftOpen.value) {
      event.preventDefault();
      event.stopPropagation();
      triggerBlockedDraftClickFeedback();
      return;
    }

    const element = getTargetElement(event.clientX, event.clientY);
    if (!element) return;

    const source = getSourceContext(element);
    if (!source) return;

    const selectionText = window.getSelection()?.toString().trim() || undefined;

    event.preventDefault();
    event.stopPropagation();

    if (event.shiftKey && !editingAnnotationId.value) {
      const hasTarget = draftTargets.value.some((entry) => entry.element === element);
      if (!hasTarget) {
        draftTargets.value = [...draftTargets.value, { element, source }];
      }

      targetElement.value = element;
      currentSource.value = source;
      pendingShiftSelection.value = true;
      textSelectionSuppressed.value = true;
      window.getSelection()?.removeAllRanges();
      if (selectionText) {
        draftQuote.value = undefined;
      }
      setDraftPointFromClick(event.clientX, event.clientY);
      return;
    }

    targetElement.value = element;
    currentSource.value = source;
    draftTargets.value = [{ element, source }];
    draftQuote.value = selectionText;
    setDraftPointFromClick(event.clientX, event.clientY);
    resetHoverState();
    draftComment.value = "";
    draftOpen.value = true;
  }

  function handleScroll() {
    scrollY.value = window.scrollY;
  }

  function handleKeyUp(event: KeyboardEvent) {
    if (event.key !== "Shift") return;
    if (!active.value) return;
    if (!pendingShiftSelection.value) return;

    openDraftPopup();
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (!active.value) return;

    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();

      const hasAnnotationState =
        draftOpen.value ||
        editingAnnotationId.value !== null ||
        draftTargets.value.length > 0 ||
        pendingShiftSelection.value;

      if (hasAnnotationState) {
        resetDraftState();
        resetHoverState();
        return;
      }

      setActive(false);
    }
  }

  function addAnnotation() {
    if (!draftComment.value.trim()) return;

    if (editingAnnotationId.value) {
      annotations.value = annotations.value.map((annotation) =>
        annotation.id === editingAnnotationId.value
          ? {
              ...annotation,
              comment: draftComment.value.trim(),
            }
          : annotation,
      );
    } else {
      if (draftTargets.value.length === 0) return;

      const annotation = createAnnotation({
        comment: draftComment.value.trim(),
        targets: draftTargets.value,
        selectedText: draftQuote.value,
        xPercent: draftPoint.value.xPercent,
        yDoc: draftPoint.value.yDoc,
      });

      annotations.value = [...annotations.value, annotation];
    }

    persistAnnotations();
    resetDraftState();
  }

  function deleteAnnotation(id: string) {
    annotations.value = annotations.value.filter((entry) => entry.id !== id);
    persistAnnotations();
  }

  function deleteCurrentAnnotation() {
    if (!editingAnnotationId.value) return;
    deleteAnnotation(editingAnnotationId.value);
    resetDraftState();
  }

  function clearAnnotations() {
    annotations.value = [];
    persistAnnotations();
    resetDraftState();
  }

  async function copyMarkdown() {
    const markdown = buildMarkdownExport(
      annotations.value,
      window.location.href,
      `${window.innerWidth}x${window.innerHeight}`,
      copyDepth.value,
      window.navigator.userAgent,
      new Date().toISOString(),
    );

    await navigator.clipboard.writeText(markdown);

    if (clearOnCopy.value) {
      clearAnnotations();
    }
  }

  function markerStyle(annotation: VuepointAnnotation) {
    return {
      left: `${annotation.xPercent}%`,
      top: `${annotation.yDoc - scrollY.value}px`,
    };
  }

  function openAnnotation(annotation: VuepointAnnotation) {
    hoveredAnnotationId.value = null;
    resetHoverState();
    targetElement.value = null;
    currentSource.value = annotation.source;
    draftTargets.value = [];
    draftQuote.value = annotation.selectedText;
    editingAnnotationId.value = annotation.id;
    draftComment.value = annotation.comment;
    draftPoint.value = {
      xPercent: annotation.xPercent,
      yDoc: annotation.yDoc,
    };
    draftPlacement.value = getDraftPlacementFromViewportY(annotation.yDoc - scrollY.value);
    draftOpen.value = true;
  }

  const draftMarkerStyle = computed(() => ({
    left: `max(150px, min(calc(100% - 150px), ${draftPoint.value.xPercent}%))`,
    top: `${draftPoint.value.yDoc - scrollY.value}px`,
  }));

  const draftPlacementClass = computed(() =>
    draftPlacement.value === "top" ? "vuepoint__draft--top" : "vuepoint__draft--bottom",
  );

  const copyActionLabel = computed(() => "Copy to clipboard");

  const editingAnnotation = computed(() =>
    editingAnnotationId.value
      ? annotations.value.find((entry) => entry.id === editingAnnotationId.value) ?? null
      : null,
  );

  const hoveredAnnotation = computed(() =>
    hoveredAnnotationId.value
      ? annotations.value.find((entry) => entry.id === hoveredAnnotationId.value) ?? null
      : null,
  );

  const draftTitle = computed(() => {
    if (editingAnnotationId.value) {
      return "Annotation";
    }

    if (draftTargets.value.length > 1) {
      return `${draftTargets.value.length} elements selected`;
    }

    return draftTargets.value.length === 1 ? "1 element selected" : "Annotation";
  });

  const isEditing = computed(() => editingAnnotationId.value !== null);
  const canSubmitDraft = computed(() => draftComment.value.trim().length > 0);

  function createHighlightBox(
    key: string,
    rect: DOMRect | NonNullable<VuepointAnnotationTarget["snapshot"]>["rect"],
  ): HighlightBox {
    return {
      key,
      rect: {
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
      },
    };
  }

  function getAnnotationHighlights(annotation: VuepointAnnotation): HighlightBox[] {
    return annotation.targets.flatMap((target, index) => {
      const liveElement = resolveAnnotationTargetElement(target);
      if (liveElement) {
        return [createHighlightBox(`${annotation.id}-${index}`, liveElement.getBoundingClientRect())];
      }

      if (target.snapshot) {
        return [createHighlightBox(`${annotation.id}-${index}`, target.snapshot.rect)];
      }

      return [];
    });
  }

  const selectedHighlights = computed<HighlightBox[]>(() => {
    void scrollY.value;

    if (!active.value) return [];

    if (isEditing.value && editingAnnotation.value) {
      return getAnnotationHighlights(editingAnnotation.value);
    }

    if (hoveredAnnotation.value) {
      return getAnnotationHighlights(hoveredAnnotation.value);
    }

    return draftTargets.value.map((target, index) =>
      createHighlightBox(`${target.source.raw}-${index}`, target.element.getBoundingClientRect()),
    );
  });

  const hoveredAnnotationPreviewStyle = computed(() => {
    if (!hoveredAnnotation.value) return null;

    return {
      left: `max(140px, min(calc(100% - 140px), ${hoveredAnnotation.value.xPercent}%))`,
      top: `${hoveredAnnotation.value.yDoc - scrollY.value}px`,
    };
  });

  const hoveredAnnotationPreviewPlacementClass = computed(() => {
    if (!hoveredAnnotation.value) return "";
    return getDraftPlacementFromViewportY(hoveredAnnotation.value.yDoc - scrollY.value) === "top"
      ? "vuepoint__draft--top"
      : "vuepoint__draft--bottom";
  });

  function setHoveredAnnotation(annotationId: string | null) {
    if (draftOpen.value) return;
    hoveredAnnotationId.value = annotationId;
  }

  watch(
    () => options.value.copyDepth,
    (nextValue) => {
      copyDepth.value = nextValue;
    },
  );

  watch(
    () => options.value.clearOnCopy,
    (nextValue) => {
      clearOnCopy.value = nextValue;
    },
  );

  watch(active, (nextValue) => {
    applyPageCursor(nextValue ? options.value.cursor : null);
  });

  watch(
    () => options.value.cursor,
    (nextValue) => {
      if (active.value) {
        applyPageCursor(nextValue);
      }
    },
  );

  watch(textSelectionSuppressed, (nextValue) => {
    applyTextSelectionSuppression(nextValue);
  });

  onMounted(() => {
    scrollY.value = window.scrollY;
    readAnnotations();
    document.addEventListener("mousemove", handleMouseMove, true);
    document.addEventListener("click", handleClick, true);
    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("keyup", handleKeyUp, true);
    window.addEventListener("scroll", handleScroll, { passive: true });
  });

  onBeforeUnmount(() => {
    disableMotionPause();
    disableInteractionBlock();
    applyPageCursor(null);
    applyTextSelectionSuppression(false);
    document.removeEventListener("mousemove", handleMouseMove, true);
    document.removeEventListener("click", handleClick, true);
    document.removeEventListener("keydown", handleKeyDown, true);
    document.removeEventListener("keyup", handleKeyUp, true);
    window.removeEventListener("scroll", handleScroll);
  });

  return {
    active,
    annotations,
    canSubmitDraft,
    clearOnCopy,
    copyActionLabel,
    copyDepth,
    cursorPoint,
    draftComment,
    draftMarkerStyle,
    draftOpen,
    draftPlacementClass,
    draftQuote,
    blockedDraftClickCount,
    draftTitle,
    hoveredAnnotation,
    hoveredAnnotationPreviewPlacementClass,
    hoveredAnnotationPreviewStyle,
    hoveredAnnotationId,
    hoverLabel,
    hoverRect,
    isEditing,
    pageFrozen,
    selectedHighlights,
    addAnnotation,
    clearAnnotations,
    copyMarkdown,
    deleteCurrentAnnotation,
    markerStyle,
    openAnnotation,
    resetDraftState,
    setHoveredAnnotation,
    setActive,
    togglePageFreeze,
  };
}
