# Tutorial Skill - Project Configuration

This is a Claude Code skill for generating tutorials and analyzing codebases.

## Recent Updates (2026-05-08)

### Multi-Module Project Support

The skill now detects multi-module projects (Maven multi-module, npm workspaces, monorepos, etc.) and asks users whether to:
- **Generate comprehensive tutorial** covering all modules with hierarchical structure
- **Focus on specific module** for in-depth single-module tutorial

**Multi-module detection patterns**:
- Maven: `pom.xml` with `<modules>` section
- Gradle: `settings.gradle` with `include` statements
- npm/Yarn: `package.json` with `workspaces`
- Monorepo: `packages/`, `apps/`, `services/` directories
- Go: Multiple `go.mod` files
- .NET: `*.sln` files

**Multi-module output structure**:
```
tutorials/
  README.md                  # System overview
  01-getting-started.md      # Global setup
  module-a/
    README.md                # Module intro
    01-*.md, 02-*.md        # Module chapters
  module-b/
    README.md
    01-*.md, 02-*.md
  conclusion.md              # System synthesis
  SUMMARY.md                 # Hierarchical navigation
```

**Benefits**:
- Learn entire system progressively
- Easy to extract modules as standalone tutorials
- Clear system organization in navigation
- Each module self-contained

### Installation Patterns

The skill supports both local (per-project) and global (system-wide) installation:

**Local installation** (default):
```bash
npx @sshaaf/tutorial-skill install
```
- Installs to `.claude/tutorial/` in current project directory
- **Version control**: Commit templates and skill configuration with your project
- **Per-project customization**: Each project can customize templates independently
- **No global state**: Multiple projects can use different versions
- **Team sharing**: Teams can share customized templates via git

**Global installation**:
```bash
npx @sshaaf/tutorial-skill install -g
```
- Installs to `~/.claude/skills/tutorial/` (system-wide)
- **Available everywhere**: Works in all projects without per-project setup
- **Consistent templates**: Same templates across all projects
- **Simpler setup**: One installation for all projects

**Installation structure** (same for both):
```
.claude/tutorial/  (or ~/.claude/skills/tutorial/)
  SKILL.md              # Skill definition
  templates/honkit/     # Customizable HonKit-compatible templates
  bin/                  # CLI tools (install, update)
  lib/                  # Helper libraries
  .version              # Version tracking
```

**Update behavior**:
- Local: `npx @sshaaf/tutorial-skill update` (run from project directory)
- Global: `npx @sshaaf/tutorial-skill update -g` (run from anywhere)
- Creates automatic backup at `.backup/` subdirectory before updating
- **WARNING**: Updates overwrite all files including templates
- Users who customize templates should manually backup before updating

## Previous Updates (2026-05-05)

### HonKit-Compatible Output

The skill generates HonKit-ready tutorial files with:
- Markdown chapters with proper formatting
- `README.md` (landing page with architecture diagram)
- `SUMMARY.md` (table of contents with hierarchical structure)
- `book.json` (HonKit configuration with mermaid-hybrid plugin)
- `styles/website.css` (professional styling)

**Preview workflow**:
Users can preview generated tutorials by installing HonKit separately:
```bash
npm install -g honkit
cd ./docs/tutorial
honkit serve
```

Diagram rendering uses **`honkit-plugin-mermaid-hybrid`** (newer Mermaid than legacy GitBook plugins).

### Architecture Diagram Export Feature

After completing the analysis phase (Stage 3 of `/tutorial build`), the skill now proactively asks users if they want to save the architecture diagram to disk.

**New behavior in Stage 3 (Analyze Relationships)**:
- After displaying the analysis results, prompts user to save the diagram
- Offers two save formats:
  - **Mermaid diagram** (`.mmd` file) - just the diagram
  - **Full analysis** (`.md` file) - complete analysis with abstractions, overview, diagram, and relationships
- Asks for filename with sensible defaults
- Confirms when file is saved

This enhancement makes it easy to share and reuse architecture diagrams without having to manually copy/paste from the conversation.

## Skill Command

### Build Mode (`/tutorial build`)
- 6-stage pipeline for comprehensive tutorial generation
- Creates multi-chapter Markdown tutorials with HonKit-ready files
- Supports multi-module projects (Maven, npm workspaces, monorepos)
- Generates practice exercises, architecture diagrams, and navigation
- Time: 10-30 minutes

## Development Guidelines

When updating this skill:
1. Keep the analysis stages (1-3) fast and interactive
2. Maintain beginner-friendly language in generated content
3. Ensure architecture diagrams are saved in valid Mermaid format
4. Test with multiple programming languages
5. Update version in `package.json` before publishing

## File Structure

- `SKILL.md` - Main skill definition and instructions
- `package.json` - NPM package configuration
- `installer.js` - Installation script
- `bin/` - Executable commands
- `lib/` - HonKit docs helpers
- `DEV_TESTING.md` - Maintainer local testing notes
- `tests/` - Test files

## Publishing

See `PUBLISHING.md` for NPM publishing instructions.
