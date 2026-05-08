const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const {
  HONKIT_RUNTIME_DIR,
  HONKIT_RUNTIME_BIN,
  HONKIT_RUNTIME_MARKER,
  HONKIT_MERMAID_PLUGIN_DIR,
  isHonkitRuntimeInstalled
} = require('./runtime');

function parseArgs(argv) {
  const parsed = { dir: process.cwd(), engine: 'honkit', dirProvided: false };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--dir' && argv[i + 1]) {
      parsed.dir = argv[i + 1];
      parsed.dirProvided = true;
      i += 1;
    } else if (token === '--engine' && argv[i + 1]) {
      parsed.engine = argv[i + 1];
      i += 1;
    }
  }
  return parsed;
}

function requireHonkitRuntime() {
  if (!isHonkitRuntimeInstalled()) {
    console.error('❌ HonKit runtime is missing or out of date.');
    console.error('Fix (local dev repo CLI):');
    console.error('  node <path-to-tutorial-skill-repo>/bin/cli.js runtime install');
    console.error('');
    console.error('Then retry:');
    console.error('  node <path-to-tutorial-skill-repo>/bin/cli.js preview --dir <path>');
    console.error('');
    console.error('Published-package equivalent (after you publish a release):');
    console.error('  rm -rf .claude/tutorial');
    console.error('  npx @sshaaf/tutorial-skill@latest install');
    process.exit(1);
  }
}

function toTitle(fileName) {
  return fileName
    .replace(/^\d+[-_]?/, '')
    .replace(/\.md$/i, '')
    .replace(/[-_]/g, ' ')
    .trim();
}

function createSummaryLines(chapterFiles) {
  const lines = ['# Summary', '', '* [Introduction](README.md)'];
  chapterFiles.forEach((file) => {
    lines.push(`* [${toTitle(file)}](${file})`);
  });
  lines.push('');
  return lines.join('\n');
}

function initHonkitDocs(targetDir) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const indexPath = path.join(targetDir, 'index.md');
  const readmePath = path.join(targetDir, 'README.md');
  if (!fs.existsSync(readmePath) && fs.existsSync(indexPath)) {
    fs.copyFileSync(indexPath, readmePath);
  } else if (!fs.existsSync(readmePath)) {
    fs.writeFileSync(readmePath, '# Tutorial\n\nWelcome!\n');
  }

  const chapterFiles = fs
    .readdirSync(targetDir)
    .filter((name) => /^\d+.*\.md$/i.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  fs.writeFileSync(path.join(targetDir, 'SUMMARY.md'), createSummaryLines(chapterFiles));

  const bookJsonPath = path.join(targetDir, 'book.json');
  let book = {};
  if (fs.existsSync(bookJsonPath)) {
    try {
      const raw = fs.readFileSync(bookJsonPath, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        book = parsed;
      }
    } catch (error) {
      // If book.json is invalid JSON, replace it with a valid default.
      book = {};
    }
  }

  if (!book.title) {
    book.title = 'Tutorial';
  }

  if (!Array.isArray(book.plugins)) {
    book.plugins = [];
  }

  // Migrate older defaults and enforce the supported Mermaid plugin.
  book.plugins = book.plugins.filter(
    (plugin) => plugin !== 'mermaid' && plugin !== 'mermaid-gb3'
  );
  if (!book.plugins.includes('mermaid-hybrid')) {
    book.plugins.push('mermaid-hybrid');
  }

  fs.writeFileSync(bookJsonPath, `${JSON.stringify(book, null, 2)}\n`);
}

function runHonkit(args, cwd) {
  const result = spawnSync(HONKIT_RUNTIME_BIN, args, {
    cwd,
    stdio: 'inherit'
  });
  if (result.error) {
    throw result.error;
  }
  process.exit(result.status || 0);
}

function initDocs(argv) {
  const { dir, engine } = parseArgs(argv);
  if (engine !== 'honkit') {
    console.error(`❌ Unsupported engine "${engine}". Supported: honkit`);
    process.exit(1);
  }

  initHonkitDocs(path.resolve(dir));
  console.log(`✅ HonKit docs initialized in ${path.resolve(dir)}`);
}

function previewDocs(argv) {
  const { dir, engine } = parseArgs(argv);
  if (engine !== 'honkit') {
    console.error(`❌ Unsupported engine "${engine}". Supported: honkit`);
    process.exit(1);
  }

  requireHonkitRuntime();
  const targetDir = path.resolve(dir);
  initHonkitDocs(targetDir);
  runHonkit(['serve'], targetDir);
}

function buildDocs(argv) {
  const { dir, engine } = parseArgs(argv);
  if (engine !== 'honkit') {
    console.error(`❌ Unsupported engine "${engine}". Supported: honkit`);
    process.exit(1);
  }

  requireHonkitRuntime();
  const targetDir = path.resolve(dir);
  initHonkitDocs(targetDir);
  runHonkit(['build'], targetDir);
}

function doctorDocs(argv) {
  const { dir, engine, dirProvided } = parseArgs(argv);
  if (engine !== 'honkit') {
    console.error(`❌ Unsupported engine "${engine}". Supported: honkit`);
    process.exit(1);
  }

  let hasFailures = false;
  const checks = [];
  const addCheck = (ok, label, detail) => {
    checks.push({ ok, label, detail });
    if (!ok) {
      hasFailures = true;
    }
  };

  addCheck(fs.existsSync(HONKIT_RUNTIME_DIR), 'HonKit runtime directory', HONKIT_RUNTIME_DIR);
  addCheck(fs.existsSync(HONKIT_RUNTIME_BIN), 'HonKit binary', HONKIT_RUNTIME_BIN);
  addCheck(fs.existsSync(HONKIT_RUNTIME_MARKER), 'Runtime install marker', HONKIT_RUNTIME_MARKER);
  addCheck(
    fs.existsSync(HONKIT_MERMAID_PLUGIN_DIR),
    'Mermaid plugin (mermaid-hybrid)',
    HONKIT_MERMAID_PLUGIN_DIR
  );
  addCheck(isHonkitRuntimeInstalled(), 'Runtime health', 'all required runtime files are present');

  const targetDir = path.resolve(dir);
  const inspectDocsDir = dirProvided;
  if (inspectDocsDir) {
    addCheck(fs.existsSync(targetDir), 'Docs directory', targetDir);
    if (fs.existsSync(targetDir)) {
      const readmePath = path.join(targetDir, 'README.md');
      const summaryPath = path.join(targetDir, 'SUMMARY.md');
      const bookJsonPath = path.join(targetDir, 'book.json');

      addCheck(fs.existsSync(readmePath), 'README.md', readmePath);
      addCheck(fs.existsSync(summaryPath), 'SUMMARY.md', summaryPath);
      addCheck(fs.existsSync(bookJsonPath), 'book.json', bookJsonPath);

      if (fs.existsSync(bookJsonPath)) {
        try {
          const raw = fs.readFileSync(bookJsonPath, 'utf8');
          const parsed = JSON.parse(raw);
          const plugins = Array.isArray(parsed.plugins) ? parsed.plugins : [];
          addCheck(plugins.includes('mermaid-hybrid'), 'book.json plugin config', 'contains "mermaid-hybrid"');
        } catch (error) {
          addCheck(false, 'book.json JSON parse', error.message);
        }
      }
    }
  }

  console.log('🔎 tutorial-skill doctor');
  console.log('');
  checks.forEach((check) => {
    console.log(`${check.ok ? '✅' : '❌'} ${check.label}: ${check.detail}`);
  });

  if (!inspectDocsDir) {
    console.log('');
    console.log('ℹ️ Tip: pass --dir <path> to validate a specific tutorial output directory.');
  }

  if (hasFailures) {
    console.log('');
    console.log('Suggested fix:');
    if (
      !checks.find((c) => c.label === 'HonKit runtime directory')?.ok ||
      !checks.find((c) => c.label === 'HonKit binary')?.ok ||
      !checks.find((c) => c.label === 'Runtime install marker')?.ok ||
      !checks.find((c) => c.label === 'Mermaid plugin (mermaid-hybrid)')?.ok ||
      !checks.find((c) => c.label === 'Runtime health')?.ok
    ) {
      console.log('  # Repair bundled HonKit runtime (local dev repo CLI):');
      console.log('  node <path-to-tutorial-skill-repo>/bin/cli.js runtime install');
      console.log('');
      console.log('  # If you installed via npm and your published package is outdated, reinstall after publishing:');
      console.log('  rm -rf .claude/tutorial');
      console.log('  npx @sshaaf/tutorial-skill@latest install');
    } else {
      console.log('  rm -rf .claude/tutorial');
      console.log('  npx @sshaaf/tutorial-skill@latest install');
    }
    if (inspectDocsDir) {
      console.log(`  npx @sshaaf/tutorial-skill init --dir ${targetDir}`);
    }
    process.exit(1);
  }

  console.log('');
  console.log('✅ doctor passed');
  process.exit(0);
}

module.exports = {
  initDocs,
  previewDocs,
  buildDocs,
  doctorDocs
};
