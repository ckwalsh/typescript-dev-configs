/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import globals from 'globals';
import type { InfiniteDepthConfigWithExtends } from 'typescript-eslint';
import { configs as flatConfigs } from 'typescript-eslint';

import type { OptionsBase, PartialOptions } from './base.ts';
import {
  DEFAULT_OPTIONS_BASE,
  prefixConfigNames,
  resolveOptions,
} from './base.ts';

interface Options extends OptionsBase {
  typecheck: boolean;
  strict: boolean;
  stylistic: boolean;
}

export type TypescriptOptions = PartialOptions<Options>;

const DEFAULT_OPTIONS: Options = {
  ...DEFAULT_OPTIONS_BASE,
  typecheck: true,
  strict: true,
  stylistic: true,
};

function typelessConfig(options: Options): InfiniteDepthConfigWithExtends {
  if (options.typecheck) {
    return [];
  }

  const rules: InfiniteDepthConfigWithExtends[] = [];

  if (options.strict) {
    rules.push({
      name: 'strict',
      extends: [flatConfigs.strict],
    });
  }

  if (options.stylistic) {
    rules.push({
      name: 'stylistic',
      extends: [flatConfigs.stylistic],
    });
  }

  return prefixConfigNames('typeless', rules);
}

function typecheckConfig(options: Options): InfiniteDepthConfigWithExtends {
  if (!options.typecheck) {
    return [];
  }

  const rules: InfiniteDepthConfigWithExtends[] = [];

  rules.push({
    name: 'parser',
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: true,
      },
    },
  });

  if (options.strict) {
    rules.push({
      name: 'strict',
      extends: [flatConfigs.strictTypeChecked],
    });
  }

  if (options.stylistic) {
    rules.push({
      name: 'stylistic',
      extends: [flatConfigs.stylisticTypeChecked],
    });
  }

  return prefixConfigNames('typecheck', rules);
}

export function typescriptConfig(
  partial: PartialOptions<Options>,
): InfiniteDepthConfigWithExtends {
  const options = resolveOptions(partial, DEFAULT_OPTIONS);

  if (!options.enable) {
    return [];
  }

  return prefixConfigNames('typescript', [
    typelessConfig(options),
    typecheckConfig(options),
  ]);
}

export function typecheckDisableConfig(
  partial: PartialOptions<Options>,
): InfiniteDepthConfigWithExtends {
  const options = resolveOptions(partial, DEFAULT_OPTIONS);

  if (!options.enable || !options.typecheck) {
    return [];
  }

  return {
    name: 'typecheck-disable',
    extends: [flatConfigs.disableTypeChecked],
  };
}
