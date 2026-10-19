'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

function getInput(name) {
  const value = process.env[`INPUT_${name.toUpperCase()}`];
  if (!value || !value.trim()) {
    throw new Error(`Required action input "${name}" is missing.`);
  }
  return value.trim();
}

function main() {
  const workspace = process.env.GITHUB_WORKSPACE || process.cwd();
  const projectDirectory = path.resolve(workspace, getInput('path'));
  const packageFile = path.join(projectDirectory, 'package.json');
  const lockFile = path.join(projectDirectory, 'package-lock.json');

  if (!fs.existsSync(packageFile)) {
    throw new Error(`No package.json found in "${projectDirectory}".`);
  }
  if (!fs.existsSync(lockFile)) {
    throw new Error(`No package-lock.json found in "${projectDirectory}"; npm ci requires a lockfile.`);
  }

  const result = spawnSync('npm', ['ci'], {
    cwd: projectDirectory,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    windowsHide: true,
  });

  if (result.error) {
    throw new Error(`Failed to start npm ci: ${result.error.message}`);
  }
  if (result.status !== 0) {
    throw new Error(`npm ci failed with exit code ${result.status}.`);
  }
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
