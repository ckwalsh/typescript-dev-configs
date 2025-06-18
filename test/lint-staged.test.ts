/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { expect, test } from '@jest/globals';

import { defineConfig } from '../src/lint-staged.ts';

test('default', () => {
  expect(defineConfig).not.toThrow();
});
