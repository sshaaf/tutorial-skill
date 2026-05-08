# Antora Templates

These templates generate Antora-compatible AsciiDoc documentation.

## Antora Output Structure

```
docs/
├── antora.yml                    # Component descriptor
└── modules/
    └── ROOT/
        ├── nav.adoc              # Navigation
        ├── pages/
        │   ├── index.adoc        # Landing page
        │   ├── chapter-01.adoc   # Chapter files
        │   ├── chapter-02.adoc
        │   └── conclusion.adoc
        ├── images/               # Diagrams and images
        └── examples/             # Code examples
```

## Preview with Antora

```bash
# Install Antora
npm install -g @antora/cli @antora/site-generator-default

# Create playbook with Mermaid support
cat > antora-playbook.yml << EOF
site:
  title: {{TUTORIAL_TITLE}}
  start_page: {{MODULE_NAME}}:ROOT:index.adoc
content:
  sources:
  - url: /path/to/git/repo
    start_path: path/to/tutorial
    branches: HEAD
    worktrees: true
ui:
  bundle:
    url: https://gitlab.com/antora/antora-ui-default/-/jobs/artifacts/HEAD/raw/build/ui-bundle.zip?job=bundle-stable
    snapshot: true
  supplemental_files: ./docs/supplemental-ui
EOF

# Generate site
antora antora-playbook.yml

# Serve locally
npx http-server build/site -p 8080
```

**Important playbook configuration**:
- `start_page`: Use format `{MODULE_NAME}:ROOT:index.adoc` (includes `:ROOT:`)
- `url`: Point to git repository root (absolute path or `.` if at repo root)
- `start_path`: Relative path from repo root to tutorial directory
- `worktrees: true`: Include uncommitted files (essential for local preview)
- `supplemental_files`: Path to supplemental-ui directory (for Mermaid rendering)

## Mermaid Diagrams

The tutorials include Mermaid diagrams using the `[mermaid]` directive:

```asciidoc
[mermaid]
....
graph TD
    A[Start] --> B[Process]
    B --> C[End]
....
```

Mermaid diagrams are rendered **client-side** using Mermaid.js loaded from CDN via the supplemental-ui files:
- `supplemental-ui/partials/footer-scripts.hbs` loads Mermaid.js and auto-converts literal blocks
- Diagrams render in the browser when viewing the generated site
- No server-side build dependencies required

## Template Variables

All templates use `{{VARIABLE_NAME}}` placeholders that are replaced during generation.
