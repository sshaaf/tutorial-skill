# Tutorial Skill - Project Configuration

This is a Claude Code skill for generating tutorials and analyzing codebases.

## Recent Updates (2026-05-05)

### HonKit local preview + diagnostics

The skill supports `/tutorial preview` and `/tutorial doctor`, backed by a bundled HonKit runtime installed under:

`~/.claude/skills/tutorial/.runtime/honkit`

Diagram rendering uses **`honkit-plugin-mermaid-hybrid`** (newer Mermaid than legacy GitBook Mermaid plugins).

Maintainers should validate locally using the repo CLI (`./bin/cli.js`) — see `DEV_TESTING.md`.

### Architecture Diagram Export Feature

After completing the analysis phase (`/tutorial analyze`), the skill now proactively asks users if they want to save the architecture diagram to disk.

**New behavior in Stage 3 (Analyze Relationships)**:
- After displaying the analysis results, prompts user to save the diagram
- Offers two save formats:
  - **Mermaid diagram** (`.mmd` file) - just the diagram
  - **Full analysis** (`.md` file) - complete analysis with abstractions, overview, diagram, and relationships
- Asks for filename with sensible defaults
- Confirms when file is saved

This enhancement makes it easy to share and reuse architecture diagrams without having to manually copy/paste from the conversation.

## Skill Modes

### Analyze Mode (`/tutorial analyze`)
- 3-stage pipeline for quick codebase understanding
- Generates architecture diagrams with Mermaid
- **NEW**: Option to save diagrams to disk
- Time: 2-5 minutes

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
1. Keep the analyze mode fast and interactive
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
