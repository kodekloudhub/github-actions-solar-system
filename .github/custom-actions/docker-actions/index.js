'use strict';

const { spawnSync } = require('node:child_process');

const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

function getInput(name) {
  const value = process.env[`INPUT_${name.toUpperCase()}`];
  if (!value) {
    throw new Error(`Required action input "${name}" is missing.`);
  }
  return value;
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: process.env.GITHUB_WORKSPACE || process.cwd(),
    encoding: 'utf8',
    input: options.input,
    env: options.env ? { ...process.env, ...options.env } : process.env,
    stdio: options.input === undefined ? 'inherit' : ['pipe', 'inherit', 'inherit'],
    windowsHide: true,
  });

  if (result.error) {
    throw new Error(`Failed to start ${command}: ${result.error.message}`);
  }
  if (result.status !== 0) {
    throw new Error(`${command} ${args[0] || ''} failed with exit code ${result.status}`);
  }
}

function maskSecret(secret) {
  const escaped = secret
    .replaceAll('%', '%25')
    .replaceAll('\r', '%0D')
    .replaceAll('\n', '%0A');
  process.stdout.write(`::add-mask::${escaped}\n`);
}

async function checkApplicationHealth() {
  const healthUrl = 'http://127.0.0.1:3000/live';
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    try {
      const response = await fetch(healthUrl);
      if (response.ok) {
        const body = await response.text();
        console.log(`Application health check passed: ${body}`);
        return;
      }
    } catch {
      // The container may still be starting.
    }
    await sleep(2000);
  }

  try {
    run('docker', ['logs', 'solar-system-app']);
  } catch (error) {
    console.error(`Unable to read application container logs: ${error.message}`);
  }
  throw new Error(`Application health check failed at ${healthUrl}.`);
}

async function main() {
  const dockerhubImage = getInput('dockerhub_image');
  const ghcrImage = getInput('ghcr_image');
  const dockerhubUsername = getInput('dockerhub_username');
  const dockerhubToken = getInput('dockerhub_token');
  const ghcrUsername = getInput('ghcr_username');
  const ghcrToken = getInput('ghcr_token');
  const mongoUsername = getInput('mongo_username');
  const mongoPassword = getInput('mongo_password');

  maskSecret(dockerhubToken);
  maskSecret(ghcrToken);
  maskSecret(mongoPassword);

  let containerStarted = false;
  try {
    run('docker', ['login', '--username', dockerhubUsername, '--password-stdin'], {
      input: `${dockerhubToken}\n`,
    });
    run(
      'docker',
      ['login', 'ghcr.io', '--username', ghcrUsername, '--password-stdin'],
      { input: `${ghcrToken}\n` },
    );

    run('docker', ['build', '--tag', dockerhubImage, '.']);
    run('docker', [
      'run',
      '--detach',
      '--name',
      'solar-system-app',
      '--publish',
      '3000:3000',
      '--add-host=host.docker.internal:host-gateway',
      '--env',
      'MONGO_URI=mongodb://host.docker.internal:27017/superData?authSource=admin',
      '--env',
      'MONGO_USERNAME',
      '--env',
      'MONGO_PASSWORD',
      dockerhubImage,
    ], {
      env: {
        MONGO_USERNAME: mongoUsername,
        MONGO_PASSWORD: mongoPassword,
      },
    });
    containerStarted = true;

    await checkApplicationHealth();

    run('docker', ['tag', dockerhubImage, ghcrImage]);
    run('docker', ['push', dockerhubImage]);
    run('docker', ['push', ghcrImage]);
  } finally {
    if (containerStarted) {
      try {
        run('docker', ['rm', '--force', 'solar-system-app']);
      } catch (error) {
        console.error(`Unable to remove test container: ${error.message}`);
      }
    }
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
