import test from "node:test";
import assert from "node:assert/strict";
import {
  isVuepointDevelopment,
  resolveVuepointEnabled,
} from "../.test-dist/testing.js";

test("vuepoint defaults to enabled outside production and disables explicitly", () => {
  const previousNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = "development";

  assert.equal(isVuepointDevelopment(), true);
  assert.equal(resolveVuepointEnabled(undefined), true);
  assert.equal(resolveVuepointEnabled(true), true);
  assert.equal(resolveVuepointEnabled(false), false);

  process.env.NODE_ENV = previousNodeEnv;
});

test("vuepoint stays disabled in production", () => {
  const previousNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";

  assert.equal(isVuepointDevelopment(), false);
  assert.equal(resolveVuepointEnabled(undefined), false);
  assert.equal(resolveVuepointEnabled(true), false);
  assert.equal(resolveVuepointEnabled(false), false);

  process.env.NODE_ENV = previousNodeEnv;
});
