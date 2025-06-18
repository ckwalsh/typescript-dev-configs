/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { expect, test } from '@jest/globals';

import { defineConfig } from '../src/tsup.ts';

test('basic', async () => {
  await expect(
    defineConfig({
      rootDir: '.',
      pkg: {},
    })({}),
  ).resolves.toBeDefined();
});

test('with bin', async () => {
  const config = await defineConfig({
    rootDir: '.',
    pkg: {
      bin: {
        foo: 'dist/node/bin/foo.js',
        bar: 'dist/node/bin/bar.js',
      },
    },
  })({});

  expect(config).toHaveLength(1);

  const entry = config[0]?.entry;

  expect(entry).toEqual(expect.arrayOf(expect.any(String)));

  const entryArr = entry as string[];
  entryArr.sort();

  expect(entryArr).toEqual(['./bin/bar.ts', './bin/foo.ts']);
});

test('empty bin', async () => {
  const config = await defineConfig({
    rootDir: '.',
    pkg: {
      bin: {},
    },
  })({});

  expect(config).toEqual([]);
});

test('with exports', async () => {
  const config = await defineConfig({
    rootDir: '.',
    pkg: {
      exports: {
        '.': {
          source: './src/foo.ts',
        },
        './bar': {
          source: './src/bar.ts',
        },
      },
    },
  })({});

  expect(config).toHaveLength(1);

  const entry = config[0]?.entry;

  expect(entry).toEqual(expect.arrayOf(expect.any(String)));

  const entryArr = entry as string[];
  entryArr.sort();

  expect(entryArr).toEqual(['./src/bar.ts', './src/foo.ts']);
});

test('empty exports', async () => {
  const config = await defineConfig({
    rootDir: '.',
    pkg: {
      exports: {},
    },
  })({});

  expect(config).toEqual([]);
});

test('binary options', async () => {
  const config = await defineConfig({
    rootDir: '.',
    pkg: {
      bin: {
        foo: 'bar.js',
      },
    },
    binaryOptions: {
      entry: ['./bin/bar.ts'],
    },
  })({});

  expect(config).toHaveLength(1);

  const entry = config[0]?.entry;

  expect(entry).toEqual(expect.arrayOf(expect.any(String)));

  const entryArr = entry as string[];
  entryArr.sort();

  expect(entryArr).toEqual(['./bin/bar.ts']);
});

test('exports platform options', async () => {
  const config = await defineConfig({
    rootDir: '.',
    pkg: {
      exports: {
        '.': {
          source: './src/foo.ts',
        },
      },
    },
    platformOptions: {
      node: {
        entry: ['./src/node.ts'],
      },
    },
  })({});

  expect(config).toHaveLength(1);

  const entry = config[0]?.entry;

  expect(entry).toEqual(expect.arrayOf(expect.any(String)));

  const entryArr = entry as string[];
  entryArr.sort();

  expect(entryArr).toEqual(['./src/node.ts']);
});
