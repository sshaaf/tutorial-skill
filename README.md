# Tutorial Skill

A unified skill for AI-powered codebase analysis and tutorial generation.

## Commands

### `/tutorial analyze`
Fast codebase analysis with architecture diagrams
- **Time**: 2-5 minutes
- **Output**: Interactive summary + Mermaid diagram
- **Use for**: Understanding codebases, onboarding, planning refactors

### `/tutorial build`
Complete tutorial generation with chapters
- **Time**: 10-30 minutes
- **Output**: Multiple Markdown files + HonKit-ready docs scaffolding
- **Use for**: Creating learning materials, documentation, training resources

### `/tutorial preview`
Local tutorial preview with HonKit
- **Time**: 5-30 seconds to start
- **Output**: Local docs site (usually `http://localhost:4000`)
- **Use for**: Reviewing generated docs before publishing

### `/tutorial doctor`
Diagnostics for local preview/runtime + docs scaffolding
- **Time**: ~10-30 seconds
- **Output**: Pass/fail checklist
- **Use for**: Verifying HonKit runtime + `book.json` before publishing

## Quick Start

### Installation

```bash
# Install via NPM (recommended)
npx @sshaaf/tutorial-skill install
```

The installer bootstraps a local HonKit runtime under `~/.claude/skills/tutorial/.runtime/honkit` and installs `honkit-plugin-mermaid-hybrid` for diagram rendering.

**Alternative methods:**
```bash
# Manual install from source
cp -r tutorial ~/.claude/skills/tutorial

# Or extract from package
tar -xzf tutorial.skill -C ~/.claude/skills/
```

Note: alternative/manual installation methods do not bootstrap the bundled HonKit runtime; use the NPM installer for the default preview workflow.

### Usage

```bash
# Quick analysis
/tutorial analyze .

# With path
/tutorial analyze ./src/main/java

# Full tutorial
/tutorial build .

# With output directory
/tutorial build --output ./docs/tutorial

# Preview generated tutorial in Claude mode
/tutorial preview ./docs/tutorial

# Diagnose local preview/runtime/docs scaffolding
/tutorial doctor ./docs/tutorial

# Initialize docs files for HonKit
npx @sshaaf/tutorial-skill docs init --dir ./docs/tutorial

# Preview locally with HonKit
npx @sshaaf/tutorial-skill docs preview --dir ./docs/tutorial

# Build static site with HonKit
npx @sshaaf/tutorial-skill docs build --dir ./docs/tutorial

# Diagnose runtime/plugin setup
npx @sshaaf/tutorial-skill docs doctor --dir ./docs/tutorial
```

`honkit` is the default docs engine. `--engine honkit` is optional and supported for future engine compatibility.

### Developer / pre-publish CLI (git checkout)

If you are testing changes **before publishing** to npm, use the repo CLI (not `npx`), because `npx` resolves the **published** package version:

```bash
node ./bin/cli.js docs runtime install
node ./bin/cli.js docs init --dir ./docs/tutorial
node ./bin/cli.js docs doctor --dir ./docs/tutorial
node ./bin/cli.js docs preview --dir ./docs/tutorial
```

See `DEV_TESTING.md` for the short checklist.

## Examples

### Analyze a codebase
```
User: /tutorial analyze ./backend

Claude:
⏳ Discovering source files...
✓ Found 23 files (4,521 lines)

⏳ Identifying abstractions...
✓ Found 9 core components

## 🏗️ Architecture Diagram
[Shows Mermaid diagram]

## 📊 Core Components
[Lists components by category]
```

### Generate tutorial
```
User: /tutorial build .

Claude: I'll generate a tutorial. What directory should I analyze?

User: ./src

Claude:
[Runs 6-stage pipeline]
...
✅ Tutorial complete!
📁 Output: ./tutorials/
📄 Files: index.md + README.md + SUMMARY.md + book.json + 7 chapters
```

### Local docs workflow (default)
```bash
/tutorial build --output ./docs/tutorial
/tutorial preview ./docs/tutorial

# or use the CLI directly
node ./bin/cli.js docs preview --dir ./docs/tutorial

# published-package equivalent (after release):
# npx @sshaaf/tutorial-skill@latest docs preview --dir ./docs/tutorial
```

## Pipeline Overview

### Analyze Mode (3 stages)
1. **Code Discovery**: Find and read source files
2. **Identify Abstractions**: Extract core concepts
3. **Analyze Relationships**: Map component interactions

### Build Mode (6 stages)
1. **Code Discovery**: Find and read source files
2. **Identify Abstractions**: Extract core concepts
3. **Analyze Relationships**: Map component interactions
4. **Organize Chapters**: Determine pedagogical order
5. **Generate Metadata**: Create tutorial info
6. **Write Content**: Generate introduction + chapters

## Language Support

Works with any programming language:
- ✅ Java, Python, JavaScript/TypeScript
- ✅ Go, C#, Ruby, PHP, Rust, Kotlin
- ✅ And more...

## Tips

### For Best Analysis
- Focus on specific directories for large projects
- Exclude test files (done automatically)
- Ask follow-up questions after analysis

### For Best Tutorials
- Specify target audience (beginner/intermediate/advanced)
- Review chapter order before generation
- Regenerate specific chapters if needed

## Documentation

- **SKILL.md**: Complete skill implementation
- **DEV_TESTING.md**: Local testing checklist for maintainers
- **Installation**: See parent directory QUICK-START.md
- **Comparison**: See parent directory SKILLS-README.md

## Based On

Extracted from [Waver LLM](https://github.com/sshaaf/waver-llm) by Shaaf Syed.

## License

MIT License (same as Waver LLM)
