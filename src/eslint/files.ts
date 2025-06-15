/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const JS_FILES = ['**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs'];
export const TS_FILES = ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'];
export const TS_DECL_FILES = [
  '**/*.d.ts',
  '**/*.d.tsx',
  '**/*.d.mts',
  '**/*.d.cts',
];

export const TS_AND_JS_FILES = [...JS_FILES, ...TS_FILES, ...TS_DECL_FILES];
