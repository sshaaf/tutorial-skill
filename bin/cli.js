#!/usr/bin/env node

const installer = require('../installer');
const { initDocs, previewDocs, buildDocs, doctorDocs } = require('../lib/honkit');
const updater = require('../lib/updater');

const command = process.argv[2];
const subcommand = process.argv[3];
const commandArgs = process.argv.slice(3);

if (command === 'install' || !command) {
  installer.install();
} else if (command === 'update') {
  if (subcommand === '--check') {
    updater.checkForUpdates();
  } else {
    const options = {
      backup: !commandArgs.includes('--no-backup'),
      force: commandArgs.includes('--force')
    };
    updater.updateSkill(options);
  }
} else if (command === 'init') {
  initDocs(commandArgs);
} else if (command === 'preview') {
  previewDocs(commandArgs);
} else if (command === 'build') {
  buildDocs(commandArgs);
} else if (command === 'doctor') {
  doctorDocs(commandArgs);
} else if (command === 'runtime' && subcommand === 'install') {
  try {
    installer.bootstrapHonkitRuntime();
  } catch (error) {
    console.error('❌ Failed to install HonKit runtime.');
    console.error(error.message);
    process.exit(1);
  }
} else {
  console.log('Usage: npx @sshaaf/tutorial-skill [command] [options]');
  console.log('');
  console.log('Commands:');
  console.log('  install                                   Install the tutorial skill (default)');
  console.log('  update [--check] [--no-backup] [--force]  Update to latest version');
  console.log('  init [--dir <path>] [--engine honkit]     Prepare Markdown for HonKit');
  console.log('  preview [--dir <path>] [--engine honkit]  Run local HonKit preview server');
  console.log('  build [--dir <path>] [--engine honkit]    Build static docs via HonKit');
  console.log('  doctor [--dir <path>] [--engine honkit]   Check runtime and docs setup');
  console.log('  runtime install                           Install/repair bundled HonKit runtime');
  console.log('');
  console.log('Update options:');
  console.log('  --check       Check for updates without installing');
  console.log('  --no-backup   Skip creating backup before update');
  console.log('  --force       Force update even if already on latest version');
  process.exit(0);
}
