#!/usr/bin/env node

const installer = require('../installer');

const command = process.argv[2];

if (command === 'install' || !command) {
  installer.install();
} else {
  console.log('Usage: npx @sshaaf/tutorial-skill [install]');
  console.log('');
  console.log('Commands:');
  console.log('  install    Install the tutorial skill (default)');
  process.exit(0);
}
