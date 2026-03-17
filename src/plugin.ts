import type { App, InjectionKey } from "vue";
import { createVNode, render } from "vue";
import Vuepoint from "./components/Vuepoint.vue";
import { normalizeCopyDepth } from "./core/copyDepth";
import type { VuepointInstallOptions, VuepointRuntimeOptions } from "./types";

export const VUEPOINT_OPTIONS_KEY: InjectionKey<VuepointRuntimeOptions> =
  Symbol("vuepoint-options");

export const defaultVuepointOptions: VuepointRuntimeOptions = {
  enabled: true,
  autoMount: true,
  componentName: "Vuepoint",
  storageKey: "__vuepoint_annotations__",
  accentColor: "#42b883",
  zIndex: 2147483000,
  copyDepth: "standard",
  clearOnCopy: false,
  cursor: "crosshair",
};

function normalizeOptions(
  options: VuepointInstallOptions = {},
): VuepointRuntimeOptions {
  return {
    ...defaultVuepointOptions,
    ...options,
    copyDepth: normalizeCopyDepth(options.copyDepth),
  };
}

function mountOverlay(app: App, options: VuepointRuntimeOptions) {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (!options.enabled || !options.autoMount) return;
  if (document.querySelector("[data-vuepoint-root]")) return;

  const host = document.createElement("div");
  host.setAttribute("data-vuepoint-root", "");
  document.body.appendChild(host);

  const vnode = createVNode(Vuepoint, options as unknown as Record<string, unknown>);
  vnode.appContext = (app as App & { _context: App["_context"] })._context;
  render(vnode, host);
}

const VuepointPlugin = {
  install(app: App, options: VuepointInstallOptions = {}) {
    const resolved = normalizeOptions(options);

    app.provide(VUEPOINT_OPTIONS_KEY, resolved);
    app.component(resolved.componentName, Vuepoint);
    app.config.globalProperties.$vuepoint = resolved;

    mountOverlay(app, resolved);
  },
};

export default VuepointPlugin;
