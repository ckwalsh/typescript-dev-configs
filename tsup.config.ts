/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import pkg from './package.json' with { type: 'json' };
import * as tsup from './src/tsup.ts';

const rootDir = dirname(fileURLToPath(import.meta.url));

const config = tsup.defineConfig({
  rootDir,
  pkg,
  replaceNodeEnv: false,
});

export default config;
