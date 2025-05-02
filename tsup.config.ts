/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import pkg from './package.json' with { type: 'json' };
import defineTsupConfig from './src/tsup.ts';

const entry: string[] = Object.values(pkg.exports)
  .map((v) => (typeof v === 'string' ? undefined : v.source))
  .filter((v) => v !== undefined);

export default defineTsupConfig({ entry });
