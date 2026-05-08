# Publishing to NPM

## Prerequisites

1. **NPM Account**: Create one at https://www.npmjs.com/signup
2. **Login**: `npm login`

## Publishing Steps

### 1. Test Locally

```bash
cd ~/git/SKILLS/tutorial
npm link
tutorial-skill install
```

### 2. Verify Package Contents

```bash
npm pack --dry-run
```

This shows what will be included in the package.

### 3. Update Version (for future releases)

```bash
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

### 4. Publish to NPM

```bash
npm publish --access public
```

**Note**: The `@sshaaf/` scope requires `--access public` flag.

### 5. Test Installation

After publishing, test with:

```bash
npx @sshaaf/tutorial-skill install
```

## Usage for End Users

Once published, users can install locally or globally:

**Local installation** (per-project):
```bash
npx @sshaaf/tutorial-skill install
# Or just:
npx @sshaaf/tutorial-skill
```

**Global installation** (system-wide):
```bash
npx @sshaaf/tutorial-skill install -g
```

(install is the default command)

## Package Structure

```
tutorial/
├── SKILL.md           # Main skill (bundled)
├── README.md          # Skill docs (bundled)
├── templates/         # HonKit-compatible markdown templates (bundled)
├── lib/               # CLI helpers (bundled)
├── tests/             # Test projects (bundled)
├── package.json       # NPM config
├── bin/cli.js         # CLI entry (install, update commands)
├── installer.js       # Install logic
├── .npmignore         # Exclude patterns
└── PUBLISHING.md      # This file (excluded)
```

## HonKit Output Format

The skill generates HonKit-compatible markdown files:
- README.md (landing page with architecture diagram)
- SUMMARY.md (table of contents)
- book.json (HonKit configuration with mermaid-hybrid plugin)
- Chapter files with practice exercises and diagrams
- styles/website.css (professional styling)

Users can preview tutorials by installing HonKit separately:
```bash
npm install -g honkit
cd ./docs/tutorial
honkit serve
```

## Update Instructions for Users

To update to a newer version:

**Local installation:**
```bash
cd /path/to/your/project
npx @sshaaf/tutorial-skill update
```

**Global installation:**
```bash
npx @sshaaf/tutorial-skill update -g
```

**Manual update (if needed):**
```bash
# Local
rm -rf .claude/tutorial
npx @sshaaf/tutorial-skill@latest install

# Global
rm -rf ~/.claude/skills/tutorial
npx @sshaaf/tutorial-skill@latest install -g
```

## Unpublishing (Emergency Only)

```bash
npm unpublish @sshaaf/tutorial-skill@1.0.0
```

**Warning**: Can only unpublish within 72 hours of publishing.

## Verification

After publishing, verify:

```bash
# Check it's listed
npm view @sshaaf/tutorial-skill

# Check version
npm view @sshaaf/tutorial-skill version

# Check files
npm view @sshaaf/tutorial-skill files
```

## Registry

Published packages visible at:
https://www.npmjs.com/package/@sshaaf/tutorial-skill
