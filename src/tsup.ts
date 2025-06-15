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
  platforms?: Record<string, true | Options>;
}

const IS_CI = !!process.env['CI'];

const NODE_ENV = (
  process.env['NODE_ENV'] ?? (IS_CI ? 'production' : 'development')
).toLowerCase();

const NODE_ENV_OPTIONS: Record<string, Options> = {
  production: {
    minify: true,
    replaceNodeEnv: true,
  },
};

const ENV_DEFAULTS: Options = NODE_ENV_OPTIONS[NODE_ENV] ?? {};

const EXPORT_DEFAULTS: Options = {
  dts: true,
  sourcemap: true,
  format: ['cjs', 'esm'],
  metafile: true,
  ...ENV_DEFAULTS,
};

const BIN_DEFAULTS: Options = {
  dts: false,
  sourcemap: true,
  format: ['cjs'],
  metafile: true,
  ...ENV_DEFAULTS,
};

const ROOT_OUT_DIR = 'dist';

const DEFAULTS_BY_PLATFORM: Record<string, Options> = {
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

function defineExportConfigs(options: Options & HelperOptions): Options[] {
  const { rootDir, pkg } = options;
  const { exports } = pkg;

  if (exports === undefined || typeof exports === 'string') {
    return [];
  }

  const entry: string[] = [];

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

  const platforms = options.platforms ?? { default: true };

  return Object.entries(platforms).map(
    ([name, platformOptions]: [string, true | Options]): Options => {
      const tsconfig =
        name === 'default' ? 'tsconfig.json' : `tsconfig.${name}.json`;

      const platformDefaults = DEFAULTS_BY_PLATFORM[name] ?? {};
      if (isTsupPlatform(name)) {
        platformDefaults.platform = name;
      }

      if (platformOptions === true) {
        platformOptions = {};
      }

      return {
        ...EXPORT_DEFAULTS,
        name: name,
        tsconfig,
        outDir: path.join(rootDir, ROOT_OUT_DIR, name),
        entry,
        ...options,
        ...platformOptions,
      };
    },
  );
}

function defineBinConfigs(options: Options & HelperOptions): Options[] {
  const { rootDir, pkg } = options;
  const { bin } = pkg;

  if (bin === undefined || Object.keys(bin).length === 0) {
    return [];
  }

  const entry: string[] = [];

  for (const source of Object.keys(bin)) {
    entry.push(path.join(rootDir, 'bin', `${source}.ts`));
  }

  return [
    {
      ...BIN_DEFAULTS,
      name: 'binaries',
      outDir: path.join(rootDir, ROOT_OUT_DIR, 'bin'),
      entry,
      ...options,
    },
  ];
}

export function defineConfig(options: Options & HelperOptions): Options[] {
  return [...defineExportConfigs(options), ...defineBinConfigs(options)];
}
