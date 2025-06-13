/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Config } from 'jest';
import { createDefaultEsmPreset } from 'ts-jest';

const presetConfig = createDefaultEsmPreset({});

const DEFAULTS: Config = {
  coveragePathIgnorePatterns: ['/node_modules/', '/test/'],
  coverageProvider: 'v8',
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleNameMapper: {
    '^(\\.\\.?\\/.+)\\.js$': '$1',
  },
};

const IS_CI = !!process.env['CI'];

const CI_DEFAULTS: Config = {
  ci: true,
  coverageReporters: ['text-summary'],
  reporters: [['github-actions', { silent: false }], 'summary'],
};

const IS_COMMIT = !!process.env['COMMIT'];

const COMMIT_DEFAULTS: Config = {
  coverageReporters: ['text-summary'],
  reporters: ['jest-silent-reporter', 'summary'],
};

export function defineConfig(config: Config = {}): Config {
  return {
    ...presetConfig,
    ...DEFAULTS,
    ...(IS_CI ? CI_DEFAULTS : {}),
    ...(IS_COMMIT ? COMMIT_DEFAULTS : {}),
    ...config,
  };
}
