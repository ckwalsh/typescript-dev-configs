/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'node:path';
import type { Options } from 'tsup';

import {
  ExportsOptions,
  OPTIONS_BY_PLATFORM,
  PlatformExportsOptions,
} from './options.ts';
import { getExportsEntryFromPkg } from './package.ts';

function resolvePlatformExportsOptions(
  options: PlatformExportsOptions,
): Options | null {
  const { platform } = options;

  const configPlatformOptions = options.configPlatformOptions[platform] ?? {};

  const { entry } = {
    entry: getExportsEntryFromPkg(options.pkg),
    ...options.configBaseOptions,
    ...configPlatformOptions,
    ...options.cliOptions,
  };

  if (entry === undefined) {
    return null;
  }

  return {
    ...options.environmentOptions,
    format: ['esm'],
    ...OPTIONS_BY_PLATFORM[platform],

    name: platform,

    dts: {
      compilerOptions: {
        composite: false,
      },
    },
    sourcemap: true,
    metafile: true,

    ...options.configBaseOptions,

    tsconfig: path.join(options.rootDir, 'src', `tsconfig.${platform}.json`),
    outDir: path.join(options.rootDir, 'dist', platform, 'src'),

    ...(options.configPlatformOptions[platform] ?? {}),

    entry,

    ...options.cliOptions,
    platform,
  };
}

export function resolveExportsOptions(options: ExportsOptions): Options[] {
  return options.platforms
    .map((platform) => {
      return resolvePlatformExportsOptions({
        ...options,
        platform,
      });
    })
    .filter((opt): opt is Options => opt !== null);
}
