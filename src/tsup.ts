/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'node:path';
import type { Options } from 'tsup';

import { getPlatformsFromDir } from './platforms.ts';
import { resolveBinaryOptions } from './tsup/bin.ts';
import { resolveExportsOptions } from './tsup/exports.ts';
import { ConfigOptions, ENV_OPTIONS, FullOptions } from './tsup/options.ts';

type OptionsAsyncCb = (options: Options) => Promise<Options[]>;

export function defineConfig(configOptions: ConfigOptions): OptionsAsyncCb {
  return async (cliOptions: Options) => {
    const platforms =
      configOptions.platforms ??
      (await getPlatformsFromDir(path.join(configOptions.rootDir, 'src')));

    const fullOptions: FullOptions = {
      rootDir: configOptions.rootDir,
      pkg: configOptions.pkg,
      platforms,
      environmentOptions: ENV_OPTIONS,
      configBaseOptions: configOptions.options ?? {},
      configPlatformOptions: configOptions.platformOptions ?? {},
      configBinaryOptions: configOptions.binaryOptions ?? {},
      cliOptions,
    };

    const resolvedOptions = resolveExportsOptions(fullOptions);
    const binaryOptions = resolveBinaryOptions(fullOptions);

    if (binaryOptions !== null) {
      resolvedOptions.push(binaryOptions);
    }

    return resolvedOptions;
  };
}
