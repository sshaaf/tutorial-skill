const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const SKILL_DIR = path.join(process.cwd(), '.claude/tutorial');
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
      // Skip NPM package metadata during install (but keep runtime CLI helpers)
      if (['node_modules', 'installer.js', 'package.json', '.npmignore', 'PUBLISHING.md'].includes(childItemName)) {
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

function copyCliBundle(destRoot) {
  const binSrc = path.join(SOURCE_DIR, 'bin');
  const libSrc = path.join(SOURCE_DIR, 'lib');
  const installerSrc = path.join(SOURCE_DIR, 'installer.js');

  if (fs.existsSync(binSrc)) {
    copyRecursive(binSrc, path.join(destRoot, 'bin'));
  }
  if (fs.existsSync(libSrc)) {
    copyRecursive(libSrc, path.join(destRoot, 'lib'));
  }
  if (fs.existsSync(installerSrc)) {
    fs.copyFileSync(installerSrc, path.join(destRoot, 'installer.js'));
  }
}


function writeVersionFile() {
  const versionFilePath = path.join(SKILL_DIR, '.version');
  let packageJson;

  try {
    packageJson = require('./package.json');
  } catch (error) {
    // If package.json doesn't exist (dev), use a default
    packageJson = { version: '0.0.0-dev' };
  }

  const versionData = {
    version: packageJson.version,
    installedAt: new Date().toISOString(),
    customized: false
  };

  fs.writeFileSync(versionFilePath, JSON.stringify(versionData, null, 2) + '\n');
}

function install() {
  const isUpdate = fs.existsSync(SKILL_DIR);

  console.log(isUpdate ? '🔄 Updating Tutorial Skill...' : '📦 Installing Tutorial Skill...');
  console.log('');

  // If updating, show current version
  if (isUpdate) {
    const versionFile = path.join(SKILL_DIR, '.version');
    if (fs.existsSync(versionFile)) {
      try {
        const versionData = JSON.parse(fs.readFileSync(versionFile, 'utf8'));
        console.log('Current version:', versionData.version);
      } catch (error) {
        // Ignore parse errors
      }
    }
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
  copyCliBundle(SKILL_DIR);

  // Write version information
  writeVersionFile();

  console.log('');
  console.log(isUpdate ? '✅ Update complete!' : '✅ Installation complete!');
  console.log('');
  console.log('📍 Installed to:', SKILL_DIR);
  console.log('');

  if (!isUpdate) {
    console.log('💡 Version Control:');
    console.log('   • Exclude all: echo ".claude/" >> .gitignore');
    console.log('   • Commit templates: git add .claude/tutorial/templates/ .claude/tutorial/SKILL.md');
    console.log('');
    console.log('📦 Updates:');
    console.log('   • Check for updates: npx @sshaaf/tutorial-skill update --check');
    console.log('   • Update (with backup): npx @sshaaf/tutorial-skill update');
    console.log('   ⚠️  Updates overwrite templates - backup created automatically');
  }
  console.log('');
  console.log('🎯 Usage in Claude Code:');
  console.log('');
  console.log('  Generate Tutorial (10-30 minutes):');
  console.log('    /tutorial build');
  console.log('    /tutorial build --output ./docs/tutorial');
  console.log('');
  console.log('  The skill generates HonKit-compatible markdown files.');
  console.log('  To preview as HTML, install HonKit separately:');
  console.log('    npm install -g honkit');
  console.log('    cd ./docs/tutorial && honkit serve');
  console.log('');
  console.log('🧪 Test the skill:');
  console.log('  cd', path.join(SKILL_DIR, 'tests/java'));
  console.log('  # Then in Claude Code: /tutorial build');
  console.log('');
  console.log('📚 Documentation:');
  console.log('  README:', path.join(SKILL_DIR, 'README.md'));
  console.log('  SKILL:  ', path.join(SKILL_DIR, 'SKILL.md'));
  console.log('');
}

module.exports = { install };
