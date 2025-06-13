/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Configuration } from 'lint-staged';

type FixedConfig = Exclude<Configuration, (...args: never[]) => unknown>;

export function defineConfig(config: FixedConfig = {}): Configuration {
  return {
    '*.{js,jsx,ts,tsx}': [
      'pnpm run lint:fix',
      'pnpm run test --passWithNoTests',
    ],
    ...config,
  };
}
