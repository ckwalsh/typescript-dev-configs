/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

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

export interface Pkg {
  bin?: Record<string, string>;
  exports?: string | ExportSpec | ExportMap;
}

export function getBinEntryFromPkg({ bin }: Pkg): Options['entry'] {
  if (bin === undefined) {
    return undefined;
  }

  const entry = Object.keys(bin).map((name) => `./bin/${name}.ts`);

  if (entry.length === 0) {
    return undefined;
  }

  return entry;
}

function getExportSpecEntryPoints(spec: ExportSpec): string[] {
  return spec.source === undefined ? [] : [spec.source];
}

function getExportMapEntryPoints(specMap: ExportMap): string[] {
  const specs = Object.values(specMap) as (string | ExportSpec)[];

  return specs
    .map((spec: string | ExportSpec): string[] => {
      if (typeof spec === 'string') {
        return [];
      }

      return getExportSpecEntryPoints(spec);
    })
    .flat();
}

export function getExportsEntryFromPkg({ exports }: Pkg): Options['entry'] {
  if (exports === undefined || typeof exports === 'string') {
    return undefined;
  }

  const entry =
    exports['.'] === undefined
      ? getExportSpecEntryPoints(exports)
      : getExportMapEntryPoints(exports);

  if (entry.length === 0) {
    return undefined;
  }

  return entry;
}
