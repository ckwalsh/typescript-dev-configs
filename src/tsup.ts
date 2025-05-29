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
  sourcemap: !IS_PRODUCTION,
  format: ['cjs', 'esm'],
  replaceNodeEnv: IS_PRODUCTION,
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
  source?: string;
}

interface Pkg {
  exports: string | Record<ExportPath, string | ExportSpec>;
}

export function defineConfig(
  pkg: Pkg,
  options: Options = {},
  platforms: Record<string, boolean | Options> = {},
): Options[] {
  const configs: Options[] = [];

  const entry: string[] = [];

  if (typeof pkg.exports !== 'string') {
    for (const spec of Object.values(pkg.exports)) {
      if (typeof spec === 'string') {
        continue;
      }

      if (spec.source) {
        entry.push(spec.source);
      }
    }
  }

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
