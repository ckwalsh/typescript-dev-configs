/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import eslint from '@eslint/js';
import type { InfiniteDepthConfigWithExtends } from 'typescript-eslint';

import type { OptionsBase, PartialOptions } from './base.ts';
import { DEFAULT_OPTIONS_BASE, resolveOptions } from './base.ts';

interface Options extends OptionsBase {
  recommended: boolean;
}

export type CoreOptions = PartialOptions<Options>;

const DEFAULT_OPTIONS: Options = {
  ...DEFAULT_OPTIONS_BASE,
  recommended: true,
};

export function coreConfig(
  partial: PartialOptions<Options>,
): InfiniteDepthConfigWithExtends {
  const options = resolveOptions(partial, DEFAULT_OPTIONS);

  if (!options.enable) {
    return [];
  }

  const rules: InfiniteDepthConfigWithExtends[] = [];

  if (options.recommended) {
    rules.push({
      name: 'recommended',
      extends: [eslint.configs.recommended],
    });
  }

  return rules;
}
