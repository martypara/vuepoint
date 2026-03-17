import test from "node:test";
import assert from "node:assert/strict";
import { vuepoint } from "../.test-dist/testing.js";

test("vuepoint vite plugin injects relative source locations", async () => {
  const plugin = vuepoint();
  const source = `<template><div class="card"><span>Revenue</span></div></template>`;
  const id = `${process.cwd()}/src/dev/App.vue`;

  const result = await plugin.transform.call({}, source, id);

  assert.equal(typeof result?.code, "string");
  assert.match(result.code, /data-vuepoint-loc="src\/dev\/App\.vue:1:11"/);
  assert.match(result.code, /data-vuepoint-loc="src\/dev\/App\.vue:1:29"/);
});

test("vuepoint vite plugin marks index html once", () => {
  const plugin = vuepoint();
  const html = "<html><head></head><body></body></html>";
  const transformed = plugin.transformIndexHtml(html);

  assert.match(transformed, /meta name="vuepoint-vite-plugin"/);
  assert.equal(plugin.transformIndexHtml(transformed), transformed);
});
