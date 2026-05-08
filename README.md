# Tutorial Skill

This skill generates code tutorials from source code using Large Language Models (LLMs). It analyzes the source code, identifies abstractions and relationships, and generates a structured tutorial with chapters.

**Features**:
- 🏗️ **Multi-module support**: Detects Maven multi-module, npm workspaces, monorepos, and generates hierarchical tutorials
- 📚 **Single or comprehensive**: Choose to generate for one module or all modules in your project
- 🎨 **Professional output**: HonKit (Markdown) or Antora (AsciiDoc) compatible with diagrams, practice exercises, and custom styling
- 🔄 **Flexible structure**: Easy to split multi-module tutorials into standalone modules
- 📝 **Multiple formats**: Generate Markdown for HonKit or AsciiDoc for Antora with `--engine` flag
 

### Quick start
```bash
# 1. Navigate to your project
cd /path/to/your/project

# 2. Install the skill locally "install -g" for global install.
npx @sshaaf/tutorial-skill install

# 3. Reload your coding agent (e.g., restart Claude Code CLI or reload IDE)

# 4. Generate tutorial (in Claude Code)
/tutorial build
# Or for Antora: /tutorial build --engine antora

# 5. Preview the tutorial (optional)
# Option A: View markdown/AsciiDoc files directly (VS Code, etc.)
# Option B: Preview as HTML with HonKit (for Markdown output)
npm install -g honkit
cd ./docs/tutorial
honkit serve
# Option C: Preview as HTML with Antora (for AsciiDoc output)
npm install -g @antora/cli @antora/site-generator-default
# Create playbook (configure url, start_path, supplemental_files), then: antora antora-playbook.yml
```

**What happens**:
- Step 2 creates `.claude/tutorial/` in your project with both HonKit and Antora templates
- Step 4 generates tutorial files in `./docs/tutorial/` (Markdown for HonKit or AsciiDoc for Antora)
- Step 5 (optional) serves an interactive HTML site

![Example](.github/assets/images/example-preview.jpg)


## Pipeline Overview

### Build Mode (6 stages)
1. **Code Discovery**: Find and read source files
2. **Identify Abstractions**: Extract core concepts
3. **Analyze Relationships**: Map component interactions
4. **Organize Chapters**: Determine pedagogical order
5. **Generate Metadata**: Create tutorial info
6. **Write Content**: Generate introduction + chapters

## Language Support

Works with any programming language:
- Java, Python, JavaScript/TypeScript, Go, C#, Ruby, PHP, Rust, Kotlin etc.

## Commands

### `/tutorial build`
Complete tutorial generation with chapters
- **Time**: 10-30 minutes
- **Output**: Documentation files (Markdown for HonKit or AsciiDoc for Antora)
- **Use for**: Creating learning materials, documentation, training resources
- **Supports**: Multi-module projects (Maven, npm workspaces, monorepos)
- **Engines**:
  - `--engine honkit` (default): Generates Markdown files for HonKit static site generator
  - `--engine antora`: Generates AsciiDoc files for Antora documentation system

## Installation

### Local Installation (per-project)

```bash
# Navigate to your project directory
cd /path/to/your/project

# Install via NPM (recommended)
npx @sshaaf/tutorial-skill install
```

This creates `.claude/tutorial/` in your project directory with:
- Skill definition (SKILL.md) - enables `/tutorial build` command
- Templates for tutorial generation (HonKit-compatible markdown)

**Benefits of local installation**:
- ✅ Version control templates with your project
- ✅ Customize templates per project
- ✅ Multiple projects can have different versions
- ✅ No global state - everything is project-local

### Global Installation (system-wide)

```bash
# Install globally (available in all projects)
npx @sshaaf/tutorial-skill install -g
```

This creates `~/.claude/skills/tutorial/` with:
- Skill definition (SKILL.md) - enables `/tutorial build` in any project
- Templates for tutorial generation (HonKit-compatible markdown)

**Benefits of global installation**:
- ✅ One installation works everywhere
- ✅ No per-project setup needed
- ✅ Consistent templates across all projects
- ✅ Simpler for single-user environments

**Preview generated tutorials**:
The skill generates HonKit-compatible markdown. To preview as HTML:
```bash
# Install HonKit globally (one-time)
npm install -g honkit

# Preview any generated tutorial
cd ./docs/tutorial
honkit serve
# Opens at http://localhost:4000
```

### Updating

**Local installation:**
```bash
# Navigate to the project directory where you installed the skill
cd /path/to/your/project

# Check for updates
npx @sshaaf/tutorial-skill update --check

# Update to latest version (with automatic backup)
npx @sshaaf/tutorial-skill update

# Update without backup
npx @sshaaf/tutorial-skill update --no-backup

# Force update even if on latest version
npx @sshaaf/tutorial-skill update --force
```

**Global installation:**
```bash
# Can run from any directory

# Check for updates
npx @sshaaf/tutorial-skill update -g --check

# Update to latest version (with automatic backup)
npx @sshaaf/tutorial-skill update -g

# Update without backup
npx @sshaaf/tutorial-skill update -g --no-backup

# Force update even if on latest version
npx @sshaaf/tutorial-skill update -g --force
```

**Important notes about updates**:
- ⚠️ Updates **overwrite** files in `.claude/tutorial/` (local) or `~/.claude/skills/tutorial/` (global) including templates
- ✅ Automatic backup created at `.backup/` subdirectory before update
- ✅ Rolls back automatically if update fails
- 💡 If you customized templates, backup is your safety net

**Workflow for customized templates**:
```bash
# Before update - manually save your customizations
cp -r .claude/tutorial/templates .claude/tutorial/templates.custom

# Run update
npx @sshaaf/tutorial-skill update

# After update - restore specific customizations
# (merge changes as needed)
diff -r .claude/tutorial/templates .claude/tutorial/templates.custom
```

**Alternative methods:**
```bash
# Manual install from source (run from project directory)
cp -r /path/to/tutorial-skill .claude/tutorial

# Or clone directly
git clone https://github.com/sshaaf/tutorial-skill .claude/tutorial
```

**Version control (local installation only)**:
```bash
# Option 1: Exclude from git (recommended for most users)
echo ".claude/" >> .gitignore

# Option 2: Commit templates for team customization
git add .claude/tutorial/templates/
git add .claude/tutorial/SKILL.md
git commit -m "Add customized tutorial templates"
```

**Note**: Global installations (`~/.claude/skills/tutorial/`) are in your home directory and not part of any project repository.

**Managing multiple projects**:
```bash
# Each project has its own local installation
cd ~/projects/app-A
npx @sshaaf/tutorial-skill install  # Creates app-A/.claude/tutorial/

cd ~/projects/app-B
npx @sshaaf/tutorial-skill install  # Creates app-B/.claude/tutorial/

# Customize templates differently per project
vim ~/projects/app-A/.claude/tutorial/templates/honkit/index.md
vim ~/projects/app-B/.claude/tutorial/templates/honkit/index.md

# Updates are per-project
cd ~/projects/app-A
npx @sshaaf/tutorial-skill update  # Updates only app-A

cd ~/projects/app-B
npx @sshaaf/tutorial-skill update  # Updates only app-B
```

### Usage

**Generate tutorial** (in Claude Code):

```bash
# Default (HonKit/Markdown)
/tutorial build .

# With Antora (AsciiDoc)
/tutorial build --engine antora

# With output directory
/tutorial build --output ./docs/tutorial

# Combine options
/tutorial build --engine antora --output ./docs/tutorial
```

**Preview generated tutorials**:

HonKit (Markdown):
```bash
npm install -g honkit
cd ./docs/tutorial
honkit serve
# Opens at http://localhost:4000
```

Antora (AsciiDoc):
```bash
npm install -g @antora/cli @antora/site-generator-default
# Create antora-playbook.yml (see template README for configuration)
antora antora-playbook.yml
npx http-server build/site -p 8080
# Opens at http://localhost:8080
# Note: Mermaid diagrams render client-side via supplemental-ui
```

**Output formats**:
- **HonKit**: Generates `README.md`, `SUMMARY.md`, `book.json`, `*.md` chapters
- **Antora**: Generates `antora.yml`, `modules/ROOT/nav.adoc`, `modules/ROOT/pages/*.adoc` chapters

### Developer Notes

If you are testing changes **before publishing** to npm:

See `DEV_TESTING.md` for the testing checklist.

## Tips

### For Best Analysis
- Focus on specific directories for large projects
- Exclude test files (done automatically)
- Ask follow-up questions after analysis

### For Best Tutorials
- Specify target audience (beginner/intermediate/advanced)
- Review chapter order before generation
- Regenerate specific chapters if needed

### For Multi-Module Projects
- The skill auto-detects Maven multi-module, npm workspaces, monorepos, etc.
- **Choose "All modules"** to create comprehensive system-wide tutorial
  - Each module gets a COMPLETE tutorial (getting-started → all chapters → conclusion)
  - Same depth and quality as single-module mode
  - Hierarchical navigation links all modules together
  - Each module is fully standalone and can be extracted
- **Choose "Specific module"** to focus on one module at a time
- Multi-module tutorials are easy to split: just copy a module directory for standalone use
- Learn modules in any order - each is self-contained

## Documentation

- **SKILL.md**: Complete skill implementation
- **DEV_TESTING.md**: Local testing checklist for maintainers
- **Installation**: See parent directory QUICK-START.md
- **Comparison**: See parent directory SKILLS-README.md

## Based On

Extracted from [Waver LLM](https://github.com/sshaaf/waver-llm) by Shaaf Syed.

## License

MIT License (same as Waver LLM)
