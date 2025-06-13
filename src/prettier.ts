/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Config } from 'prettier';

export function defineConfig(config: Config): Config {
  return {
    // printWidth: 120,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: true,
    quoteProps: 'consistent',
    jsxSingleQuote: false,
    trailingComma: 'all',
    bracketSpacing: true,
    bracketSameLine: false,
    arrowParens: 'always',
    proseWrap: 'always',
    endOfLine: 'lf',
    embeddedLanguageFormatting: 'auto',
    singleAttributePerLine: true,
    plugins: ['@ckwalsh/prettier-plugin-sort-imports'],
    // @trivago/prettier-plugin-sort-imports
    importOrder: ['^@ckwalsh/(.*)$', '^[./]'],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    importOrderIgnoreHeaderComments: 1,
    importOrderIgnoreHeaderCommentTypes: 'CommentBlock',
    ...config,
  };
}
