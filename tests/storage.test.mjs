import test from "node:test";
import assert from "node:assert/strict";
import { readStoredAnnotations, writeStoredAnnotations } from "../.test-dist/testing.js";

function createStorage() {
  const data = new Map();
  return {
    getItem(key) {
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
  };
}

function createAnnotation(id) {
  return {
    id,
    comment: "Test",
    element: "div.card",
    elementPath: "div.card",
    pageUrl: "http://localhost:5173",
    viewport: "100x100",
    timestamp: Date.now(),
    xPercent: 50,
    yDoc: 200,
    source: {
      file: "src/App.vue",
      line: 1,
      column: 1,
      raw: "src/App.vue:1:1",
    },
    targets: [
      {
        element: "div.card",
        elementPath: "div.card",
        source: {
          file: "src/App.vue",
          line: 1,
          column: 1,
          raw: "src/App.vue:1:1",
        },
      },
    ],
  };
}

test("writeStoredAnnotations persists annotation arrays", () => {
  const localStorage = createStorage();
  globalThis.window = { localStorage };

  writeStoredAnnotations("__vuepoint__", [createAnnotation("1")]);

  const raw = localStorage.getItem("__vuepoint__");
  assert.ok(raw);

  const parsed = JSON.parse(raw);
  assert.ok(Array.isArray(parsed));
  assert.equal(parsed.length, 1);
  assert.equal(parsed[0].id, "1");
});

test("readStoredAnnotations returns persisted annotation arrays", () => {
  const localStorage = createStorage();
  globalThis.window = { localStorage };
  localStorage.setItem("__vuepoint__", JSON.stringify([createAnnotation("1")]));

  const annotations = readStoredAnnotations("__vuepoint__");

  assert.equal(annotations.length, 1);
  assert.equal(annotations[0].id, "1");
});
