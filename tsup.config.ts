/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import pkg from './package.json' with { type: 'json' };
import * as tsup from './src/tsup.ts';

const config = tsup.defineConfig({
  rootDir: import.meta.dirname,
  pkg,
  replaceNodeEnv: false,
});

export default config;
