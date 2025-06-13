#!/usr/bin/env node

/*
 * Copyright (c) Cullen Walsh
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import childProcess from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import util from 'node:util';

/**
 * The default `--pack` behavior of attw uses npm instead of pnpm, which fails.
 *
 * This script uses pnpm, and does some extra work to cache the packed tarball.
 */

const exec = util.promisify(childProcess.exec);

const [_node, _script, ...passthruArgs] = process.argv;

const CACHE_DIR = path.join('node_modules', '.cache', 'attw');

const METAFAILE_NAME_REGEX = /^metafile.*\.json$/;

async function findMetafiles(root: string): Promise<string[]> {
  const entries = await fs.readdir(root, { withFileTypes: true });

  const fileNames: string[][] = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => findMetafiles(path.join(root, entry.name))),
  );

  fileNames.push(
    entries
      .filter(
        (entry) => entry.isFile() && METAFAILE_NAME_REGEX.test(entry.name),
      )
      .map((entry) => path.join(root, entry.name)),
  );

  return fileNames.flat();
}

interface MetafileContent {
  inputs?: Record<string, unknown>;
}

async function getInputsFromMetafile(path: string): Promise<string[]> {
  const content = await fs.readFile(path, 'utf8');
  const { inputs }: MetafileContent = JSON.parse(content) as MetafileContent;

  if (inputs === undefined) {
    return [];
  }

  return Object.keys(inputs);
}

async function getInputsHash(): Promise<string> {
  const metafiles = await findMetafiles('dist');

  const inputsSet = new Set<string>(['package.json']);

  await Promise.all(
    metafiles.map(async (filePath) => {
      const fileInputs = await getInputsFromMetafile(filePath);
      fileInputs.forEach((input) => inputsSet.add(input));
    }),
  );

  const inputs = Array.from(inputsSet).sort();

  const rootHasher = createHash('sha256');

  for (const input of inputs) {
    const inputHasher = createHash('sha256');

    const fh = await fs.open(input, 'r');

    for await (const chunk of fh.readableWebStream() as ReadableStream<Uint8Array>) {
      inputHasher.update(chunk);
    }

    await fh.close();

    rootHasher.update(input);
    rootHasher.update(inputHasher.digest('hex'));
  }

  return rootHasher.digest('hex');
}

async function getPathToPack(): Promise<string> {
  let hash = await getInputsHash();

  try {
    const packedPath = path.join(CACHE_DIR, `${hash}.tgz`);
    await fs.access(packedPath);
    return packedPath;
  } catch {
    // Do nothing
  }

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'attw-'));

  try {
    const tmpFile = path.join(tmpDir, 'pack.tgz');

    await exec(`pnpm pack --out ${tmpFile}`);

    await fs.rm(CACHE_DIR, { recursive: true, force: true });
    await fs.mkdir(CACHE_DIR, { recursive: true });

    hash = await getInputsHash();
    const packedPath = path.join(CACHE_DIR, `${hash}.tgz`);

    await fs.rename(tmpFile, packedPath);

    return packedPath;
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}

function run(packedPath: string): Promise<number> {
  return new Promise((resolve) => {
    const result = childProcess.spawn('attw', [packedPath, ...passthruArgs], {
      stdio: 'inherit',
    });
    result.on('exit', resolve);

    result.on('exit', (r) => {
      resolve(r ?? 0);
    });
  });
}

async function main() {
  const packedPath = await getPathToPack();

  process.exit(await run(packedPath));
}

void main();
