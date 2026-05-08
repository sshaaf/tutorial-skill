#!/usr/bin/env node

const installer = require('../installer');
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
} else {
  console.log('Usage: npx @sshaaf/tutorial-skill [command] [options]');
  console.log('');
  console.log('Commands:');
  console.log('  install                                   Install to .claude/tutorial/ (default)');
  console.log('  update [--check] [--no-backup] [--force]  Update local installation');
  console.log('');
  console.log('Update options:');
  console.log('  --check       Check for updates without installing');
  console.log('  --no-backup   Skip creating backup before update (not recommended)');
  console.log('  --force       Force update even if already on latest version');
  console.log('');
  console.log('The skill generates HonKit-compatible markdown files.');
  console.log('To preview tutorials as HTML, install HonKit separately:');
  console.log('  npm install -g honkit');
  console.log('  cd ./docs/tutorial && honkit serve');
  process.exit(0);
}
