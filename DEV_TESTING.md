# Local testing (developers)

This package has two surfaces:

- **Skill files**: installed to `~/.claude/skills/tutorial` (what Claude reads)
- **CLI**: ships from this repo’s `bin/cli.js` + `lib/` (what powers `docs *`)

During development, treat the git checkout as the source of truth:

`/Users/sshaaf/git/SKILLS/tutorial-skill/bin/cli.js`

## Prerequisites

- Node + npm available on PATH
- Network access for the first HonKit runtime install (`npm install` into `~/.claude/skills/tutorial/.runtime/honkit`)

## Fast loop (recommended)

Run from the repo root:

```bash
node ./bin/cli.js docs runtime install
node ./bin/cli.js docs init --dir ./tutorials
node ./bin/cli.js docs doctor --dir ./tutorials
node ./bin/cli.js docs preview --dir ./tutorials
```

### What “healthy” looks like

- `docs doctor` exits `0`
- Preview logs include plugin load lines similar to:

  - `plugin "mermaid-hybrid" is loaded`

- HonKit serves at `http://localhost:4000`

## Publishing vs local CLI (`npx`)

`npx @sshaaf/tutorial-skill …` resolves to **whatever version is published on npm**.

If npm is behind your local checkout, `npx` will not expose new CLI commands yet. For pre-publish validation, always use:

```bash
node ./bin/cli.js …
```

## Skill install pitfalls

`~/.claude/skills/tutorial/bin/cli.js` only exists if your installer copies `bin/`, `lib/`, and `installer.js` into the skill directory (this repo’s installer is intended to do that on install).

Do **not** assume `~/.claude/skills/tutorial/bin/cli.js` exists unless that copy step ran.

If preview says the HonKit runtime is missing/out of date:

```bash
node ./bin/cli.js docs runtime install
```

## Best practices

- **Always run `docs doctor`** before claiming preview works; it separates “markdown exists” vs “runtime/plugins healthy”.
- **Keep `book.json` managed by `docs init`** during iteration; don’t hand-edit unless you know the HonKit plugin names.
- **Prefer upgrading the renderer when diagrams look wrong** before rewriting content:
  - Complex diagrams + older renderers often fail partially (single box / truncated graph).
- **Separate failures**:
  - Runtime/plugins (`docs doctor` / preview logs)
  - Diagram syntax (browser devtools console errors from Mermaid)

## Minimal troubleshooting

1. Runtime missing:

```bash
node ./bin/cli.js docs runtime install
```

2. `book.json` plugin mismatch:

```bash
node ./bin/cli.js docs init --dir ./tutorials
```

3. Published CLI stale:

```bash
npm view @sshaaf/tutorial-skill version
```

If it’s older than your working checkout, use `node ./bin/cli.js …` until you publish.
