const fs = require('fs');
const path = require('path');
const os = require('os');

const SKILL_DIR = path.join(os.homedir(), '.claude/skills/tutorial');
const SOURCE_DIR = __dirname;

function copyRecursive(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      // Skip NPM package files during install
      if (['node_modules', 'bin', 'installer.js', 'package.json', '.npmignore', 'PUBLISHING.md'].includes(childItemName)) {
        return;
      }
      copyRecursive(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

function install() {
  console.log('📦 Installing Tutorial Skill...');
  console.log('');

  // Check if already installed
  if (fs.existsSync(SKILL_DIR)) {
    console.log('⚠️  Tutorial skill already exists at:', SKILL_DIR);
    console.log('');
    console.log('To reinstall, first remove the existing installation:');
    console.log('  rm -rf', SKILL_DIR);
    console.log('');
    console.log('Then run this installer again.');
    process.exit(1);
  }

  // Create .claude/skills directory if needed
  const skillsDir = path.dirname(SKILL_DIR);
  if (!fs.existsSync(skillsDir)) {
    console.log('Creating skills directory:', skillsDir);
    fs.mkdirSync(skillsDir, { recursive: true });
  }

  // Copy skill files (SKILL.md, README.md, tests/)
  console.log('Installing to:', SKILL_DIR);
  copyRecursive(SOURCE_DIR, SKILL_DIR);

  console.log('');
  console.log('✅ Installation complete!');
  console.log('');
  console.log('📍 Installed to:', SKILL_DIR);
  console.log('');
  console.log('🎯 Usage in Claude Code:');
  console.log('');
  console.log('  Fast Analysis (2-5 minutes):');
  console.log('    /tutorial analyze ./src');
  console.log('');
  console.log('  Full Tutorial (10-30 minutes):');
  console.log('    /tutorial build --output ./docs');
  console.log('');
  console.log('🧪 Test the skill:');
  console.log('  cd', path.join(SKILL_DIR, 'tests/java'));
  console.log('  # Then in Claude Code: /tutorial analyze .');
  console.log('');
  console.log('📚 Documentation:');
  console.log('  README:', path.join(SKILL_DIR, 'README.md'));
  console.log('  SKILL:  ', path.join(SKILL_DIR, 'SKILL.md'));
  console.log('');
}

module.exports = { install };
