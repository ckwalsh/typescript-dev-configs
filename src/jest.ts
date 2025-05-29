/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Config } from 'jest';
import { createDefaultEsmPreset } from 'ts-jest';

const presetConfig = createDefaultEsmPreset();

export function defineConfig(config: Partial<Config> = {}): Config {
  return {
    ...presetConfig,
    coverageProvider: 'v8',
    collectCoverage: true,
    moduleNameMapper: {
      '^(\\.\\.?\\/.+)\\.js$': '$1',
    },
    ...config,
  };
}
