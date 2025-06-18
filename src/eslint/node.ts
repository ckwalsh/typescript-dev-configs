/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { InfiniteDepthConfigWithExtends } from 'typescript-eslint';

import type { OptionsBase, PartialOptions } from './base.ts';
import {
  DEFAULT_OPTIONS_BASE,
  prefixConfigNames,
  resolveOptions,
} from './base.ts';
import { TS_AND_JS_FILES } from './files.ts';

interface Options extends OptionsBase {
  nodeIsOnlyPlatform: boolean;
}

export type NodeOptions = PartialOptions<Options>;

const DEFAULT_OPTIONS: Options = {
  ...DEFAULT_OPTIONS_BASE,
  nodeIsOnlyPlatform: false,
};

export function nodeConfig(
  partial: PartialOptions<Options>,
): InfiniteDepthConfigWithExtends {
  const options = resolveOptions(partial, DEFAULT_OPTIONS);

  if (!options.enable) {
    return [];
  }

  if (options.nodeIsOnlyPlatform) {
    return [];
  }

  return prefixConfigNames('node', [
    {
      name: 'src',
      files: TS_AND_JS_FILES.map((file) => `src/${file}`),
      rules: {
        'import/no-nodejs-modules': 'error',
      },
    },
    {
      name: 'module-suffix',
      files: TS_AND_JS_FILES.map((file) =>
        file.replace(/\*[^*]*$/, '*.node\0'),
      ),
      rules: {
        'import/no-nodejs-modules': 'off',
      },
    },
  ]);
}
