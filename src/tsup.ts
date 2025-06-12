/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Options } from 'tsup';

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

function extendConfigForPlatform(options: Options, platform: string): Options {
  const config = {
    name: platform,
    tsconfig: `tsconfig.${platform}.json`,
    ...DEFAULTS,
    outDir: `${DEFAULTS.outDir}/${platform}`,
    ...PLATFORM_DEFAULTS[platform],
    ...options,
  };

  if (isTsupPlatform(platform)) {
    config.platform = platform;
  }

  return config;
}

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

function getEntryPointsFromExports({ exports }: Pkg): string[] {
  const entry: string[] = [];

  if (exports === undefined || typeof exports === 'string') {
    return entry;
  }

  if (typeof exports !== 'string') {
    if (exports['.'] === undefined) {
      if (exports.source !== undefined) {
        entry.push(exports.source);
      }
    } else {
      for (const spec of Object.values(exports) as (string | ExportSpec)[]) {
        if (typeof spec === 'string') {
          continue;
        }

        if (spec.source) {
          entry.push(spec.source);
        }
      }
    }
  }

  return entry;
}

function getEntryPointsFromBinaries({ bin }: Pkg): string[] {
  const entry: string[] = [];

  if (bin === undefined) {
    return entry;
  }

  for (const binName of Object.keys(bin)) {
    entry.push(`./bin/${binName}.ts`);
  }

  return entry;
}

export function defineConfig(
  pkg: Pkg,
  options: Options = {},
  platforms: Record<string, boolean | Options> = {},
): Options[] {
  const configs: Options[] = [];

  const entry: string[] = [
    getEntryPointsFromExports(pkg),
    getEntryPointsFromBinaries(pkg),
  ].flat();

  const derivedOptions: Options = { entry, ...options };

  for (const [platform, platformOptions] of Object.entries(platforms)) {
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
