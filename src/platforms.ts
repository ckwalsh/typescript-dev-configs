/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'node:fs/promises';
import path from 'node:path';

export type Platform = 'browser' | 'node' | 'neutral';

const PLATFORMS: Platform[] = ['browser', 'node', 'neutral'];

export async function getPlatformsFromDir(dir: string): Promise<Platform[]> {
  const platforms: Platform[] = [];

  await Promise.all(
    PLATFORMS.map(async (platform) => {
      try {
        await fs.access(path.join(dir, `tsconfig.${platform}.json`));
        platforms.push(platform);
      } catch {
        // Ignore
      }
    }),
  );

  return platforms;
}

/*
export function getPlatformsFromDirSync(dir: string): Platform[] {
  const platforms: Platform[] = [];

  for (const platform of PLATFORMS) {
    if (fsSync.existsSync(path.join(dir, `tsconfig.${platform}.json`))) {
      platforms.push(platform);
    }
  }

  return platforms;
}
*/
