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

3. **Discover build and configuration files**:
   - Build systems:
     - Java: `pom.xml`, `build.gradle`, `build.gradle.kts`, `settings.gradle`
     - JavaScript/TypeScript: `package.json`, `package-lock.json`, `yarn.lock`, `tsconfig.json`
     - Python: `requirements.txt`, `setup.py`, `pyproject.toml`, `Pipfile`
     - Go: `go.mod`, `go.sum`
     - Rust: `Cargo.toml`, `Cargo.lock`
     - Ruby: `Gemfile`, `Gemfile.lock`
     - .NET: `*.csproj`, `*.sln`
     - PHP: `composer.json`
   - Configuration files:
     - Environment: `.env.example`, `.env.sample`, `.env.template`, `config/*.properties`, `application.yml`, `application.properties`
     - Docker: `Dockerfile`, `docker-compose.yml`, `docker-compose.yaml`
     - Scripts: `*.sh`, `*.bat`, `Makefile`, `scripts/*`
   - Documentation: `README.md`, `CONTRIBUTING.md`, `docs/`

4. **Handle large codebases**: If >50 files found, ask to analyze all or focus on subdirectory

5. **Read files** with Read tool and report: "Found {N} source files totaling {LOC} lines of code, plus {M} configuration files"

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

**Goal**: Generate metadata for the tutorial including information needed for book.json template.

**Required fields**:
- `title` - Concise tutorial title (used in book.json)
- `description` - 1-2 sentence description of what learners will build/understand (used in book.json)
- `difficulty` - "Beginner", "Intermediate", or "Advanced" (used in book.json)
- `estimatedTime` - Estimated completion time (e.g., "3.5 hours") (used in book.json)
- `tags` - Array of relevant technology/concept tags
- `prerequisites` - Array of prerequisite knowledge/tools
- `author` - Optional author name (defaults to "Generated by Claude Code")

**Approach**: Create tutorial metadata JSON with all required fields based on the analyzed codebase.

**Display**: Show generated metadata to user for confirmation.

#### Stage 6: Write Tutorial Content

**Goal**: Generate introduction, setup guide, and individual chapters as Markdown files.

**6a. Generate Introduction**: Create `index.md` using the template at `~/.claude/skills/tutorial/templates/honkit/index.md`:

**Template placeholders to replace**:
- `{{TUTORIAL_TITLE}}` - Tutorial title from metadata
- `{{WELCOME_MESSAGE}}` - 2-3 sentence warm welcome explaining what this tutorial covers
- `{{INTRO_ILLUSTRATION}}` - Optional relevant illustration (xkcd comic or other image) that sets the tone. See illustrations-guide.md for options. Format: Image + attribution
- `{{LEARNING_OBJECTIVES}}` - Bulleted list of specific skills/concepts learners will master
- `{{PROJECT_OVERVIEW}}` - 1-2 paragraphs describing the project's purpose and main functionality
- `{{ARCHITECTURE_DIAGRAM}}` - Mermaid diagram from Stage 3 (architecture relationships)
- `{{TECHNICAL_STACK}}` - Bulleted list of technologies, frameworks, and tools used (detected from Stage 1)
- `{{TUTORIAL_STRUCTURE}}` - Numbered list of chapter titles with brief descriptions
- `{{PREREQUISITES}}` - Bulleted list from metadata (programming knowledge, tools, concepts)
- `{{TARGET_AUDIENCE}}` - 1-2 sentences describing intended audience based on difficulty level
- `{{NEXT_CHAPTER_LINK}}` - Navigation link to first chapter (01-getting-started.md)

**Navigation format**: `👉 **[Next: Chapter 1 - Getting Started](01-getting-started.md)**`

Generate content that is beginner-friendly, encouraging, and sets clear expectations for what learners will accomplish.

**6b. Generate Getting Started Chapter**: Create `01-getting-started.md` by analyzing build and configuration files discovered in Stage 1:

**Build System Analysis**:
- Identify build tool (Maven, Gradle, npm, pip, cargo, etc.) from discovered files
- Determine build/run commands:
  - Maven: `mvn clean install`, `mvn spring-boot:run`
  - Gradle: `./gradlew build`, `./gradlew bootRun`
  - npm/yarn: `npm install`, `npm start` or `npm run dev`
  - Python: `pip install -r requirements.txt`, `python app.py`
  - Go: `go mod download`, `go run main.go`
  - Rust: `cargo build`, `cargo run`
  - .NET: `dotnet restore`, `dotnet run`
- Extract version requirements from build files (Java version, Node version, Python version, etc.)

**Configuration Analysis**:
- Check `.env.example`, `.env.sample`, or similar for required environment variables
- Parse `application.properties`, `application.yml`, `config/*` for configuration patterns
- Identify required API keys, database URLs, or external service credentials
- Note any default values or placeholder patterns
- List which variables are required vs optional

**Infrastructure Setup**:
- Check for `docker-compose.yml` - if present, explain how to run (`docker-compose up`)
- Identify shell scripts in `scripts/` or project root (setup scripts, database migrations)
- Look for `Makefile` with useful targets
- Check for database initialization scripts (`.sql`, `.sh`, migrations)

**Template Usage**:
- A template is available at `~/.claude/skills/tutorial/templates/honkit/getting-started.md`
- The template has placeholders like `{{PROJECT_NAME}}`, `{{BUILD_COMMANDS}}`, etc.
- Use this template as a structural guide, but generate content based on actual analysis of build and configuration files

**Chapter Structure for Getting Started**:
1. **Prerequisites** - Required tools and versions (JDK, Node, Python, Docker, etc.)
2. **Clone and Setup** - How to clone/download and initial setup steps
3. **Build System** - Explanation of build tool and how to build the project
4. **Configuration** - Environment variables to set, config files to create
5. **Infrastructure** - Docker compose or other services to start
6. **Running Locally** - Step-by-step commands to run the application
7. **Verification** - How to verify it's working (URLs to visit, expected output)
8. **Troubleshooting** - Common issues and solutions
9. **Practice Exercise** - Hands-on verification exercise (3-4 tasks)

**Practice Exercise for Getting Started**:
- `{{SETUP_PRACTICE_EXERCISE}}` - Numbered list of verification tasks (e.g., change a log message, modify a config value, restart and verify)
- `{{SETUP_EXPECTED_OUTCOME}}` - What should happen after completing the exercise
- `{{SETUP_HINTS}}` - Helpful hints for finding files or running commands

**Example tasks**:
1. Locate the main application file and change a log message
2. Rebuild/restart the application
3. Verify the change appears in the logs/output
4. Bonus: Change a configuration value and observe the effect

**Navigation placeholders**:
- `{{PREV_CHAPTER_LINK}}` - Link back to introduction: `👈 **[Previous: Introduction](index.md)**`
- `{{NEXT_CHAPTER_LINK}}` - Link to first code chapter: `👉 **[Next: Chapter 2 - ComponentName](02-component-name.md)**`

Use code blocks with proper syntax highlighting for all commands and configuration examples.

**6c. Generate Code Chapters**: For each abstraction in order, create a chapter file (`{N:02d}-{chapter-name}.md`) using the template at `~/.claude/skills/tutorial/templates/honkit/chapter-template.md`:

**Template placeholders to replace**:
- `{{CHAPTER_TITLE}}` - Descriptive chapter title (e.g., "User Service: The Heart of Authentication")
- `{{CHAPTER_INTRO_WITH_ANALOGY}}` - 2-3 sentences introducing the component with a relatable analogy
- `{{COMPONENT_NAME}}` - Name of the abstraction/component
- `{{COMPONENT_EXPLANATION}}` - Clear explanation of what this component is and its purpose
- `{{HOW_IT_WORKS_EXPLANATION}}` - Description of the component's operational flow
- `{{KEY_RESPONSIBILITIES}}` - Bulleted list of main responsibilities
- `{{FLOW_DESCRIPTION}}` - 2-3 sentences describing how data flows through this component
- `{{FLOW_DIAGRAM}}` - Mermaid flowchart showing data flow and transformations (see flow-diagram-examples.md)
- `{{CODE_SECTION_N_TITLE}}` - Titles for different code sections (methods, classes, etc.)
- `{{CODE_SECTION_N_EXPLANATION}}` - Explanation before each code snippet
- `{{LANGUAGE}}` - Programming language for syntax highlighting
- `{{CODE_SNIPPET_N}}` - Actual code excerpts from the codebase
- `{{CODE_SNIPPET_N_BREAKDOWN}}` - Line-by-line or concept explanation after each snippet
- `{{ADDITIONAL_CODE_SECTIONS}}` - More code sections as needed (repeat the pattern)
- `{{RELATIONSHIP_DESCRIPTION}}` - How this component relates to others
- `{{RELATIONSHIP_DIAGRAM}}` - Optional Mermaid diagram showing relationships
- `{{DETAILED_RELATIONSHIP_EXPLANATIONS}}` - Detailed explanation of each relationship
- `{{KEY_POINTS}}` - Bulleted list of main takeaways
- `{{PRACTICE_EXERCISE}}` - Numbered list of hands-on tasks (3-5 tasks with progressive difficulty)
- `{{EXPECTED_OUTCOME}}` - What learners should achieve after completing the exercise
- `{{HINTS}}` - Bulleted list of helpful hints (2-3 hints)
- `{{SOLUTION_LINK_OR_EXPLANATION}}` - Brief explanation or approach to solving the exercise
- `{{PREV_CHAPTER_LINK}}` - Navigation link to previous chapter
- `{{NEXT_CHAPTER_LINK}}` - Navigation link to next chapter

**Navigation format**:
- Previous: `👈 **[Previous: Chapter N - ComponentName](0N-component-name.md)**`
- Next: `👉 **[Next: Chapter N - ComponentName](0N-component-name.md)**`
- For last code chapter before conclusion: `👉 **[Next: Conclusion](conclusion.md)**`
- If no conclusion, omit next link on last chapter

**Chapter requirements**:
- Use beginner-friendly language with analogies
- Include 2-4 code snippets with detailed explanations
- Reference related components from earlier chapters
- Keep consistent structure across all chapters

**Flow Diagram requirements**:
- Use Mermaid `graph TD` (top-down) or `graph LR` (left-right) syntax
- Show how data enters the component, transforms, and exits
- Use `[brackets]` for intermediate data/results (e.g., `[text chunks]`, `[vector embeddings]`)
- Use `[Component Name]` for processes/services
- Use `[(Database)]` for storage/persistence
- Use `{Decision?}` for conditional branching
- Include data transformation labels between nodes
- Reference `templates/honkit/flow-diagram-examples.md` for patterns and examples
- Keep diagrams focused on this component's primary data flow (3-8 nodes typically)

**Flow Diagram examples**:
```mermaid
graph TD
    A[Input Data] --> B[This Component]
    B --> C[processed data]
    C --> D[Next Component]
    D --> E[(Storage)]
```

**Practice Exercise guidelines**:
- Create 3-5 numbered tasks with progressive difficulty
- Start with a simple modification to existing code
- Include a moderate task that extends functionality
- Add a "Bonus" task for extra practice (optional)
- Include a "Challenge" task for advanced learners (optional)
- Tasks should be concrete and actionable (e.g., "Add a method called X that does Y")
- Relate exercises to real-world use cases when possible
- Provide 2-3 hints without giving away the complete solution
- Expected outcome should describe what the code should do when working correctly
- Solution should guide the approach without providing complete code (encourage learning)

Generate sequentially to allow cross-referencing. Show progress for each chapter.

**6d. Generate Conclusion Chapter** (Optional): Create a final chapter using `~/.claude/skills/tutorial/templates/honkit/conclusion.md` following effective conclusion principles:

**Template placeholders** (based on Harvard Writing Center guidance):

**Opening & Synthesis**:
- `{{SYNTHESIS_OPENING}}` - 2-3 sentences that synthesize (not summarize) the tutorial's journey. Answer "So what?" - why this learning matters. Avoid generic congratulations; instead, reflect on what learners can now do that they couldn't before.
- `{{WHY_IT_MATTERS}}` - 1-2 paragraphs on broader significance: How does this knowledge apply beyond this specific project? What problems can learners now solve? Connect to real-world applications and industry relevance.
- `{{JOURNEY_REFLECTION}}` - Circle back to the introduction's promise. If intro said "you'll master X", reflect on how that was accomplished. Show transformation from beginning to end.

**Knowledge Synthesis**:
- `{{KEY_CONCEPTS_SYNTHESIS}}` - Bulleted list of major concepts, but with synthesis: group related concepts, show how they interconnect, highlight patterns that emerged across chapters
- `{{TRANSFERABLE_SKILLS}}` - Name specific transferable skills gained (e.g., "architectural thinking", "debugging distributed systems", "API design principles") that apply beyond this tutorial
- `{{DOMAIN}}` - The broader domain (e.g., "web development", "machine learning", "data engineering")

**Action-Oriented Next Steps**:
- `{{BUILD_PROJECT_CHALLENGE}}` - Specific, achievable project idea that combines multiple concepts from the tutorial. Include scope/complexity guidance.
- `{{CONTRIBUTION_PATH}}` - Concrete ways to contribute (fix bugs, improve docs, add features) with guidance on where to start
- `{{CONTRIBUTION_VALUE}}` - Why contributing matters (builds portfolio, deepens understanding, helps community)
- `{{ADVANCED_TOPICS}}` - 3-5 advanced topics to explore next, each with 1-sentence description of what it adds

**Resources & Support**:
- `{{CURATED_RESOURCES}}` - Short, curated list (3-5 items) of high-quality resources. Explain why each is valuable, not just links.
- `{{SUPPORT_CHANNELS}}` - Specific channels for help (Discord, forum, GitHub issues) with what type of questions to ask where

**Closing**:
- `{{CONCLUSION_ILLUSTRATION}}` - Optional relevant illustration (xkcd comic or other image) that celebrates achievement or validates the learning journey. See illustrations-guide.md for options. Format: Image + attribution
- `{{CLOSING_REFLECTION}}` - 2-3 sentences that elevate beyond the tutorial: the mindset/approach that matters most, or the larger lesson
- `{{CIRCLE_BACK_TO_INTRO}}` - Reference a specific concept, question, or goal from the introduction to create closure
- `{{EMPOWERING_SENDOFF}}` - Final sentence that's empowering and forward-looking. Avoid clichés; be specific about what learners can now accomplish.

**Conclusion Writing Principles**:
- **Synthesize, don't summarize**: Show how concepts connect, don't just list what was covered
- **Answer "So what?"**: Explain why this knowledge matters in the real world
- **Provide closure**: Circle back to the introduction's promise
- **Look forward**: Point to next steps without introducing entirely new topics
- **End with impact**: Final words should be memorable and empowering

**Illustration Selection** (for both intro and conclusion):
- Consult `templates/honkit/illustrations-guide.md` for curated xkcd comics and alternative sources
- **For Introduction**: Choose images about learning, complexity, or starting journeys (e.g., xkcd #1053 "Ten Thousand")
- **For Conclusion**: Choose images about mastery, achievement, or validation (e.g., xkcd #208 "Regular Expressions", #1319 "Automation")
- Match illustration theme to tutorial topic (APIs → xkcd #1481, Security → xkcd #327, Git → xkcd #1172)
- **Always include proper attribution**: `*[xkcd #NUMBER](https://xkcd.com/NUMBER/): "Title" by Randall Munroe (CC BY-NC 2.5)*`
- Alternative sources: unDraw (no attribution), Unsplash (credit photographer), see guide for details
- If no good match found, illustrations are optional—omit rather than force a poor fit

**Navigation placeholder**:
- `{{PREV_CHAPTER_LINK}}` - Link back to last code chapter: `👈 **[Previous: Chapter N - ComponentName](0N-component-name.md)**`

#### Final Step: Create HonKit Navigation Files

After generating chapters, prepare for HonKit using the provided templates:

**1. Create README.md** from template:
   - Read template from: `~/.claude/skills/tutorial/templates/honkit/README.md`
   - Replace placeholders:
     - `{{TUTORIAL_TITLE}}` - Tutorial title from metadata
     - `{{TUTORIAL_DESCRIPTION}}` - Tutorial description from metadata
     - `{{LEARNING_OBJECTIVES}}` - Bullet list of what learners will achieve
     - `{{PREREQUISITES}}` - Bullet list from metadata
     - `{{DIFFICULTY}}` - From metadata
     - `{{ESTIMATED_TIME}}` - From metadata

**2. Create SUMMARY.md** from template:
   - Read template from: `~/.claude/skills/tutorial/templates/honkit/SUMMARY.md`
   - Replace `{{CHAPTER_LINKS}}` with links to all chapter files:
     - First link should always be Getting Started: `* [Getting Started](01-getting-started.md)`
     - Followed by code chapters: `* [Chapter Title](02-chapter-name.md)`, etc.
     - Optional conclusion chapter: `* [Conclusion](XX-conclusion.md)`
     - Format: `* [Chapter Title](NN-chapter-name.md)`
     - One link per generated chapter in order

**3. Create book.json** from template:
   - Read template from: `~/.claude/skills/tutorial/templates/honkit/book.json`
   - Replace placeholders:
     - `{{TUTORIAL_TITLE}}` - Tutorial title from metadata
     - `{{TUTORIAL_DESCRIPTION}}` - Tutorial description from metadata
     - `{{AUTHOR}}` - From metadata or default to "Generated by Claude Code"
     - `{{MODULE}}` - Default to "Module 01"
     - `{{DIFFICULTY}}` - From metadata
     - `{{ESTIMATED_TIME}}` - From metadata

**4. Copy styles** from template:
   - Copy `~/.claude/skills/tutorial/templates/honkit/styles/website.css` to output directory's `styles/` folder
   - Creates `{output_dir}/styles/website.css` for custom HonKit styling

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

**Templates**:
All tutorial templates are organized by output format at `~/.claude/skills/tutorial/templates/`:

**HonKit Templates** (`templates/honkit/`):
- `book.json` - HonKit configuration with metadata placeholders (always use)
- `README.md` - Tutorial landing page template (always use)
- `SUMMARY.md` - Table of contents template (always use)
- `index.md` - Introduction chapter template with structure and placeholders (always use)
- `getting-started.md` - Getting Started chapter template with practice exercise (use as structural guide)
- `chapter-template.md` - Code chapter template for abstraction chapters with practice exercises and flow diagrams (always use)
- `conclusion.md` - Conclusion chapter template with synthesis and forward-looking structure (use if generating conclusion)
- `practice-exercise-examples.md` - Reference examples showing good practice exercise structure (read for inspiration)
- `flow-diagram-examples.md` - Reference examples of Mermaid flow diagrams showing data flow patterns (read for inspiration)
- `navigation-examples.md` - Reference examples showing proper navigation link formatting (read for guidance)
- `conclusion-examples.md` - Reference examples of effective conclusions based on Harvard Writing Center principles (read for guidance)
- `illustrations-guide.md` - Curated xkcd comics and alternative illustration sources with attribution guidelines (read for selecting relevant images)
- `styles/website.css` - Custom CSS for HonKit rendering (always copy to output)

These templates use `{{PLACEHOLDER}}` syntax for dynamic values.

**Usage pattern**:
- **book.json, README.md, SUMMARY.md, index.md, chapter-template.md**: Always read the template, replace all placeholders with actual values from analysis/metadata, and write to output directory
- **getting-started.md, conclusion.md**: Use as structural references, generate content based on actual analysis following the template structure
- **practice-exercise-examples.md, flow-diagram-examples.md, navigation-examples.md, conclusion-examples.md, illustrations-guide.md**: Reference documents for inspiration - read to understand patterns and best practices
- **styles/website.css**: Copy to `{output_dir}/styles/` without modification

**Future template engines**: The templates directory is organized to support additional formats (e.g., `templates/mdbook/`, `templates/docusaurus/`) in future versions.

**Error Handling**:
- No files found: Verify path and suggest alternatives
- Too many files: Recommend focusing on subdirectory
- JSON parse error: Show raw output and retry
- Missing relationships: Some components can be standalone
- User cancels: Respect cancellation at any stage
- Template not found: Template files should exist at `~/.claude/skills/tutorial/templates/honkit/` after skill installation

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
✓ Found 18 Java files (3,245 lines), plus 5 configuration files
✓ Detected Maven build system (pom.xml)
✓ Found docker-compose.yml and application.properties

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
✓ Created index.md (Introduction)
✓ Created 01-getting-started.md (Setup guide with build, config, and Docker instructions)
✓ Created 02-user-service.md
✓ Created 03-data-repository.md
...

✅ Complete! Tutorial saved to ./tutorials

Files created:
- README.md, SUMMARY.md, book.json (HonKit configuration)
- styles/website.css (Custom styling)
- index.md (Introduction with architecture diagram)
- 01-getting-started.md (Local setup guide with practice exercise)
- 02-09 chapters covering core abstractions (each with practice exercises)

Next steps:
- Review the generated content
- Try the practice exercises in each chapter
- Preview with: /tutorial preview ./tutorials
```
