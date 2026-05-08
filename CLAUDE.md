# Tutorial Skill - Project Configuration

This is a Claude Code skill for generating tutorials and analyzing codebases.

## Recent Updates (2026-05-08)

### Antora Support

The skill now supports generating tutorials in AsciiDoc format for Antora documentation system.

**New `--engine` flag**:
- `--engine honkit` (default): Generates Markdown files for HonKit
- `--engine antora`: Generates AsciiDoc files for Antora

**Antora output structure**:
```
docs/
├── antora.yml                    # Component descriptor
├── modules/
│   └── ROOT/
│       ├── nav.adoc              # Navigation sidebar
│       ├── pages/
│       │   ├── index.adoc        # Landing page
│       │   ├── getting-started.adoc
│       │   ├── chapter-01.adoc
│       │   └── conclusion.adoc
│       ├── images/               # For diagrams
│       └── examples/             # For code samples
└── supplemental-ui/              # Client-side Mermaid rendering
    └── partials/
        └── footer-scripts.hbs    # Loads Mermaid.js from CDN
```

**Key differences from HonKit**:
- File extension: `.adoc` instead of `.md`
- Mermaid diagrams: Use `[mermaid]` directive with `....` delimiters (rendered client-side via Mermaid.js)
- Cross-references: Use `xref:filename.adoc[Link Text]` instead of `[Link Text](filename.md)`
- Structured module hierarchy: `modules/ROOT/pages/` instead of flat directory
- Includes supplemental-ui for client-side Mermaid rendering
- Requires Antora playbook configuration (url, start_path, worktrees, supplemental_files)

**Templates**:
Both template sets are installed at:
- `.claude/tutorial/templates/honkit/` - Markdown templates
- `.claude/tutorial/templates/antora/` - AsciiDoc templates

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
  README.md                       # System overview
  01-getting-started.md           # Global setup
  user-service/                   # Module 1 - COMPLETE TUTORIAL
    README.md                     # Module intro
    01-getting-started.md         # Module setup
    02-user-controller.md         # Code chapter
    03-user-service.md            # Code chapter
    04-user-repository.md         # Code chapter
    conclusion.md                 # Module conclusion
  payment-service/                # Module 2 - COMPLETE TUTORIAL
    README.md                     # Module intro
    01-getting-started.md         # Module setup
    02-payment-controller.md      # Code chapter
    03-payment-service.md         # Code chapter
    conclusion.md                 # Module conclusion
  conclusion.md                   # System synthesis
  SUMMARY.md                      # Hierarchical navigation
```

**Key principle**: Each module gets the SAME full treatment as single-module mode.

**Benefits**:
- Learn entire system progressively (or jump to specific modules)
- Each module is a COMPLETE standalone tutorial
- Same depth and quality as single-module tutorials
- Easy to extract: copy module directory for standalone use
- Hierarchical navigation shows system organization
- Module conclusions + system conclusion for different abstraction levels

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

**Preview workflows**:

HonKit (Markdown):
```bash
npm install -g honkit
cd ./docs/tutorial
honkit serve
```
Diagram rendering uses **`honkit-plugin-mermaid-hybrid`** (newer Mermaid than legacy GitBook plugins).

Antora (AsciiDoc):
```bash
npm install -g @antora/cli @antora/site-generator-default
# Create antora-playbook.yml (configure url, start_path, worktrees, supplemental_files)
antora antora-playbook.yml
npx http-server build/site -p 8080
```
Diagram rendering uses **client-side Mermaid.js** loaded from CDN via `supplemental-ui/partials/footer-scripts.hbs`.

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
- Creates multi-chapter tutorials in Markdown (HonKit) or AsciiDoc (Antora) format
- Supports multi-module projects (Maven, npm workspaces, monorepos)
- Generates practice exercises, architecture diagrams, and navigation
- Time: 10-30 minutes
- **Engine options**:
  - `--engine honkit` (default): Generates Markdown for HonKit
  - `--engine antora`: Generates AsciiDoc for Antora

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
- `lib/` - Helper libraries (updater)
- `templates/` - Template directories
  - `honkit/` - Markdown templates for HonKit
  - `antora/` - AsciiDoc templates for Antora
- `DEV_TESTING.md` - Maintainer local testing notes
- `tests/` - Test files

## Publishing

See `PUBLISHING.md` for NPM publishing instructions.
