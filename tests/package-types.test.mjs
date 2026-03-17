import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("published vite types stay structural for consumer compatibility", async () => {
  const viteTypes = await readFile(new URL("../dist/vite.d.ts", import.meta.url), "utf8");

  assert.match(viteTypes, /export interface VuepointVitePlugin/);
  assert.match(viteTypes, /export declare function vuepoint\(\): VuepointVitePlugin;/);
  assert.doesNotMatch(viteTypes, /from ['"]vite['"]/);
  assert.doesNotMatch(viteTypes, /from ['"]rollup['"]/);
  assert.doesNotMatch(viteTypes, /import\(['"]vite['"]\)/);
  assert.doesNotMatch(viteTypes, /import\(['"]rollup['"]\)/);
});
