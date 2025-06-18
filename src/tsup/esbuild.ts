/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* istanbul ignore file */

import { OnResolveArgs, OnResolveResult, Plugin, PluginBuild } from 'esbuild';
import fs from 'node:fs/promises';
import path from 'node:path';

/* c8 ignore start */
function setupPluginBuild(build: PluginBuild, suffixes: string[]) {
  build.onResolve({ filter: /^\./ }, async (args) => {
    const parsedPath = path.parse(args.path);

    const promises = suffixes.map((suffix) =>
      moduleSuffixResolver(args, parsedPath, suffix),
    );

    for (const promise of promises) {
      const result = await promise;
      if (result !== null) {
        return result;
      }
    }

    return { path: path.join(args.resolveDir, args.path) };
  });
}

async function moduleSuffixResolver(
  args: OnResolveArgs,
  parsedPath: path.ParsedPath,
  suffix: string,
): Promise<OnResolveResult | null> {
  const p = path.join(
    args.resolveDir,
    parsedPath.dir,
    `${parsedPath.name}${suffix}${parsedPath.ext}`,
  );

  try {
    await fs.access(p);
    return { path: p };
  } catch {
    return null;
  }
}

export function createApplyModuleSuffixesEsbuildPlugin(
  suffixes: string[],
): Plugin {
  return {
    name: 'apply-module-suffixes',
    setup(build: PluginBuild) {
      setupPluginBuild(build, suffixes);
    },
  };
}
/* c8 ignore stop */
