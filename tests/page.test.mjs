import test from "node:test";
import assert from "node:assert/strict";
import {
  getCurrentPageKey,
  normalizeAnnotationPageKey,
} from "../.test-dist/testing.js";

test("getCurrentPageKey uses origin and pathname only", () => {
  const previousWindow = globalThis.window;
  globalThis.window = {
    location: {
      origin: "http://localhost:3000",
      pathname: "/projekte/50027",
      search: "?tab=arbeiten",
      hash: "#details",
    },
  };

  assert.equal(getCurrentPageKey(), "http://localhost:3000/projekte/50027");

  globalThis.window = previousWindow;
});

test("normalizeAnnotationPageKey falls back to pageUrl origin and pathname", () => {
  assert.equal(
    normalizeAnnotationPageKey("http://localhost:3000/projekte/50027?tab=arbeiten#details"),
    "http://localhost:3000/projekte/50027",
  );
});

test("normalizeAnnotationPageKey prefers an explicit stored page key", () => {
  assert.equal(
    normalizeAnnotationPageKey(
      "http://localhost:3000/projekte/50027?tab=arbeiten#details",
      "http://localhost:3000/projekte/50027",
    ),
    "http://localhost:3000/projekte/50027",
  );
});
