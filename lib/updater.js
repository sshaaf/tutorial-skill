const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SKILL_DIR = path.join(process.cwd(), '.claude/tutorial');
const VERSION_FILE = path.join(SKILL_DIR, '.version');
const BACKUP_DIR = path.join(SKILL_DIR, '.backup');

function getCurrentVersion() {
  if (!fs.existsSync(VERSION_FILE)) {
    return null;
  }
  try {
    const versionData = JSON.parse(fs.readFileSync(VERSION_FILE, 'utf8'));
    return versionData.version;
  } catch (error) {
    return null;
  }
}

function getLatestVersion() {
  try {
    const result = execSync('npm view @sshaaf/tutorial-skill version', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore']
    });
    return result.trim();
  } catch (error) {
    console.error('❌ Failed to check latest version from npm');
    console.error('   Make sure you have network access');
    return null;
  }
}

function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    if (parts1[i] > parts2[i]) return 1;
    if (parts1[i] < parts2[i]) return -1;
  }
  return 0;
}

function checkForUpdates() {
  // Check if skill is installed locally
  if (!fs.existsSync(SKILL_DIR)) {
    console.log('❌ Tutorial skill not installed in this directory.');
    console.log('');
    console.log('Install it first:');
    console.log('   npx @sshaaf/tutorial-skill install');
    console.log('');
    console.log(`Expected location: ${SKILL_DIR}`);
    return null;
  }

  const current = getCurrentVersion();
  const latest = getLatestVersion();

  if (!current) {
    console.log('⚠️  No version information found.');
    console.log('   This may be a manual installation.');
    console.log('');
  }

  if (!latest) {
    return null;
  }

  console.log(`Current version: ${current}`);
  console.log(`Latest version:  ${latest}`);
  console.log('');

  const comparison = compareVersions(latest, current);

  if (comparison > 0) {
    console.log('✨ Update available!');
    console.log('');
    console.log('Run the following to update:');
    console.log('  npx @sshaaf/tutorial-skill update');
    return { current, latest, needsUpdate: true };
  } else if (comparison === 0) {
    console.log('✅ You have the latest version');
    return { current, latest, needsUpdate: false };
  } else {
    console.log('ℹ️  Your version is newer than published version');
    console.log('   (You may be running from a development checkout)');
    return { current, latest, needsUpdate: false };
  }
}

function createBackup() {
  if (!fs.existsSync(SKILL_DIR)) {
    return false;
  }

  console.log('📦 Creating backup...');

  // Remove old backup if exists
  if (fs.existsSync(BACKUP_DIR)) {
    fs.rmSync(BACKUP_DIR, { recursive: true, force: true });
  }

  // Create backup directory
  fs.mkdirSync(BACKUP_DIR, { recursive: true });

  // Copy important files
  const filesToBackup = [
    'SKILL.md',
    'templates',
    '.version',
    'package.json'
  ];

  filesToBackup.forEach((file) => {
    const src = path.join(SKILL_DIR, file);
    const dest = path.join(BACKUP_DIR, file);

    if (fs.existsSync(src)) {
      if (fs.statSync(src).isDirectory()) {
        fs.cpSync(src, dest, { recursive: true });
      } else {
        fs.copyFileSync(src, dest);
      }
    }
  });

  console.log('✅ Backup created at:', BACKUP_DIR);
  return true;
}

function restoreBackup() {
  if (!fs.existsSync(BACKUP_DIR)) {
    console.error('❌ No backup found');
    return false;
  }

  console.log('🔄 Restoring from backup...');

  // Copy backed up files back
  const files = fs.readdirSync(BACKUP_DIR);
  files.forEach((file) => {
    const src = path.join(BACKUP_DIR, file);
    const dest = path.join(SKILL_DIR, file);

    if (fs.statSync(src).isDirectory()) {
      if (fs.existsSync(dest)) {
        fs.rmSync(dest, { recursive: true });
      }
      fs.cpSync(src, dest, { recursive: true });
    } else {
      fs.copyFileSync(src, dest);
    }
  });

  console.log('✅ Restored from backup');
  return true;
}

function hasCustomizations() {
  if (!fs.existsSync(VERSION_FILE)) {
    return false;
  }

  try {
    const versionData = JSON.parse(fs.readFileSync(VERSION_FILE, 'utf8'));
    return versionData.customized || false;
  } catch (error) {
    return false;
  }
}

function checkTemplateCustomization() {
  const templatesDir = path.join(SKILL_DIR, 'templates');
  if (!fs.existsSync(templatesDir)) {
    return false;
  }

  // Check .version file for customized flag
  if (fs.existsSync(VERSION_FILE)) {
    try {
      const versionData = JSON.parse(fs.readFileSync(VERSION_FILE, 'utf8'));
      if (versionData.customized) {
        return true;
      }
    } catch (error) {
      // Ignore parse errors
    }
  }

  return false;
}

function updateSkill(options = {}) {
  const { backup = true, force = false } = options;

  // Check if skill is installed locally
  if (!fs.existsSync(SKILL_DIR)) {
    console.log('❌ Tutorial skill not installed in this directory.');
    console.log('');
    console.log('Install it first:');
    console.log('   npx @sshaaf/tutorial-skill install');
    console.log('');
    console.log(`Expected location: ${SKILL_DIR}`);
    return false;
  }

  // Check current version
  const current = getCurrentVersion();
  const latest = getLatestVersion();

  if (!current) {
    console.log('⚠️  No version information found.');
    console.log('   This may be a manual installation. Proceeding anyway...');
    console.log('');
  }

  if (!latest) {
    console.error('❌ Could not determine latest version');
    return false;
  }

  if (current) {
    console.log(`Current version: ${current}`);
  }
  console.log(`Latest version:  ${latest}`);
  console.log('');

  if (!force && current && compareVersions(latest, current) <= 0) {
    console.log('✅ Already up to date!');
    return true;
  }

  // Warn about template overwrite
  const hasCustomTemplates = checkTemplateCustomization();
  console.log('⚠️  WARNING: Update will overwrite files in .claude/tutorial/');
  console.log('');
  console.log('Files that will be updated:');
  console.log('  • SKILL.md');
  console.log('  • templates/ (all template files)');
  console.log('  • bin/ (CLI tools)');
  console.log('  • lib/ (helper libraries)');
  console.log('');

  if (hasCustomTemplates) {
    console.log('🔔 NOTICE: Customized templates detected!');
    console.log('   Your custom templates will be overwritten.');
    console.log('   A backup will be created at: .claude/tutorial/.backup/');
    console.log('');
  }

  if (backup) {
    console.log('Creating backup before update...');
    console.log('');
  }

  // Create backup if requested
  if (backup) {
    createBackup();
  }

  try {
    console.log('⬇️  Downloading latest version...');

    // Use npx to download and run the latest installer
    const installer = require('../installer');

    // Run installation
    console.log('📦 Installing update...');
    installer.install();

    console.log('');
    console.log('✅ Successfully updated!');
    console.log(`   ${current} → ${latest}`);

    // Check if there's a changelog
    console.log('');
    console.log('📝 What\'s new:');
    console.log(`   https://github.com/sshaaf/tutorial-skill/releases/tag/v${latest}`);

    return true;
  } catch (error) {
    console.error('❌ Update failed:', error.message);

    if (backup) {
      console.log('');
      console.log('Rolling back to previous version...');
      if (restoreBackup()) {
        console.log('✅ Rollback successful');
      } else {
        console.error('❌ Rollback failed - you may need to reinstall manually');
      }
    }

    return false;
  }
}

function cleanupBackup() {
  if (fs.existsSync(BACKUP_DIR)) {
    fs.rmSync(BACKUP_DIR, { recursive: true, force: true });
    console.log('✅ Cleaned up backup files');
  }
}

module.exports = {
  getCurrentVersion,
  getLatestVersion,
  checkForUpdates,
  createBackup,
  restoreBackup,
  updateSkill,
  cleanupBackup,
  hasCustomizations
};
