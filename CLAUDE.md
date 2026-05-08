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

### Local Installation Pattern

The skill now installs locally to `.claude/tutorial/` in your project directory instead of globally to `~/.claude/skills/tutorial/`. This enables:

- **Version control**: Commit templates and skill configuration with your project
- **Per-project customization**: Each project can customize templates independently
- **No global state**: Multiple projects can use different versions
- **Team sharing**: Teams can share customized templates via git

When you run `npx @sshaaf/tutorial-skill install`, it creates:
```
your-project/
  .claude/
    tutorial/
      SKILL.md              # Skill definition
      templates/honkit/     # Customizable templates
      bin/                  # CLI tools
      lib/                  # Helper libraries
      .runtime/honkit/      # Bundled HonKit + plugins
      .version              # Version tracking
```

**Update behavior**:
- `npx @sshaaf/tutorial-skill update` updates the local installation in current directory
- Creates automatic backup at `.claude/tutorial/.backup/` before updating
- **WARNING**: Updates overwrite all files including templates
- Users who customize templates should manually backup before updating
- Runtime (`.runtime/honkit/`) is preserved across updates

## Previous Updates (2026-05-05)

### HonKit local preview + diagnostics

The skill supports `/tutorial preview` and `/tutorial doctor`, backed by a bundled HonKit runtime installed under:

`.claude/tutorial/.runtime/honkit` (in your project directory)

Diagram rendering uses **`honkit-plugin-mermaid-hybrid`** (newer Mermaid than legacy GitBook Mermaid plugins).

Maintainers should validate locally using the repo CLI (`./bin/cli.js`) — see `DEV_TESTING.md`.

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

## Skill Modes

### Build Mode (`/tutorial build`)
- 6-stage pipeline for comprehensive tutorial generation
- Creates multi-chapter Markdown tutorials with HonKit-ready files
- Time: 10-30 minutes

### Preview Mode (`/tutorial preview`)
- Previews generated tutorials locally with bundled HonKit
- Automatically prepares `README.md`, `SUMMARY.md`, and `book.json` if needed
- Time: 5-30 seconds

### Doctor Mode (`/tutorial doctor`)
- Runs diagnostics for bundled HonKit runtime + docs scaffolding (`README.md`, `SUMMARY.md`, `book.json`)
- Intended as the fastest “why isn’t preview working?” checklist

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
