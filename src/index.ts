import "./styles/vuepoint.css";

export { default as Vuepoint } from "./components/Vuepoint.vue";
export { default } from "./plugin";
export { defaultVuepointOptions } from "./plugin";
export type {
  VuepointAnnotation,
  VuepointAnnotationTarget,
  VuepointCopyDepth,
  VuepointElementSnapshot,
  VuepointInstallOptions,
  VuepointRuntimeOptions,
  VuepointSourceContext,
} from "./types";
