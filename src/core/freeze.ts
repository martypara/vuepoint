import { isVuepointTarget } from "./dom";

const MOTION_STYLE_ID = "vuepoint-motion-style";
const MOTION_ATTR = "data-vuepoint-motion-paused";
const INTERACTION_ATTR = "data-vuepoint-interactions-blocked";
const BLOCKED_EVENTS = [
  "click",
  "dblclick",
  "auxclick",
  "contextmenu",
  "mousedown",
  "mouseup",
  "pointerdown",
  "pointerup",
  "touchstart",
  "touchend",
  "submit",
  "dragstart",
  "keydown",
  "keyup",
  "keypress",
  "beforeinput",
  "input",
  "change",
  "focusin",
  "wheel",
] as const;

function getMotionStyle(): HTMLStyleElement {
  const existing = document.getElementById(MOTION_STYLE_ID);
  if (existing instanceof HTMLStyleElement) return existing;

  const style = document.createElement("style");
  style.id = MOTION_STYLE_ID;
  style.textContent = `
    html[${MOTION_ATTR}="true"] :not([data-vuepoint-ui], [data-vuepoint-ui] *),
    html[${MOTION_ATTR}="true"] :not([data-vuepoint-ui], [data-vuepoint-ui] *)::before,
    html[${MOTION_ATTR}="true"] :not([data-vuepoint-ui], [data-vuepoint-ui] *)::after {
      animation-play-state: paused !important;
      transition-duration: 0s !important;
      transition-delay: 0s !important;
      scroll-behavior: auto !important;
      caret-color: transparent !important;
    }
  `;
  document.head.appendChild(style);
  return style;
}

function blockFrozenEvent(event: Event) {
  if (isVuepointTarget(event.target)) return;

  if (event.cancelable) {
    event.preventDefault();
  }

  event.stopImmediatePropagation();
  event.stopPropagation();
}

export function enableMotionPause(): void {
  if (typeof document === "undefined") return;

  getMotionStyle();
  document.documentElement.setAttribute(MOTION_ATTR, "true");
}

export function disableMotionPause(): void {
  if (typeof document === "undefined") return;

  document.documentElement.removeAttribute(MOTION_ATTR);
}

export function enableInteractionBlock(): void {
  if (typeof document === "undefined") return;

  document.documentElement.setAttribute(INTERACTION_ATTR, "true");

  BLOCKED_EVENTS.forEach((eventName) => {
    document.addEventListener(eventName, blockFrozenEvent, true);
  });
}

export function disableInteractionBlock(): void {
  if (typeof document === "undefined") return;

  document.documentElement.removeAttribute(INTERACTION_ATTR);

  BLOCKED_EVENTS.forEach((eventName) => {
    document.removeEventListener(eventName, blockFrozenEvent, true);
  });
}
