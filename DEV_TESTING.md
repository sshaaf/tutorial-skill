# Local testing (developers)

This package provides:

- **Skill command**: `/tutorial build` - installed to `.claude/tutorial/SKILL.md` (what Claude reads and executes)
- **CLI**: `bin/cli.js` - provides `install` and `update` commands

The skill generates HonKit-compatible markdown files. Users can preview using HonKit (installed separately).

During development, treat the git checkout as the source of truth:

`git/SKILLS/tutorial-skill/bin/cli.js`

## Prerequisites

- Node + npm available on PATH

## Understanding the workflow

```
┌─────────────────────────────────────────────────────────────┐
│ User workflow:                                               │
│                                                              │
│ 1. Install skill:                                           │
│    npx @sshaaf/tutorial-skill install                       │
│                                                              │
│ 2. Generate tutorial (in Claude Code):                      │
│    /tutorial build                                          │
│    → Creates: ./docs/tutorial/*.md, SUMMARY.md, book.json  │
│                                                              │
│ 3. Preview locally (optional, requires HonKit):             │
│    npm install -g honkit                                    │
│    cd ./docs/tutorial && honkit serve                       │
│    → Serves at http://localhost:4000                        │
└─────────────────────────────────────────────────────────────┘

Developer workflow (testing before publish):
  Replace `npx @sshaaf/tutorial-skill` with `node ./bin/cli.js`
```

## Testing the skill

Test `/tutorial build` in Claude Code after installing the skill:

**Local installation:**
```bash
# Install skill to local project
node ./bin/cli.js install

# In Claude Code, test the skill
/tutorial build ./src
```

**Global installation:**
```bash
# Install skill globally
node ./bin/cli.js install -g

# In Claude Code (from any project), test the skill
/tutorial build ./src
```

### What “healthy” looks like

**Skill command**:
- `/tutorial build` generates complete tutorial with all files
- Creates README.md, SUMMARY.md, book.json, chapters, and conclusion
- All markdown files include proper formatting, navigation, practice exercises
- Mermaid diagrams embedded in markdown

**Preview (optional, using HonKit separately)**:
```bash
npm install -g honkit
cd ./docs/tutorial
honkit serve
```
- HonKit serves at `http://localhost:4000`
- Mermaid diagrams render correctly in browser
- Navigation works between chapters

## Publishing vs local CLI (`npx`)

`npx @sshaaf/tutorial-skill …` resolves to **whatever version is published on npm**.

If npm is behind your local checkout, `npx` will not expose new CLI commands yet. For pre-publish validation, always use:

```bash
node ./bin/cli.js …
```

## Skill install details

The installer copies these to:
- **Local**: `.claude/tutorial/` (in current project)
- **Global**: `~/.claude/skills/tutorial/` (in home directory)

Files copied:
- `SKILL.md` (skill definition)
- `templates/` (HonKit-compatible markdown templates)
- `bin/cli.js`, `lib/`, `installer.js` (CLI tools for install/update)

The skill generates HonKit-compatible files. Users preview with HonKit (installed separately).

## Best practices

**For skill testing**:
- Test `/tutorial build` with various project types (Maven, npm, monorepo)
- Verify multi-module detection prompts appear correctly
- Check generated files include all required sections (practice exercises, diagrams, navigation)
- Verify `book.json` includes `mermaid-hybrid` plugin
- Check SUMMARY.md has correct hierarchical structure

**For HonKit preview (optional)**:
- Install HonKit globally: `npm install -g honkit`
- Test diagrams render correctly in browser
- Verify navigation links work between chapters
- Check that `book.json` plugin configuration is valid

## Minimal troubleshooting

### Skill command issues

**Problem**: `/tutorial build` not recognized in Claude Code
```bash
# Reinstall skill locally
node ./bin/cli.js install
# Then reload Claude Code
```

**Problem**: Generated tutorial missing sections
- Check SKILL.md has latest templates
- Verify templates exist in `.claude/tutorial/templates/honkit/`

**Problem**: HonKit preview not working
```bash
# Install HonKit globally
npm install -g honkit

# Navigate to generated tutorial
cd ./docs/tutorial

# Serve
honkit serve
```

**Problem**: Mermaid diagrams not rendering
- Check `book.json` includes `"mermaid-hybrid"` in plugins array
- Verify HonKit is latest version: `npm update -g honkit`
- Check browser console for Mermaid errors

**Problem**: Published CLI stale (npx uses old version)
```bash
npm view @sshaaf/tutorial-skill version
```
If it’s older than your working checkout, use `node ./bin/cli.js …` until you publish.
