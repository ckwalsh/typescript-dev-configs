/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { expect, test } from '@jest/globals';

import { defineConfig } from '../src/eslint.ts';

test('default', () => {
  expect(defineConfig).not.toThrow();
});

const NO_BEHAVIOR_KEYS = ['name', 'files', 'settings'];

const FULLY_DISABLED_OPTIONS = {
  ignore: false,
  core: false,
  typescript: false,
  style: false,
  format: false,
  node: false,
};

test('everything disabled', () => {
  const config = defineConfig(FULLY_DISABLED_OPTIONS);

  for (const c of config) {
    expect(typeof c).toBe('object');
    for (const k of Object.keys(c)) {
      expect(NO_BEHAVIOR_KEYS).toContain(k);
    }
  }
});

test('style children disabled', () => {
  const config = defineConfig({
    ...FULLY_DISABLED_OPTIONS,
    style: {
      imports: false,
      license: false,
      unused: false,
    },
  });

  for (const c of config) {
    expect(typeof c).toBe('object');
    for (const k of Object.keys(c)) {
      expect(NO_BEHAVIOR_KEYS).toContain(k);
    }
  }
});

test('style imports children disabled', () => {
  const config = defineConfig({
    ...FULLY_DISABLED_OPTIONS,
    style: {
      imports: {
        recommended: false,
        typeImports: false,
      },
      license: false,
      unused: false,
    },
  });

  for (const c of config) {
    expect(typeof c).toBe('object');
    for (const k of Object.keys(c)) {
      expect(NO_BEHAVIOR_KEYS).toContain(k);
    }
  }
});
