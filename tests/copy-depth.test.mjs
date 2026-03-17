import test from "node:test";
import assert from "node:assert/strict";
import { isDetailedCopyDepth, normalizeCopyDepth } from "../.test-dist/testing.js";

test("normalizeCopyDepth preserves canonical values and defaults to standard", () => {
  assert.equal(normalizeCopyDepth("standard"), "standard");
  assert.equal(normalizeCopyDepth("detailed"), "detailed");
  assert.equal(normalizeCopyDepth(undefined), "standard");
});

test("isDetailedCopyDepth only matches detailed mode", () => {
  assert.equal(isDetailedCopyDepth("standard"), false);
  assert.equal(isDetailedCopyDepth("detailed"), true);
});
