/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { InfiniteDepthConfigWithExtends } from 'typescript-eslint';

import type { OptionsBase, PartialOptions } from '../base.ts';
import { DEFAULT_OPTIONS_BASE, resolveOptions } from '../base.ts';

interface Options extends OptionsBase {
  pattern: string;
}

export type UnusedOptions = PartialOptions<Options>;

const DEFAULT_OPTIONS: Options = {
  ...DEFAULT_OPTIONS_BASE,
  pattern: '^_',
};

export function unusedConfig(
  partial: PartialOptions<Options>,
): InfiniteDepthConfigWithExtends {
  const options = resolveOptions(partial, DEFAULT_OPTIONS);

  if (!options.enable) {
    return [];
  }

  return {
    name: 'unused-vars',
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: options.pattern,
          caughtErrorsIgnorePattern: options.pattern,
          destructuredArrayIgnorePattern: options.pattern,
          varsIgnorePattern: options.pattern,
          ignoreRestSiblings: true,
        },
      ],
    },
  };
}
