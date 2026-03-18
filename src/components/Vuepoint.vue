<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { CSSProperties } from "vue";
import IconClose from "./icons/IconClose.vue";
import IconCopy from "./icons/IconCopy.vue";
import IconCheck from "./icons/IconCheck.vue";
import IconLock from "./icons/IconLock.vue";
import IconOpen from "./icons/IconOpen.vue";
import IconPencil from "./icons/IconPencil.vue";
import IconInfo from "./icons/IconInfo.vue";
import IconTrash from "./icons/IconTrash.vue";
import IconSettings from "./icons/IconSettings.vue";
import { useVuepointOverlay } from "../composables/useVuepointOverlay";
import {
  isDetailedCopyDepth as isDetailedCopyDepthValue,
  normalizeCopyDepth,
} from "../core/copyDepth";
import { resolveVuepointEnabled } from "../core/enabled";
import { VUEPOINT_OPTIONS_KEY, defaultVuepointOptions } from "../plugin";
import type { VuepointRuntimeOptions } from "../types";

const props = withDefaults(defineProps<Partial<VuepointRuntimeOptions>>(), {
  enabled: undefined,
  autoMount: undefined,
  componentName: undefined,
  storageKey: undefined,
  accentColor: undefined,
  zIndex: undefined,
  copyDepth: undefined,
  clearOnCopy: undefined,
  cursor: undefined,
});

const injectedOptions =
  inject(VUEPOINT_OPTIONS_KEY, defaultVuepointOptions) ?? defaultVuepointOptions;

const options = computed<VuepointRuntimeOptions>(() => ({
  ...injectedOptions,
  ...Object.fromEntries(
    Object.entries(props).filter(([, value]) => value !== undefined),
  ),
  enabled: resolveVuepointEnabled(props.enabled ?? injectedOptions.enabled),
  copyDepth: normalizeCopyDepth(props.copyDepth ?? injectedOptions.copyDepth),
}) as VuepointRuntimeOptions);

const textareaRef = ref<HTMLTextAreaElement | null>(null);
const hoverLabelRef = ref<HTMLDivElement | null>(null);
const hoverLabelSize = ref({ width: 0, height: 0 });
const draftShakeClass = ref("");
let draftShakeTimer: number | null = null;
const pressedToolbarButton = ref<"copy" | "clear" | "freeze" | null>(null);
let pressedToolbarButtonTimer: number | null = null;
const copied = ref(false);
let copiedTimer: number | null = null;
const settingsOpen = ref(false);
const portalTarget = ref<string | HTMLElement>("body");
const HOVER_LABEL_VIEWPORT_INSET = 10;
const HOVER_LABEL_CURSOR_GAP = 12;
const OPEN_DIALOG_SELECTOR = [
  "[role='dialog'][data-state='open']",
  "[role='alertdialog'][data-state='open']",
  "[aria-modal='true'][data-state='open']",
].join(", ");
let portalTargetObserver: MutationObserver | null = null;
let portalTargetFrame: number | null = null;

const isDetailedCopyDepth = computed(
  () => isDetailedCopyDepthValue(copyDepth.value),
);

const {
  active,
  annotations,
  canSubmitDraft,
  clearOnCopy,
  copyActionLabel,
  copyDepth,
  cursorPoint,
  blockedDraftClickCount,
  draftComment,
  draftMarkerStyle,
  draftOpen,
  draftPlacementClass,
  draftQuote,
  draftTitle,
  hoveredAnnotation,
  hoveredAnnotationId,
  hoveredAnnotationPreviewPlacementClass,
  hoveredAnnotationPreviewStyle,
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
} = useVuepointOverlay(options);

watch([draftOpen, active], () => {
  settingsOpen.value = false;
});

watch(draftOpen, async (nextValue) => {
  if (!nextValue) {
    draftShakeClass.value = "";
    if (draftShakeTimer !== null) {
      window.clearTimeout(draftShakeTimer);
      draftShakeTimer = null;
    }
    return;
  }

  await nextTick();
  textareaRef.value?.focus();
  textareaRef.value?.select();
});

watch(blockedDraftClickCount, async (nextValue) => {
  if (!draftOpen.value) return;
  if (nextValue === 0) return;

  draftShakeClass.value = "";
  await nextTick();
  draftShakeClass.value = nextValue % 2 === 0
    ? "vuepoint__draft-shake--b"
    : "vuepoint__draft-shake--a";

  if (draftShakeTimer !== null) {
    window.clearTimeout(draftShakeTimer);
  }

  draftShakeTimer = window.setTimeout(() => {
    draftShakeClass.value = "";
    draftShakeTimer = null;
  }, 220);
});

function updateHoverLabelSize() {
  hoverLabelSize.value = {
    width: hoverLabelRef.value?.offsetWidth ?? 0,
    height: hoverLabelRef.value?.offsetHeight ?? 0,
  };
}

watch([hoverLabel, hoverRect], async () => {
  await nextTick();
  updateHoverLabelSize();
});

const hoverLabelStyle = computed<CSSProperties>(() => {
  if (typeof window === "undefined") {
    return {
      position: "fixed",
      left: `${cursorPoint.value.x}px`,
      top: `${cursorPoint.value.y}px`,
      zIndex: options.value.zIndex,
    };
  }

  const { width, height } = hoverLabelSize.value;
  const maxLeft = window.innerWidth - HOVER_LABEL_VIEWPORT_INSET - width;
  const maxTop = window.innerHeight - HOVER_LABEL_VIEWPORT_INSET - height;

  let left = cursorPoint.value.x;
  let top = cursorPoint.value.y - HOVER_LABEL_CURSOR_GAP - height;

  if (left > maxLeft) {
    left = cursorPoint.value.x - width;
  }

  if (top < HOVER_LABEL_VIEWPORT_INSET) {
    top = cursorPoint.value.y + HOVER_LABEL_CURSOR_GAP;
  }

  left = Math.min(Math.max(HOVER_LABEL_VIEWPORT_INSET, left), Math.max(HOVER_LABEL_VIEWPORT_INSET, maxLeft));
  top = Math.min(Math.max(HOVER_LABEL_VIEWPORT_INSET, top), Math.max(HOVER_LABEL_VIEWPORT_INSET, maxTop));

  return {
    position: "fixed",
    left: `${left}px`,
    top: `${top}px`,
    zIndex: options.value.zIndex,
  };
});

function handleCopy() {
  copyMarkdown();
  settingsOpen.value = false;
  copied.value = true;
  if (copiedTimer !== null) window.clearTimeout(copiedTimer);
  copiedTimer = window.setTimeout(() => {
    copied.value = false;
    copiedTimer = null;
  }, 1500);
}

function toggleCopyDepth() {
  copyDepth.value = isDetailedCopyDepth.value ? "standard" : "detailed";
}

function handleClear() {
  clearAnnotations();
  settingsOpen.value = false;
}

function handleFreeze() {
  togglePageFreeze();
  settingsOpen.value = false;
}

function pressToolbarButton(button: "copy" | "clear" | "freeze") {
  pressedToolbarButton.value = button;

  if (pressedToolbarButtonTimer !== null) {
    window.clearTimeout(pressedToolbarButtonTimer);
  }

  pressedToolbarButtonTimer = window.setTimeout(() => {
    if (pressedToolbarButton.value === button) {
      pressedToolbarButton.value = null;
    }
    pressedToolbarButtonTimer = null;
  }, 140);
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  const editableRoot = target.closest("input, textarea, select, [contenteditable='true']");
  return Boolean(editableRoot) || target.isContentEditable;
}

function handleShortcutKeydown(event: KeyboardEvent) {
  if (!options.value.enabled) return;

  const key = event.key.toLowerCase();

  if (event.metaKey && event.shiftKey && !event.ctrlKey && !event.altKey && key === "v") {
    event.preventDefault();
    event.stopPropagation();
    settingsOpen.value = false;
    setActive(!active.value);
    return;
  }

  if (!active.value) return;
  if (isEditableTarget(event.target)) return;
  if (event.metaKey || event.ctrlKey || event.altKey) return;

  if (key === "c") {
    if (annotations.value.length === 0) return;
    event.preventDefault();
    event.stopPropagation();
    pressToolbarButton("copy");
    handleCopy();
    return;
  }

  if (key === "x") {
    if (annotations.value.length === 0) return;
    event.preventDefault();
    event.stopPropagation();
    pressToolbarButton("clear");
    handleClear();
    return;
  }

  if (key === "f") {
    event.preventDefault();
    event.stopPropagation();
    pressToolbarButton("freeze");
    handleFreeze();
  }
}

function handleDraftTextareaKeydown(event: KeyboardEvent) {
  if (event.key !== "Enter") return;
  if (event.shiftKey) return;
  if (!canSubmitDraft.value) return;

  event.preventDefault();
  event.stopPropagation();
  addAnnotation();
}

function resolvePortalTarget() {
  if (typeof document === "undefined") {
    portalTarget.value = "body";
    return;
  }

  const openDialogs = Array.from(
    document.querySelectorAll<HTMLElement>(OPEN_DIALOG_SELECTOR),
  ).filter((element) => element.isConnected);

  portalTarget.value = openDialogs.at(-1) ?? "body";
}

function schedulePortalTargetUpdate() {
  if (portalTargetFrame !== null) {
    window.cancelAnimationFrame(portalTargetFrame);
  }

  portalTargetFrame = window.requestAnimationFrame(() => {
    resolvePortalTarget();
    portalTargetFrame = null;
  });
}

onMounted(() => {
  resolvePortalTarget();

  if (typeof document !== "undefined") {
    portalTargetObserver = new MutationObserver(() => {
      schedulePortalTargetUpdate();
    });

    portalTargetObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["aria-modal", "data-state", "open", "role"],
    });
  }

  document.addEventListener("keydown", handleShortcutKeydown, true);
  window.addEventListener("resize", updateHoverLabelSize);
});

onBeforeUnmount(() => {
  if (draftShakeTimer !== null) {
    window.clearTimeout(draftShakeTimer);
  }
  if (pressedToolbarButtonTimer !== null) {
    window.clearTimeout(pressedToolbarButtonTimer);
  }
  if (copiedTimer !== null) {
    window.clearTimeout(copiedTimer);
  }
  if (portalTargetFrame !== null) {
    window.cancelAnimationFrame(portalTargetFrame);
  }
  portalTargetObserver?.disconnect();
  document.removeEventListener("keydown", handleShortcutKeydown, true);
  window.removeEventListener("resize", updateHoverLabelSize);
});
</script>

<template>
  <Teleport :to="portalTarget">
    <div
      v-if="options.enabled"
      class="vuepoint"
      data-vuepoint-ui
      :style="{ '--vuepoint-accent': options.accentColor, '--vuepoint-z': String(options.zIndex) }"
    >
      <div class="vuepoint__dock">
        <Transition name="vuepoint-panel">
          <div v-if="active" class="vuepoint__panel">
          
          <div v-if="settingsOpen" class="vuepoint__settings-row">
            <label class="vuepoint__setting-item vuepoint__setting-item--inline">
              <span>Auto-clear on copy</span>
              <button 
                type="button" 
                class="vuepoint__switch"
                :class="{ 'is-active': clearOnCopy }"
                @click.prevent="clearOnCopy = !clearOnCopy"
              >
                <span class="vuepoint__switch-thumb"></span>
              </button>
            </label>
            
            <label class="vuepoint__setting-item vuepoint__setting-item--inline">
              <span class="vuepoint__setting-label">
                Detailed output
                <div class="vuepoint__info-group">
                  <IconInfo class="vuepoint__info-icon" />
                  <div class="vuepoint__tooltip">Includes computed styles, more environment and accessibility info in the output</div>
                </div>
              </span>
              <button 
                type="button" 
                class="vuepoint__switch"
                :class="{ 'is-active': isDetailedCopyDepth }"
                @click.prevent="toggleCopyDepth"
              >
                <span class="vuepoint__switch-thumb"></span>
              </button>
            </label>
          </div>

          <div v-if="settingsOpen" class="vuepoint__panel-divider"></div>

          <div class="vuepoint__toolbar-row">
            <div class="vuepoint__toolbar-group">
              <button
                type="button"
                class="vuepoint__toolbar-btn vuepoint__toolbar-btn--primary"
                :class="{ 'is-pressed': pressedToolbarButton === 'copy', 'is-copied': copied }"
                :disabled="annotations.length === 0"
                @click="handleCopy"
              >
                <div class="vuepoint__copy-icon-wrapper">
                  <IconCopy class="vuepoint__toolbar-btn-icon-only icon-copy" />
                  <IconCheck class="vuepoint__toolbar-btn-icon-only icon-check" />
                </div>
              </button>
              <div class="vuepoint__tooltip">
                {{ copyActionLabel }} <span class="vuepoint__tooltip-shortcut">C</span>
              </div>
            </div>

            <div class="vuepoint__toolbar-group">
              <button
                type="button"
                class="vuepoint__toolbar-btn vuepoint__toolbar-btn--icon"
                :class="{ 'is-pressed': pressedToolbarButton === 'clear' }"
                :disabled="annotations.length === 0"
                @click="handleClear"
              >
                <IconTrash class="vuepoint__toolbar-btn-icon-only" />
              </button>
              <div class="vuepoint__tooltip">
                Clear annotations <span class="vuepoint__tooltip-shortcut">X</span>
              </div>
            </div>

            <div class="vuepoint__toolbar-group">
              <button
                type="button"
                class="vuepoint__toolbar-btn vuepoint__toolbar-btn--icon"
                :class="{ 'is-active': pageFrozen, 'is-pressed': pressedToolbarButton === 'freeze' }"
                @click="handleFreeze"
              >
                <IconLock class="vuepoint__toolbar-btn-icon-only" />
              </button>
              <div class="vuepoint__tooltip">
                {{ pageFrozen ? "Resume page" : "Freeze page" }} <span class="vuepoint__tooltip-shortcut">F</span>
              </div>
            </div>

            <div class="vuepoint__toolbar-group">
              <button
                type="button"
                class="vuepoint__toolbar-btn vuepoint__toolbar-btn--icon"
                :class="{ 'is-active': settingsOpen }"
                @click="settingsOpen = !settingsOpen"
              >
                <IconSettings class="vuepoint__toolbar-btn-icon-only" />
              </button>
              <div v-if="!settingsOpen" class="vuepoint__tooltip">Settings</div>
            </div>

            <div class="vuepoint__toolbar-divider"></div>

            <div class="vuepoint__toolbar-group">
              <button
                type="button"
                class="vuepoint__toolbar-btn vuepoint__toolbar-btn--icon"
                @click="setActive(false)"
              >
                <IconClose class="vuepoint__toolbar-btn-icon-only" />
              </button>
              <div class="vuepoint__tooltip">Close</div>
            </div>
          </div>

        </div>
        </Transition>

        <div class="vuepoint__launcher" :class="{ 'is-hidden': active }">
          <button
            type="button"
            class="vuepoint__button"
            aria-label="Open Vuepoint"
            :tabindex="active ? -1 : 0"
            @click="setActive(true)"
          >
            <IconOpen class="vuepoint__button-icon" />
          </button>
          <span v-if="annotations.length > 0" class="vuepoint__badge">
            {{ annotations.length }}
          </span>
        </div>
      </div>

      <div
        v-if="active && hoverRect"
        class="vuepoint__hover"
        :style="{
          left: `${hoverRect.left}px`,
          top: `${hoverRect.top}px`,
          width: `${hoverRect.width}px`,
          height: `${hoverRect.height}px`,
        }"
      ></div>

      <div
        v-if="active && hoverRect"
        ref="hoverLabelRef"
        class="vuepoint__hover-label"
        :style="hoverLabelStyle"
      >
        {{ hoverLabel }}
      </div>

      <div
        v-for="highlight in selectedHighlights"
        :key="highlight.key"
        class="vuepoint__hover vuepoint__hover--selected"
        :style="{
          left: `${highlight.rect.left}px`,
          top: `${highlight.rect.top}px`,
          width: `${highlight.rect.width}px`,
          height: `${highlight.rect.height}px`,
        }"
      />

      <TransitionGroup name="vuepoint-marker" v-if="active">
        <button
          v-for="(annotation, index) in annotations"
          :key="annotation.id"
          type="button"
          class="vuepoint__marker"
          :style="markerStyle(annotation)"
          @mouseenter="setHoveredAnnotation(annotation.id)"
          @mouseleave="setHoveredAnnotation(null)"
          @click.stop="openAnnotation(annotation)"
        >
          <IconPencil
            v-if="hoveredAnnotationId === annotation.id"
            class="vuepoint__marker-icon"
          />
          <span v-else>{{ index + 1 }}</span>
        </button>
      </TransitionGroup>

      <div
        v-if="active && hoveredAnnotation && hoveredAnnotationPreviewStyle"
        class="vuepoint__draft vuepoint__draft--preview"
        :class="hoveredAnnotationPreviewPlacementClass"
        :style="hoveredAnnotationPreviewStyle"
      >
        <div class="vuepoint__draft-preview-card">
          <p class="vuepoint__draft-label">{{ hoveredAnnotation.displayLabel ?? hoveredAnnotation.element }}</p>
          <p class="vuepoint__draft-preview-comment">{{ hoveredAnnotation.comment }}</p>
        </div>
      </div>

      <div v-if="draftOpen" class="vuepoint__draft" :class="draftPlacementClass" :style="draftMarkerStyle">
        <div class="vuepoint__draft-shake" :class="draftShakeClass">
          <div class="vuepoint__draft-card">
            <p class="vuepoint__draft-label">{{ draftTitle }}</p>
            <p v-if="draftQuote" class="vuepoint__draft-quote">"{{ draftQuote }}"</p>
            <textarea
              ref="textareaRef"
              v-model="draftComment"
              class="vuepoint__textarea"
              rows="3"
              placeholder="Describe the change"
              spellcheck="false"
              autocomplete="off"
              @keydown="handleDraftTextareaKeydown"
            />
            <div class="vuepoint__actions">
              <button
                v-if="isEditing"
                type="button"
                class="vuepoint__icon-action vuepoint__action-delete"
                @click="deleteCurrentAnnotation"
              >
                <IconTrash class="vuepoint__icon" />
              </button>
              <button type="button" class="vuepoint__action vuepoint__action--ghost" @click="resetDraftState">
                Cancel
              </button>
              <button type="button" class="vuepoint__action" :disabled="!canSubmitDraft" @click="addAnnotation">
                {{ isEditing ? "Update" : "Save" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
