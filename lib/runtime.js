const fs = require('fs');
const os = require('os');
const path = require('path');

const SKILL_DIR = path.join(os.homedir(), '.claude/skills/tutorial');
const HONKIT_RUNTIME_DIR = path.join(SKILL_DIR, '.runtime', 'honkit');
const HONKIT_RUNTIME_BIN = path.join(
  HONKIT_RUNTIME_DIR,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'honkit.cmd' : 'honkit'
);
const HONKIT_RUNTIME_MARKER = path.join(HONKIT_RUNTIME_DIR, '.installed');
const HONKIT_MERMAID_PLUGIN_DIR = path.join(
  HONKIT_RUNTIME_DIR,
  'node_modules',
  'honkit-plugin-mermaid-hybrid'
);

function isHonkitRuntimeInstalled() {
  return (
    fs.existsSync(HONKIT_RUNTIME_BIN) &&
    fs.existsSync(HONKIT_RUNTIME_MARKER) &&
    fs.existsSync(HONKIT_MERMAID_PLUGIN_DIR)
  );
}

module.exports = {
  SKILL_DIR,
  HONKIT_RUNTIME_DIR,
  HONKIT_RUNTIME_BIN,
  HONKIT_RUNTIME_MARKER,
  HONKIT_MERMAID_PLUGIN_DIR,
  isHonkitRuntimeInstalled
};
