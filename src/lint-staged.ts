/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Configuration } from 'lint-staged';

export default function defineLintStagedConfig(): Configuration {
  return {
    '*.{js,jsx,ts,tsx}': ['eslint --fix', 'jest --findRelatedTests --passWithNoTests'],
  };
}
