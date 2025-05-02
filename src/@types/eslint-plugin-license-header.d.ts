/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module 'eslint-plugin-license-header' {
  import type { Rule } from 'eslint';

  declare const plugin: {
    rules: Record<string, Rule.RuleModule>;
  };

  export = plugin;
}
