# Local testing (developers)

This package has two surfaces:

- **Skill command**: `/tutorial build` - installed to `.claude/tutorial/SKILL.md` (what Claude reads and executes)
- **CLI utilities**: `bin/cli.js` + `lib/` - standalone tools for HonKit operations (`init`, `preview`, `build`, `doctor`)

**Important distinction**:
- The skill provides only `/tutorial build` for generating tutorials in Claude Code
- The CLI provides utilities for working with generated HonKit files (separate from the skill)

During development, treat the git checkout as the source of truth:

`git/SKILLS/tutorial-skill/bin/cli.js`

## Prerequisites

- Node + npm available on PATH
- Network access for the first HonKit runtime install (`npm install` into `.claude/tutorial/.runtime/honkit`)

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
│ 3. Preview locally (optional):                              │
│    npx @sshaaf/tutorial-skill preview --dir ./docs/tutorial │
│    → Serves at http://localhost:4000                        │
└─────────────────────────────────────────────────────────────┘

Developer workflow (testing before publish):
  Replace `npx @sshaaf/tutorial-skill` with `node ./bin/cli.js`
```

## Testing the skill command

Test `/tutorial build` in Claude Code after installing the skill:

```bash
# Install skill to local project
node ./bin/cli.js install

# In Claude Code, test the skill
/tutorial build ./src
```

## Testing CLI utilities (HonKit workflows)

Test the standalone CLI tools from the repo root:

```bash
# Install HonKit runtime
node ./bin/cli.js runtime install

# Initialize HonKit files (creates README.md, SUMMARY.md, book.json)
node ./bin/cli.js init --dir ./tutorials

# Run diagnostics
node ./bin/cli.js doctor --dir ./tutorials

# Preview locally (serves at http://localhost:4000)
node ./bin/cli.js preview --dir ./tutorials
```

### What “healthy” looks like

**Skill command**:
- `/tutorial build` generates complete tutorial with all files
- Creates README.md, SUMMARY.md, book.json, chapters, and conclusion

**CLI utilities**:
- `doctor` exits `0` with all checks passing
- `preview` logs include: `plugin “mermaid-hybrid” is loaded`
- HonKit serves at `http://localhost:4000`
- Mermaid diagrams render correctly in browser

## Publishing vs local CLI (`npx`)

`npx @sshaaf/tutorial-skill …` resolves to **whatever version is published on npm**.

If npm is behind your local checkout, `npx` will not expose new CLI commands yet. For pre-publish validation, always use:

```bash
node ./bin/cli.js …
```

## Skill install pitfalls

`.claude/tutorial/bin/cli.js` only exists if your installer copies `bin/`, `lib/`, and `installer.js` into the skill directory (this repo’s installer is intended to do that on install).

Do **not** assume `.claude/tutorial/bin/cli.js` exists unless that copy step ran.

If preview says the HonKit runtime is missing/out of date:

```bash
node ./bin/cli.js runtime install
```

## Best practices

**For skill testing**:
- Test `/tutorial build` with various project types (Maven, npm, monorepo)
- Verify multi-module detection prompts appear correctly
- Check generated files include all required sections (practice exercises, diagrams, navigation)

**For CLI testing**:
- **Always run `doctor`** before claiming preview works; it separates “markdown exists” vs “runtime/plugins healthy”
- **Keep `book.json` managed by `init`** during iteration; don’t hand-edit unless you know the HonKit plugin names
- **Prefer upgrading the renderer when diagrams look wrong** before rewriting content:
  - Complex diagrams + older renderers often fail partially (single box / truncated graph)
- **Separate failures**:
  - Runtime/plugins issues: use `doctor` and check preview logs
  - Diagram syntax errors: check browser devtools console (Mermaid errors)

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

### CLI utility issues

**Problem**: HonKit runtime missing
```bash
node ./bin/cli.js runtime install
```

**Problem**: `book.json` plugin mismatch or missing files
```bash
node ./bin/cli.js init --dir ./tutorials
```

**Problem**: Published CLI stale (npx uses old version)
```bash
npm view @sshaaf/tutorial-skill version
```
If it’s older than your working checkout, use `node ./bin/cli.js …` until you publish.
