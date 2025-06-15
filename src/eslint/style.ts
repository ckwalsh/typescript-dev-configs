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
import type { ImportOptions } from './style/imports.ts';
import { importsConfig } from './style/imports.ts';
import type { LicenseOptions } from './style/license.ts';
import { licenseConfig } from './style/license.ts';
import type { UnusedOptions } from './style/unused.ts';
import { unusedConfig } from './style/unused.ts';

interface Options extends OptionsBase {
  imports: ImportOptions;
  license: LicenseOptions;
  unused: UnusedOptions;
}

export type StyleOptions = PartialOptions<Options>;

const DEFAULT_OPTIONS: Options = {
  ...DEFAULT_OPTIONS_BASE,
  imports: true,
  license: true,
  unused: true,
};

export function styleConfig(
  partial: PartialOptions<Options>,
): InfiniteDepthConfigWithExtends {
  const options = resolveOptions(partial, DEFAULT_OPTIONS);

  if (!options.enable) {
    return [];
  }

  return prefixConfigNames('style', [
    importsConfig(options.imports),
    licenseConfig(options.license),
    unusedConfig(options.unused),
  ]);
}
