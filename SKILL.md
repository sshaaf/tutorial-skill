---
name: tutorial
description: Generate comprehensive, chapter-based tutorials from any codebase with AI. Use "/tutorial build" to analyze code architecture and create beginner-friendly tutorial content. Use "/tutorial preview" to view generated tutorials locally with HonKit. Use "/tutorial doctor" to diagnose local preview/runtime issues. Works with any programming language. Triggers on requests about creating tutorials, analyzing code architecture, understanding codebases, or generating learning materials.
---

# Tutorial Generator

## Instructions

### Overview

This skill provides three modes for tutorial generation and management:

1. **`/tutorial build`** - Comprehensive tutorial generation (10-30 minutes, 6-stage pipeline)
2. **`/tutorial preview`** - Local docs preview using bundled HonKit (5-30 seconds)
3. **`/tutorial doctor`** - Diagnose docs/runtime setup issues (10-30 seconds)

### Argument Parsing

When the skill is invoked, determine the mode and parse arguments:

- **Mode detection**: Check if invoked as `/tutorial build`, `/tutorial preview`, or `/tutorial doctor`
- **If no mode specified**: Default to build mode
- **Supported arguments**:
  - Path: `/tutorial build ./src/main/java`
  - Output: `/tutorial build --output ./docs`
  - Language: `/tutorial build --language python`
  - Focus: `/tutorial build --focus services`
  - Preview/Doctor Path: `/tutorial preview ./docs/tutorial` or `/tutorial preview --path ./docs/tutorial`

Parse arguments flexibly - accept both flags and positional arguments.

---

### Mode 1: Build (`/tutorial build`)

**Purpose**: Transform any codebase into comprehensive, beginner-friendly tutorials with architecture analysis.

**Use cases**: Learning materials, code documentation, training resources, educational content, onboarding

**Pipeline** (6 stages):

#### Stage 1: Code Discovery

1. **Determine project path**:
   - Use path from command args if provided, otherwise ask user
   - Auto-detect primary language from file extensions
   - Optionally ask if user wants to focus on specific areas

2. **Find source files using Glob** (exclude test/build directories):
   - Java: `**/*.java`, Python: `**/*.py`, JS/TS: `**/*.{js,ts,jsx,tsx}`
   - Go: `**/*.go`, C#: `**/*.cs`, Ruby: `**/*.rb`, Rust: `**/*.rs`, PHP: `**/*.php`

3. **Handle large codebases**: If >50 files found, ask to analyze all or focus on subdirectory

4. **Read files** with Read tool and report: "Found {N} files totaling {LOC} lines of code"

#### Stage 2: Identify Core Abstractions

**Task**: Identify the core abstractions - the main concepts, classes, modules, or patterns that define this codebase's architecture.

**Approach**: Analyze the code as a senior software architect would. For each abstraction, determine:

1. **name**: A concise, clear name for the concept
2. **description**: A 2-3 sentence explanation of what it does and why it exists (use simple, beginner-friendly language with analogies where helpful)
3. **category**: Classify as one of: "Model/Entity", "Service/Business Logic", "Controller/Handler", "Repository/Data Access", "Utility/Helper", "Configuration", "Interface/Contract", "Middleware", "Other"
4. **relevantFiles**: Array of file paths where this abstraction is primarily defined or used
5. **importance**: Rate as "core", "supporting", or "auxiliary"

**Requirements**:
- Focus on the most important abstractions
- Aim for 5-15 key concepts depending on codebase complexity
- Structure output as JSON: `{"abstractions": [...]}`

**Input to analyze**:
- Project Name: {project_name or "Unknown Project"}
- Primary Language: {detected_language}
- Codebase: {concatenated_file_contents}

**Example output structure**:
```json
{
  "abstractions": [
    {
      "name": "UserService",
      "description": "Handles all business logic related to user management, including registration, authentication, and profile updates. Think of it as the conductor that orchestrates user-related operations.",
      "category": "Service/Business Logic",
      "relevantFiles": ["src/services/UserService.java", "src/services/AuthService.java"],
      "importance": "core"
    }
  ]
}
```

**Display Results**: Show grouped abstractions (Core, Supporting, Auxiliary) with brief descriptions.

#### Stage 3: Analyze Relationships

**Task**: Identify how the identified components interact with each other.

**Approach**: Analyze as a software architect would. Provide:

1. **summary**: A 3-5 sentence high-level overview of:
   - The project's main purpose
   - The architectural style (MVC, layered, microservices, etc.)
   - The primary data flow or request flow
   - Use markdown formatting with **bold** for key concepts

2. **relationships**: Array of relationships between abstractions, where each includes:
   - **from**: Source abstraction index and name (format: "0 # AbstractionName")
   - **to**: Target abstraction index and name (format: "1 # OtherAbstraction")
   - **description**: Short phrase describing the relationship (e.g., "uses for data access", "extends", "validates input for", "sends events to")
   - **type**: Classify as "dependency", "inheritance", "composition", "calls", "data-flow", or "event"

**Requirements**:
- Every abstraction must appear in at least one relationship
- Focus on significant relationships - exclude trivial ones
- Prefer relationships backed by actual code interactions (method calls, field references)
- Limit to ~2-3 relationships per abstraction to avoid clutter
- Return JSON: `{"summary": "...", "relationships": [...]}`

**Input to analyze**:
- Project: {project_name}
- Language: {language}
- Abstractions (numbered): {numbered_list_of_abstractions_with_descriptions}
- Codebase: {concatenated_file_contents}

**Display Results**: Show project overview summary, Mermaid architecture diagram, and key relationships list.

#### Stage 4: Organize Chapters

**Goal**: Determine pedagogical order for teaching concepts (foundational → data access → business logic → presentation → cross-cutting concerns).

**Approach**: Organize abstractions into teaching order, considering dependencies and pedagogical flow.

**User Confirmation**: Show suggested chapter order and ask user to approve or modify.

#### Stage 5: Generate Tutorial Metadata

**Goal**: Generate metadata (title, description, difficulty, tags, prerequisites, estimated time).

**Approach**: Create tutorial metadata JSON with all required fields based on the analyzed codebase.

**Display**: Show generated metadata to user for confirmation.

#### Stage 6: Write Tutorial Content

**Goal**: Generate introduction and individual chapters as Markdown files.

**6a. Generate Introduction**: Create `index.md` with welcome, project overview, architecture diagram, technical stack, what they'll learn, and prerequisites.

**6b. Generate Individual Chapters**: For each abstraction in order, create a chapter file (`{N:02d}-{chapter-name}.md`) with:
- Introduction with analogy
- How it works
- Code deep dive with snippets
- Relationships to other components
- Key takeaways
- Next steps preview

Generate sequentially to allow cross-referencing. Show progress for each chapter.

#### Final Step: Create HonKit Navigation Files

After generating chapters, prepare for HonKit:
1. Ensure `README.md` exists (copy from `index.md` or create minimal version)
2. Create `SUMMARY.md` with navigation links to all chapters
3. Create `book.json` with title and `mermaid-hybrid` plugin

**Completion**: Show summary with output directory, files created, stats, and next steps (review, preview with `/tutorial preview`).

---

### Mode 2: Preview (`/tutorial preview`)

**Purpose**: Preview generated tutorial docs locally using bundled HonKit.

**Use cases**: Reviewing content, validating Mermaid diagrams, checking navigation, team demos

**Workflow**:
1. **Determine directory**: Use path from args, `--path` flag, or default to `./tutorials`
2. **Confirm exists**: If directory missing, suggest running `/tutorial build` first
3. **Serve docs**:
   - Local dev: `node <path-to-repo>/bin/cli.js docs preview --dir {path}`
   - Published: `npx @sshaaf/tutorial-skill@latest docs preview --dir {path}`
   - Auto-creates/updates HonKit files if needed
4. **Confirm**: Show preview URL (`http://localhost:4000`) and stop command (Ctrl+C)
5. **If fails**: Suggest runtime repair or skill reinstall

---

### Mode 3: Doctor (`/tutorial doctor`)

**Purpose**: Diagnose local docs preview issues.

**Workflow**:
1. **Determine directory**: Use path from args, `--path` flag, or default to `./tutorials`
2. **Run diagnostics**:
   - Local dev: `node <path-to-repo>/bin/cli.js docs doctor --dir {path}`
   - Published: `npx @sshaaf/tutorial-skill@latest docs doctor --dir {path}`
3. **Report**: Show pass/fail results with specific failing checks and fixes
4. **Common fixes**: Runtime repair, skill reinstall, docs init/preview commands

---

### General Guidelines

**Error Handling**:
- No files found: Verify path and suggest alternatives
- Too many files: Recommend focusing on subdirectory
- JSON parse error: Show raw output and retry
- Missing relationships: Some components can be standalone
- User cancels: Respect cancellation at any stage

**Progress Updates**: Show clear stage indicators (e.g., "⏳ Stage 2/6: Identifying abstractions... ✓ Identified 8 core components")

**Tips**:
- Build: Focus on specific modules for large projects, confirm chapter order before generation, generate one module at a time for large projects
- Preview/Doctor: Use local dev CLI before publishing, suggest reinstall if runtime fails

---

## Examples

### Build Mode

```bash
# Basic tutorial generation
/tutorial build .

# With output directory
/tutorial build --output ./docs/tutorial

# Complete specification
/tutorial build ./src/main/java --output ./tutorials --name "Spring Boot API" --audience intermediate
```

### Preview Mode

```bash
# Preview default directory
/tutorial preview

# Preview specific directory
/tutorial preview ./docs/tutorial

# Preview with flag
/tutorial preview --path ./docs/tutorial

# Local dev (from repo)
node ./bin/cli.js docs preview --dir ./docs/tutorial

# Published version
npx @sshaaf/tutorial-skill@latest docs preview --dir ./docs/tutorial
```

### Doctor Mode

```bash
# Diagnose default directory
/tutorial doctor

# Diagnose specific directory
/tutorial doctor ./docs/tutorial

# Diagnose with flag
/tutorial doctor --path ./docs/tutorial
```

### Interactive Workflow

```
User: /tutorial build .

Claude: I'll generate a comprehensive tutorial. What directory should I analyze?

User: ./src/main/java

Claude:
⏳ Stage 1/6: Discovering source files...
✓ Found 18 Java files (3,245 lines)

⏳ Stage 2/6: Identifying abstractions...
✓ Found 9 core components

⏳ Stage 3/6: Analyzing relationships...
✓ Generated architecture diagram

[Shows architecture diagram and summary]

⏳ Stage 4/6: Organizing chapters...
[Shows suggested chapter order]

⏳ Stage 5/6: Generating tutorial metadata...
[Shows tutorial metadata]

⏳ Stage 6/6: Writing tutorial content...
✓ Created index.md
✓ Created chapter 01-user-service.md
✓ Created chapter 02-data-repository.md
...

✅ Complete! Tutorial saved to ./tutorials

Next steps:
- Review the generated content
- Preview with: /tutorial preview ./tutorials
```
