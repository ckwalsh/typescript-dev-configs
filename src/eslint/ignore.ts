/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { InfiniteDepthConfigWithExtends } from 'typescript-eslint';

import type { OptionsBase, PartialOptions } from './base.ts';
import { DEFAULT_OPTIONS_BASE, resolveOptions } from './base.ts';

interface Options extends OptionsBase {
  ignoreCoverage: boolean;
  ignoreDist: boolean;
  ignoreDocs: boolean;
  ignorePackagePaths: boolean;
  extraDirs: string[];
}

export type IgnoreOptions = PartialOptions<Options>;

const DEFAULT_OPTIONS: Options = {
  ...DEFAULT_OPTIONS_BASE,
  ignoreCoverage: true,
  ignoreDist: true,
  ignoreDocs: true,
  ignorePackagePaths: true,
  extraDirs: [],
};

export function ignoreConfig(
  partial: PartialOptions<Options>,
): InfiniteDepthConfigWithExtends {
  const options = resolveOptions(partial, DEFAULT_OPTIONS);

  if (!options.enable) {
    return [];
  }

  const dirs = [...options.extraDirs];

  if (options.ignoreCoverage) {
    dirs.push('coverage');
  }
  if (options.ignoreDist) {
    dirs.push('dist');
  }
  if (options.ignoreDocs) {
    dirs.push('docs');
  }

  let ignores: string[];

  if (options.ignorePackagePaths) {
    ignores = [
      ...dirs.map((dir) => `./${dir}`),
      ...dirs.map((dir) => `./packages/*/${dir}`),
    ];
  } else {
    ignores = dirs.map((dir) => `./${dir}`);
  }

  return {
    name: 'ignores',
    ignores,
  };
}
