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
      origin: "https://app.example.test",
      pathname: "/projects/alpha",
      search: "?view=summary",
      hash: "#section",
    },
  };

  assert.equal(getCurrentPageKey(), "https://app.example.test/projects/alpha");

  globalThis.window = previousWindow;
});

test("normalizeAnnotationPageKey falls back to pageUrl origin and pathname", () => {
  assert.equal(
    normalizeAnnotationPageKey("https://app.example.test/projects/alpha?view=summary#section"),
    "https://app.example.test/projects/alpha",
  );
});

test("normalizeAnnotationPageKey prefers an explicit stored page key", () => {
  assert.equal(
    normalizeAnnotationPageKey(
      "https://app.example.test/projects/alpha?view=summary#section",
      "https://app.example.test/projects/alpha",
    ),
    "https://app.example.test/projects/alpha",
  );
});
