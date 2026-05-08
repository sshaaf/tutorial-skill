const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const SKILL_DIR = path.join(os.homedir(), '.claude/skills/tutorial');
const SOURCE_DIR = __dirname;
const HONKIT_RUNTIME_DIR = path.join(SKILL_DIR, '.runtime', 'honkit');
const HONKIT_RUNTIME_PACKAGE = path.join(HONKIT_RUNTIME_DIR, 'package.json');
const HONKIT_RUNTIME_MARKER = path.join(HONKIT_RUNTIME_DIR, '.installed');

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

function bootstrapHonkitRuntime() {
  console.log('📚 Bootstrapping bundled HonKit runtime...');

  if (!fs.existsSync(HONKIT_RUNTIME_DIR)) {
    fs.mkdirSync(HONKIT_RUNTIME_DIR, { recursive: true });
  }

  if (!fs.existsSync(HONKIT_RUNTIME_PACKAGE)) {
    const runtimePackage = {
      name: 'tutorial-skill-honkit-runtime',
      private: true
    };
    fs.writeFileSync(HONKIT_RUNTIME_PACKAGE, `${JSON.stringify(runtimePackage, null, 2)}\n`);
  }

  // Remove legacy Mermaid package if it exists from older installs.
  try {
    execFileSync('npm', ['uninstall', '--no-audit', '--no-fund', 'gitbook-plugin-mermaid-gb3'], {
      cwd: HONKIT_RUNTIME_DIR,
      stdio: 'inherit'
    });
  } catch (error) {
    // Ignore uninstall errors (package may not be installed)
  }

  execFileSync(
    'npm',
    ['install', '--no-audit', '--no-fund', 'honkit', 'honkit-plugin-mermaid-hybrid'],
    { cwd: HONKIT_RUNTIME_DIR, stdio: 'inherit' }
  );

  fs.writeFileSync(HONKIT_RUNTIME_MARKER, `${new Date().toISOString()}\n`);
  console.log('✅ HonKit runtime ready.');
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
  console.log('');
  try {
    bootstrapHonkitRuntime();
  } catch (error) {
    console.log('');
    console.error('❌ Failed to bootstrap bundled HonKit runtime.');
    console.error('Please make sure npm is installed and your network is available, then retry.');
    console.error('');
    console.error(error.message);
    process.exit(1);
  }

  // Write version information
  writeVersionFile();

  console.log('');
  console.log(isUpdate ? '✅ Update complete!' : '✅ Installation complete!');
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
  console.log('  Local HonKit Preview (default docs engine):');
  console.log('    node', path.join(SKILL_DIR, 'bin/cli.js'), 'runtime install');
  console.log('    node', path.join(SKILL_DIR, 'bin/cli.js'), 'init --dir ./docs/tutorial');
  console.log('    node', path.join(SKILL_DIR, 'bin/cli.js'), 'preview --dir ./docs/tutorial');
  console.log('    node', path.join(SKILL_DIR, 'bin/cli.js'), 'doctor --dir ./docs/tutorial');
  console.log('');
  console.log('  Published-package equivalents (after npm publish):');
  console.log('    npx @sshaaf/tutorial-skill@latest init --dir ./docs/tutorial');
  console.log('    npx @sshaaf/tutorial-skill@latest preview --dir ./docs/tutorial');
  console.log('    npx @sshaaf/tutorial-skill@latest doctor --dir ./docs/tutorial');
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

module.exports = { install, bootstrapHonkitRuntime };
