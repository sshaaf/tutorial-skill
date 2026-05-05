#!/usr/bin/env node

const installer = require('../installer');
const { initDocs, previewDocs, buildDocs, doctorDocs } = require('../lib/honkit');

const command = process.argv[2];
const subcommand = process.argv[3];
const subsubcommand = process.argv[4];
const subcommandArgs = process.argv.slice(4);

if (command === 'install' || !command) {
  installer.install();
} else if (command === 'docs') {
  if (subcommand === 'init') {
    initDocs(subcommandArgs);
  } else if (subcommand === 'preview') {
    previewDocs(subcommandArgs);
  } else if (subcommand === 'build') {
    buildDocs(subcommandArgs);
  } else if (subcommand === 'doctor') {
    doctorDocs(subcommandArgs);
  } else if (subcommand === 'runtime' && subsubcommand === 'install') {
    try {
      installer.bootstrapHonkitRuntime();
    } catch (error) {
      console.error('❌ Failed to install HonKit runtime.');
      console.error(error.message);
      process.exit(1);
    }
  } else {
    console.log(
      'Usage: npx @sshaaf/tutorial-skill docs <init|preview|build|doctor|runtime install> [--dir <path>] [--engine honkit]'
    );
    process.exit(1);
  }
} else {
  console.log('Usage: npx @sshaaf/tutorial-skill [install]');
  console.log('');
  console.log('Commands:');
  console.log('  install                                   Install the tutorial skill (default)');
  console.log('  docs init [--dir <path>] [--engine honkit]     Prepare Markdown for HonKit');
  console.log('  docs preview [--dir <path>] [--engine honkit]  Run local HonKit preview server');
  console.log('  docs build [--dir <path>] [--engine honkit]    Build static docs via HonKit');
  console.log('  docs doctor [--dir <path>] [--engine honkit]   Check runtime and docs setup');
  console.log('  docs runtime install                           Install/repair bundled HonKit runtime');
  process.exit(0);
}
