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

Once published, users simply run:

```bash
npx @sshaaf/tutorial-skill install
```

Or just:

```bash
npx @sshaaf/tutorial-skill
```

(install is the default command)

## Package Structure

```
tutorial/
├── SKILL.md           # Main skill (bundled)
├── README.md          # Skill docs (bundled)
├── tests/             # Test projects (bundled)
├── package.json       # NPM config
├── bin/cli.js         # CLI entry
├── installer.js       # Install logic
├── .npmignore         # Exclude patterns
└── PUBLISHING.md      # This file (excluded)
```

## Update Instructions for Users

To update to a newer version:

```bash
rm -rf ~/.claude/skills/tutorial
npx @sshaaf/tutorial-skill@latest install
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
