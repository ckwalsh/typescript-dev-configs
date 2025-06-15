/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import type { InfiniteDepthConfigWithExtends } from 'typescript-eslint';

import type { OptionsBase, PartialOptions } from './base.ts';
import { DEFAULT_OPTIONS_BASE, resolveOptions } from './base.ts';
import { JS_FILES, TS_DECL_FILES, TS_FILES } from './files.ts';

interface Options extends OptionsBase {
  js: boolean;
  ts: boolean;
  tsDecl: boolean;
  extraFiles: string[];
}

export type FormatOptions = PartialOptions<Options>;

const DEFAULT_OPTIONS: Options = {
  ...DEFAULT_OPTIONS_BASE,
  js: true,
  ts: true,
  tsDecl: true,
  extraFiles: [],
};

export function formatConfig(
  partial: PartialOptions<Options>,
): InfiniteDepthConfigWithExtends {
  const options = resolveOptions(partial, DEFAULT_OPTIONS);

  if (!options.enable) {
    return [];
  }

  const files: string[][] = [options.extraFiles];

  if (options.js) {
    files.push(JS_FILES);
  }
  if (options.ts) {
    files.push(TS_FILES);
  }
  if (options.tsDecl) {
    files.push(TS_DECL_FILES);
  }

  return {
    name: 'prettier',
    files: files.flat(),
    extends: [
      eslintPluginPrettierRecommended as InfiniteDepthConfigWithExtends,
    ],
  };
}
