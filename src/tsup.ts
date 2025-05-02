/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { defineConfig } from 'tsup';
import type { Options } from 'tsup';

export default function defineTsupConfig(options: Partial<Options> = {}) {
  return defineConfig({
    outDir: 'dist',
    dts: true,
    sourcemap: true,
    format: ['cjs', 'esm'],
    ...options,
  });
}
