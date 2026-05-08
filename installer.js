const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const SOURCE_DIR = __dirname;

function getSkillDir(isGlobal) {
  return path.join(process.cwd(), '.claude/skills/tutorial');
}

function copyRecursive(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      // Skip NPM package metadata and development files during install
      if (['node_modules', 'installer.js', 'package.json', '.npmignore', 'PUBLISHING.md', '.git', '.gitignore'].includes(childItemName)) {
        return;
      }
      // Skip package tarballs (*.tgz)
      if (childItemName.endsWith('.tgz')) {
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


function writeVersionFile(skillDir) {
  const versionFilePath = path.join(skillDir, '.version');
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

function install(options = {}) {
  const { global: isGlobal = false } = options;
  const SKILL_DIR = getSkillDir(isGlobal);
  const isUpdate = fs.existsSync(SKILL_DIR);

  const installType = isGlobal ? 'globally' : 'locally';
  console.log(isUpdate ? `🔄 Updating Tutorial Skill (${installType})...` : `📦 Installing Tutorial Skill (${installType})...`);
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
  writeVersionFile(SKILL_DIR);

  console.log('');
  console.log(isUpdate ? '✅ Update complete!' : '✅ Installation complete!');
  console.log('');
  console.log('📍 Installed to:', SKILL_DIR);
  console.log('');

  if (!isUpdate) {
    if (!isGlobal) {
      console.log('💡 Version Control (local installation):');
      console.log('   • Exclude all: echo ".claude/" >> .gitignore');
      console.log('   • Commit templates: git add .claude/tutorial/templates/ .claude/tutorial/SKILL.md');
      console.log('');
    }
    console.log('📦 Updates:');
    const updateFlag = isGlobal ? ' -g' : '';
    console.log(`   • Check for updates: npx @sshaaf/tutorial-skill update${updateFlag} --check`);
    console.log(`   • Update (with backup): npx @sshaaf/tutorial-skill update${updateFlag}`);
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
