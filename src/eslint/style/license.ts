/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import licenseHeaderPlugin from 'eslint-plugin-license-header';
import type { InfiniteDepthConfigWithExtends } from 'typescript-eslint';

import type { OptionsBase, PartialOptions } from '../base.ts';
import { DEFAULT_OPTIONS_BASE, resolveOptions } from '../base.ts';

interface Options extends OptionsBase {
  header: string[];
  ignores: string[];
}

export type LicenseOptions = PartialOptions<Options>;

const DEFAULT_HEADER = [
  '/*',
  ' * Copyright (c) Cullen Walsh',
  ' *',
  ' * This source code is licensed under the MIT license found in the',
  ' * LICENSE file in the root directory of this source tree.',
  ' */',
];

const DEFAULT_OPTIONS: Options = {
  ...DEFAULT_OPTIONS_BASE,
  header: DEFAULT_HEADER,
  ignores: [],
};

export function licenseConfig(
  partial: PartialOptions<Options>,
): InfiniteDepthConfigWithExtends {
  const options = resolveOptions(partial, DEFAULT_OPTIONS);

  if (!options.enable) {
    return [];
  }

  return {
    name: 'license-header',
    ignores: options.ignores,
    plugins: {
      'license-header': licenseHeaderPlugin,
    },
    rules: {
      'license-header/header': ['error', options.header],
    },
  };
}
