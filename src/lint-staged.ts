/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Configuration, FunctionTask } from 'lint-staged';

export function defineConfig(
  config: Exclude<Configuration, FunctionTask> = {},
): Configuration {
  return {
    '*.{js,jsx,ts,tsx}': [
      'pnpm run lint-fix',
      'pnpm run test --passWithNoTests',
    ],
    ...config,
  };
}
