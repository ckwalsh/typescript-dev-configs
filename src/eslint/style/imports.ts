/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { flatConfigs } from 'eslint-plugin-import-x';
import type { InfiniteDepthConfigWithExtends } from 'typescript-eslint';

import type { OptionsBase, PartialOptions } from '../base.ts';
import {
  DEFAULT_OPTIONS_BASE,
  prefixConfigNames,
  resolveOptions,
} from '../base.ts';

interface Options extends OptionsBase {
  recommended: boolean;
  typeImports: boolean;
}

export type ImportOptions = PartialOptions<Options>;

const DEFAULT_OPTIONS: Options = {
  ...DEFAULT_OPTIONS_BASE,
  recommended: true,
  typeImports: true,
};

function recommendedConfig(options: Options): InfiniteDepthConfigWithExtends {
  if (!options.recommended) {
    return [];
  }

  return {
    name: 'recommended',
    extends: [flatConfigs.recommended, flatConfigs.typescript],
  };
}

function typeImportsConfig(options: Options): InfiniteDepthConfigWithExtends {
  if (!options.typeImports) {
    return [];
  }

  return {
    name: 'type-imports',
    rules: {
      /*
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          disallowTypeAnnotations: true,
          fixStyle: 'separate-type-imports',
          prefer: 'type-imports',
        },
      ],
      */
      'import-x/consistent-type-specifier-style': ['error', 'prefer-top-level'],
    },
  };
}

export function importsConfig(
  partial: PartialOptions<Options>,
): InfiniteDepthConfigWithExtends {
  const options = resolveOptions(partial, DEFAULT_OPTIONS);

  if (!options.enable) {
    return [];
  }

  return prefixConfigNames('imports', [
    {
      name: 'resolver',
      settings: {
        'import-x/resolver-next': [createTypeScriptImportResolver()],
      },
    },
    recommendedConfig(options),
    typeImportsConfig(options),
  ]);
}
