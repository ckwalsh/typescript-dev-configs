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
import tseslint, { configs as tseslintConfigs } from 'typescript-eslint';

export interface Options {
  projectConfigs: tseslint.InfiniteDepthConfigWithExtends[];
  licenseHeader: false | string[];
  licenseHeaderIgnores: string[];
}

const defaultOptions: Options = {
  projectConfigs: [],
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

const ignoreConfig: tseslint.ConfigWithExtends = {
  name: 'ckwalsh/ignoreConfig',
  ignores: ['dist/'],
};
const languageConfig: tseslint.ConfigWithExtends = {
  name: 'ckwalsh/languageConfig',
  languageOptions: {
    globals: globals.node,
    parserOptions: {
      projectService: true,
    },
  },
};
const disableTypeCheckRulesForJavascriptConfig: tseslint.ConfigWithExtends = {
  name: 'ckwalsh/disableTypeCheckRulesForJavascriptConfig',
  files: ['**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs'],
  extends: [tseslintConfigs.disableTypeChecked],
};

const importPluginResolverConfig = {
  name: 'ckwalsh/importPluginResolverConfig',
  settings: {
    'import-x/resolver-next': [createTypeScriptImportResolver()],
  },
};

const ruleOverridesConfig: tseslint.InfiniteDepthConfigWithExtends = {
  name: 'ckwalsh/ruleOverridesConfig',
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

///////////

export default function defineESLintConfig(
  options: Partial<Options> = {},
): tseslint.Config {
  const resolvedOptions: Options = { ...defaultOptions, ...options };

  const licenseHeaderConfig: tseslint.InfiniteDepthConfigWithExtends =
    resolvedOptions.licenseHeader === false
      ? []
      : {
          name: 'ckwalsh/licenseHeaderConfig',
          ignores: resolvedOptions.licenseHeaderIgnores,
          plugins: {
            'license-header': licenseHeaderPlugin,
          },
          rules: {
            'license-header/header': ['error', resolvedOptions.licenseHeader],
          },
        };

  const prettierConfig: tseslint.InfiniteDepthConfigWithExtends = {
    name: 'ckwalsh/prettierConfig',
    extends: [eslintPluginPrettierRecommended],
  };

  return tseslint.config(
    ignoreConfig,
    languageConfig,
    eslint.configs.recommended,
    tseslintConfigs.strictTypeChecked,
    tseslintConfigs.stylisticTypeChecked,
    disableTypeCheckRulesForJavascriptConfig,
    importPluginFlatConfigs.recommended,
    importPluginFlatConfigs.typescript,
    importPluginResolverConfig,
    ruleOverridesConfig,
    licenseHeaderConfig,
    resolvedOptions.projectConfigs,
    prettierConfig,
  );
}
