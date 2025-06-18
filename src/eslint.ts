/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import tseslint from 'typescript-eslint';
import type { InfiniteDepthConfigWithExtends } from 'typescript-eslint';

import { prefixConfigNames } from './eslint/base.ts';
import type { CoreOptions } from './eslint/core.ts';
import { coreConfig } from './eslint/core.ts';
import { JS_FILES, TS_AND_JS_FILES } from './eslint/files.ts';
import type { FormatOptions } from './eslint/format.ts';
import { formatConfig } from './eslint/format.ts';
import type { IgnoreOptions } from './eslint/ignore.ts';
import { ignoreConfig } from './eslint/ignore.ts';
import type { NodeOptions } from './eslint/node.ts';
import { nodeConfig } from './eslint/node.ts';
import type { StyleOptions } from './eslint/style.ts';
import { styleConfig } from './eslint/style.ts';
import type { TypescriptOptions } from './eslint/typescript.ts';
import {
  typecheckDisableConfig,
  typescriptConfig,
} from './eslint/typescript.ts';

export interface SimpleOptions {
  ignore: IgnoreOptions;
  core: CoreOptions;
  typescript: TypescriptOptions;
  style: StyleOptions;
  format: FormatOptions;
  node: NodeOptions;
  extraRules: Partial<ExtraRules>;
}

interface ExtraRules {
  preIgnore: InfiniteDepthConfigWithExtends[];
  postIgnore: InfiniteDepthConfigWithExtends[];
  tsAndJs: InfiniteDepthConfigWithExtends[];
  jsOnly: InfiniteDepthConfigWithExtends[];
  preFormat: InfiniteDepthConfigWithExtends[];
  postFormat: InfiniteDepthConfigWithExtends[];
}

const DEFAULT_OPTIONS: SimpleOptions = {
  ignore: true,
  core: true,
  typescript: true,
  style: true,
  format: true,
  node: true,
  extraRules: {},
};

//////////////////////////////////////

export function defineConfig(
  partial: Partial<SimpleOptions> = {},
): tseslint.ConfigArray {
  const options: SimpleOptions = { ...DEFAULT_OPTIONS, ...partial };

  return tseslint.config([
    prefixConfigNames('preIgnore', options.extraRules.preIgnore ?? []),
    ignoreConfig(options.ignore),
    prefixConfigNames('postIgnore', options.extraRules.postIgnore ?? []),
    {
      name: 'ts-and-js',
      files: TS_AND_JS_FILES,
      extends: tseslint.config([
        coreConfig(options.core),
        typescriptConfig(options.typescript),
        styleConfig(options.style),
        prefixConfigNames('extra', options.extraRules.tsAndJs ?? []),
      ]),
    },
    {
      name: 'js-only',
      files: JS_FILES,
      extends: tseslint.config([
        typecheckDisableConfig(options.typescript),
        prefixConfigNames('extra', options.extraRules.jsOnly ?? []),
      ]),
    },
    nodeConfig(options.node),
    prefixConfigNames('preFormat', options.extraRules.preFormat ?? []),
    formatConfig(options.format),
    prefixConfigNames('postFormat', options.extraRules.postFormat ?? []),
  ]);
}
