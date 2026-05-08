#!/usr/bin/env node

const installer = require('../installer');
const updater = require('../lib/updater');

const command = process.argv[2];
const commandArgs = process.argv.slice(2);

// Parse flags
const isGlobal = commandArgs.includes('-g') || commandArgs.includes('--global');
const isCheck = commandArgs.includes('--check');
const noBackup = commandArgs.includes('--no-backup');
const force = commandArgs.includes('--force');

if (command === 'install' || !command) {
  installer.install({ global: isGlobal });
} else if (command === 'update') {
  if (isCheck) {
    updater.checkForUpdates({ global: isGlobal });
  } else {
    const options = {
      global: isGlobal,
      backup: !noBackup,
      force: force
    };
    updater.updateSkill(options);
  }
} else {
  console.log('Usage: npx @sshaaf/tutorial-skill [command] [options]');
  console.log('');
  console.log('Commands:');
  console.log('  install [-g|--global]                     Install skill');
  console.log('  update [-g|--global] [options]            Update installation');
  console.log('');
  console.log('Install options:');
  console.log('  -g, --global  Install to ~/.claude/skills/tutorial (default: .claude/tutorial)');
  console.log('');
  console.log('Update options:');
  console.log('  -g, --global  Update global installation');
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
