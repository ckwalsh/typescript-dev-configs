/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {
  ConfigArray,
  InfiniteDepthConfigWithExtends,
} from 'typescript-eslint';
import tseslint from 'typescript-eslint';

export interface OptionsBase {
  enable: boolean;
}

export const DEFAULT_OPTIONS_BASE: OptionsBase = {
  enable: true,
};

export type PartialOptions<O> = Partial<O> | boolean;

export function resolveOptions<O extends OptionsBase>(
  partial: PartialOptions<O>,
  defaultOptions: O,
): O {
  switch (partial) {
    case true:
      return { ...defaultOptions, enable: true };
    case false:
      return { ...defaultOptions, enable: false };
    default:
      return {
        ...defaultOptions,
        ...partial,
      };
  }
}

export function prefixConfigNames(
  category: string,
  configs: InfiniteDepthConfigWithExtends,
): ConfigArray {
  const flatConfigs = tseslint.config(configs);

  return flatConfigs.map((config, idx) => {
    const name = config.name ?? idx.toString(10);

    return { ...config, name: `${category}/${name}` };
  });
}
