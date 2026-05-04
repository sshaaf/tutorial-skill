# Tutorial Skill

A unified skill for AI-powered codebase analysis and tutorial generation.

## Commands

### `/tutorial:analyze`
Fast codebase analysis with architecture diagrams
- **Time**: 2-5 minutes
- **Output**: Interactive summary + Mermaid diagram
- **Use for**: Understanding codebases, onboarding, planning refactors

### `/tutorial:build`
Complete tutorial generation with chapters
- **Time**: 10-30 minutes
- **Output**: Multiple Markdown files (index + chapters)
- **Use for**: Creating learning materials, documentation, training resources

## Quick Start

### Installation

```bash
# Install via NPM (recommended)
npx @sshaaf/tutorial-skill install
```

**Alternative methods:**
```bash
# Manual install from source
cp -r tutorial ~/.claude/skills/tutorial

# Or extract from package
tar -xzf tutorial.skill -C ~/.claude/skills/
```

### Usage

```bash
# Quick analysis
/tutorial:analyze

# With path
/tutorial:analyze ./src/main/java

# Full tutorial
/tutorial:build

# With output directory
/tutorial:build --output ./docs/tutorial
```

## Examples

### Analyze a codebase
```
User: /tutorial:analyze ./backend

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
User: /tutorial:build

Claude: I'll generate a tutorial. What directory should I analyze?

User: ./src

Claude:
[Runs 6-stage pipeline]
...
✅ Tutorial complete!
📁 Output: ./tutorials/
📄 Files: index.md + 7 chapters
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
- **Installation**: See parent directory QUICK-START.md
- **Comparison**: See parent directory SKILLS-README.md

## Based On

Extracted from [Waver LLM](https://github.com/sshaaf/waver-llm) by Shaaf Syed.

## License

MIT License (same as Waver LLM)
