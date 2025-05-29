/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { expect, test } from '@jest/globals';

import pkg from '../package.json' with { type: 'json' };
import { eslint, jest, lintStaged, prettier, tsup } from './index.ts';

test('eslint', () => {
  expect(() => eslint.defineConfig()).not.toThrow();
});

test('jest', () => {
  expect(jest.defineConfig).not.toThrow();
});

test('lintStaged', () => {
  expect(lintStaged.defineConfig).not.toThrow();
});

test('prettier', () => {
  expect(prettier.defineConfig).not.toThrow();
});

test('tsup', () => {
  expect(() => tsup.defineConfig(pkg)).not.toThrow();
});
