/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Options } from 'tsup';

import { Platform } from '../platforms.ts';
import { createApplyModuleSuffixesEsbuildPlugin } from './esbuild.ts';
import { Pkg } from './package.ts';

export interface ConfigOptions {
  rootDir: string;
  pkg: Pkg;
  options?: Options;
  platforms?: Platform[];
  platformOptions?: Partial<Record<Platform, Options>>;
  binaryOptions?: Options;
}

export interface BinaryOptions {
  rootDir: string;
  pkg: Pkg;
  environmentOptions: Options;
  configBaseOptions: Options;
  configPlatformOptions: Partial<Record<Platform, Options>>;
  configBinaryOptions: Options;
  cliOptions: Options;
}

export interface ExportsOptions {
  rootDir: string;
  pkg: Pkg;
  environmentOptions: Options;
  platforms: Platform[];
  configBaseOptions: Options;
  configPlatformOptions: Partial<Record<Platform, Options>>;
  cliOptions: Options;
}

export interface PlatformExportsOptions extends ExportsOptions {
  platform: Platform;
}

export type FullOptions = BinaryOptions & ExportsOptions;

const IS_CI_ENV = !!process.env['CI'];

const CURRENT_ENV = (
  process.env['NODE_ENV'] ?? (IS_CI_ENV ? 'production' : 'development')
).toLowerCase();

const ENV_DEFAULTS: Record<string, Options> = {
  production: {
    minify: true,
    replaceNodeEnv: true,
  },
};

export const ENV_OPTIONS = ENV_DEFAULTS[CURRENT_ENV] ?? {};

export const OPTIONS_BY_PLATFORM: Record<Platform, Options> = {
  browser: {
    esbuildPlugins: [createApplyModuleSuffixesEsbuildPlugin(['.browser'])],
  },
  neutral: {},
  node: {
    format: ['cjs', 'esm'],
    removeNodeProtocol: false,
    esbuildPlugins: [createApplyModuleSuffixesEsbuildPlugin(['.node'])],
  },
};
