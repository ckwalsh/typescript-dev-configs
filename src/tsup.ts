/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import type { Options } from 'tsup';

type ExportPath = '.' | `./${string}`;
interface ExportSpec {
  '.'?: never;
  'source'?: string;
}

interface ExportMap extends Record<ExportPath, string | ExportSpec> {
  '.': string | ExportSpec;
  'source'?: never;
}

interface Pkg {
  exports?: string | ExportSpec | ExportMap;
  bin?: Record<string, string>;
}

interface HelperOptions {
  rootDir: string;
  pkg: Pkg;
  platforms?: Record<string, boolean | Options>;
}

type ReturnOptions = Options & Required<Pick<Options, 'outDir'>>;

const IS_PRODUCTION = process.env['NODE_ENV'] !== 'development';

const DEFAULTS: ReturnOptions = {
  minify: IS_PRODUCTION,
  outDir: 'dist',
  dts: true,
  sourcemap: true,
  format: ['cjs', 'esm'],
  replaceNodeEnv: IS_PRODUCTION,
  metafile: true,
};

const PLATFORM_DEFAULTS: Record<string, Options> = {
  node: {
    removeNodeProtocol: false,
  },
  browser: {
    format: ['esm'],
  },
};

export type Platform = NonNullable<Options['platform']>;

function isTsupPlatform(platform: string): platform is Platform {
  return ['neutral', 'node', 'browser'].includes(platform);
}

function extendConfigForPlatform(
  options: Options & HelperOptions,
  platform: string,
): Options {
  const config = {
    name: platform,
    tsconfig: `tsconfig.${platform}.json`,
    ...DEFAULTS,
    outDir: path.join(options.rootDir, DEFAULTS.outDir, platform),
    ...PLATFORM_DEFAULTS[platform],
    ...options,
  };

  if (isTsupPlatform(platform)) {
    config.platform = platform;
  }

  return config;
}

function getEntryPointsFromExports(
  rootDir: string,
  exports: Pkg['exports'],
): string[] {
  const entry: string[] = [];

  if (exports === undefined || typeof exports === 'string') {
    return entry;
  }

  if (typeof exports !== 'string') {
    if (exports['.'] === undefined) {
      if (exports.source !== undefined) {
        entry.push(path.join(rootDir, exports.source));
      }
    } else {
      for (const spec of Object.values(exports) as (string | ExportSpec)[]) {
        if (typeof spec === 'string') {
          continue;
        }

        if (spec.source) {
          entry.push(path.join(rootDir, spec.source));
        }
      }
    }
  }

  return entry;
}

function getEntryPointsFromBinaries(
  rootDir: string,
  bin: Pkg['bin'],
): string[] {
  const entry: string[] = [];

  if (bin === undefined) {
    return entry;
  }

  for (const binName of Object.keys(bin)) {
    entry.push(path.join(rootDir, 'bin', `${binName}.ts`));
  }

  return entry;
}

export function defineConfig(options: Options & HelperOptions): Options[] {
  const configs: Options[] = [];

  const { rootDir, pkg } = options;
  const { exports, bin } = pkg;

  const entry: string[] = [
    getEntryPointsFromExports(rootDir, exports),
    getEntryPointsFromBinaries(rootDir, bin),
  ].flat();

  const derivedOptions: Options & HelperOptions = { entry, ...options };

  for (const [platform, platformOptions] of Object.entries(
    options.platforms ?? {},
  )) {
    if (platformOptions === false) {
      continue;
    }

    configs.push(
      extendConfigForPlatform(
        platformOptions === true
          ? derivedOptions
          : { ...derivedOptions, ...platformOptions },
        platform,
      ),
    );
  }

  if (configs.length === 0) {
    configs.push({
      ...DEFAULTS,
      ...derivedOptions,
    });
  }

  return configs;
}
