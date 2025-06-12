/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import eslint from '@eslint/js';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { flatConfigs as importPluginFlatConfigs } from 'eslint-plugin-import-x';
import licenseHeaderPlugin from 'eslint-plugin-license-header';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import {
  config as tseslintConfig,
  configs as tseslintConfigs,
} from 'typescript-eslint';
import type {
  Config,
  ConfigWithExtends,
  InfiniteDepthConfigWithExtends,
} from 'typescript-eslint';

export interface Options {
  tsAndJsConfigs: InfiniteDepthConfigWithExtends[];
  licenseHeader: false | string[];
  licenseHeaderIgnores: string[];
}

const defaultOptions: Options = {
  tsAndJsConfigs: [],
  licenseHeader: [
    '/*',
    ' * Copyright (c) Cullen Walsh',
    ' *',
    ' * This source code is licensed under the MIT license found in the',
    ' * LICENSE file in the root directory of this source tree.',
    ' */',
  ],
  licenseHeaderIgnores: ['src/vendor/**/*'],
};

//////////////////////////////////////

const jsFiles = ['**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs'];
const tsFiles = ['**/*.ts', '**/*.tsx', '**/*.tjs', '**/*.tjs'];

const tsDeclarationFiles = [
  '**/*.d.ts',
  '**/*.d.tsx',
  '**/*.d.tjs',
  '**/*.d.tjs',
];
const tsAndJsFiles = [...jsFiles, ...tsFiles, ...tsDeclarationFiles];

//////////////////////////////////////

const ignoreConfig: ConfigWithExtends = {
  name: 'ckwalsh/ignoreConfig',
  ignores: ['coverage/', 'dist/'],
};

//////////////////////////////////////

const tsAndJsOverridesConfig: InfiniteDepthConfigWithExtends = {
  name: 'ckwalsh/tsAndJs/overrides',
  rules: {
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        disallowTypeAnnotations: true,
        fixStyle: 'separate-type-imports',
        prefer: 'type-imports',
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
  },
};

//////////////////////////////////////

function defineLicenseHeaderConfig(
  options: Options,
): InfiniteDepthConfigWithExtends {
  if (options.licenseHeader === false) {
    return [];
  }
  return {
    ignores: options.licenseHeaderIgnores,
    plugins: {
      'license-header': licenseHeaderPlugin,
    },
    rules: {
      'license-header/header': ['error', options.licenseHeader],
    },
  };
}

function defineTsAndJsConfig(
  options: Options,
): InfiniteDepthConfigWithExtends[] {
  return [
    {
      name: 'ckwalsh/tsAndJs',
      files: tsAndJsFiles,
      extends: [
        {
          languageOptions: {
            globals: globals.node,
            parserOptions: {
              projectService: true,
            },
          },
        },
        eslint.configs.recommended,
        tseslintConfigs.strictTypeChecked,
        tseslintConfigs.stylisticTypeChecked,
        {
          name: 'ckwalsh/tsAndJs/importPluginResolver',
          settings: {
            'import-x/resolver-next': [createTypeScriptImportResolver()],
          },
        },
        importPluginFlatConfigs.recommended,
        importPluginFlatConfigs.typescript,
        defineLicenseHeaderConfig(options),
        tsAndJsOverridesConfig,
        options.tsAndJsConfigs,
      ],
    },
    {
      name: 'ckwalsh/tsAndJs/jsTypecheckDisable',
      files: jsFiles,
      extends: [tseslintConfigs.disableTypeChecked],
    },
    {
      name: 'ckwalsh/tsAndJs/prettier',
      files: tsAndJsFiles,
      extends: [eslintPluginPrettierRecommended],
    },
  ];
}

//////////////////////////////////////

export function defineConfig(options: Partial<Options> = {}): Config {
  const resolvedOptions: Options = { ...defaultOptions, ...options };

  const tsAndJsConfig = defineTsAndJsConfig(resolvedOptions);

  return tseslintConfig(ignoreConfig, ...tsAndJsConfig);
}
