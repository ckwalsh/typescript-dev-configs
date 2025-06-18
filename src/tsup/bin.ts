/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'node:path';
import type { Options } from 'tsup';

import type { BinaryOptions } from './options.ts';
import { OPTIONS_BY_PLATFORM } from './options.ts';
import { getBinEntryFromPkg } from './package.ts';

export function resolveBinaryOptions(options: BinaryOptions): Options | null {
  const entry =
    options.configBinaryOptions.entry ?? getBinEntryFromPkg(options.pkg);

  if (entry === undefined) {
    return null;
  }

  return {
    ...options.environmentOptions,
    format: ['esm'],
    ...OPTIONS_BY_PLATFORM.node,

    dts: false,
    sourcemap: true,
    metafile: true,

    ...options.configBaseOptions,
    ...(options.configPlatformOptions.node ?? {}),

    name: 'binaries',
    entry,
    tsconfig: path.join(options.rootDir, 'bin', 'tsconfig.json'),
    outDir: path.join(options.rootDir, 'dist', 'node', 'bin'),

    ...options.configBinaryOptions,
    ...options.cliOptions,

    platform: 'node',
  };
}
