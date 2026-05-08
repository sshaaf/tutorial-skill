# Navigation Examples

This file contains examples of how navigation links should be formatted in tutorial chapters.

## Navigation Format

All navigation links should use the following format with emoji arrows:

- **Previous**: `👈 **[Previous: Chapter Title](file-name.md)**`
- **Next**: `👉 **[Next: Chapter Title](file-name.md)**`

## Examples by Chapter Type

### Introduction (README.md)
Only has next link (no previous):

```markdown
## Navigation

👉 **[Next: Chapter 1 - Getting Started](01-getting-started.md)**
```

---

### Getting Started (01-getting-started.md)
Has both previous and next:

```markdown
## Navigation

👈 **[Previous: Introduction](README.md)**

👉 **[Next: Chapter 2 - User Service](02-user-service.md)**
```

---

### Middle Code Chapters (02-XX.md through 0N-XX.md)
Has both previous and next:

```markdown
## Navigation

👈 **[Previous: Chapter 2 - User Service](02-user-service.md)**

👉 **[Next: Chapter 4 - Database Repository](04-database-repository.md)**
```

---

### Last Code Chapter (before conclusion)
Links to conclusion if it exists:

```markdown
## Navigation

👈 **[Previous: Chapter 7 - Response Handler](07-response-handler.md)**

👉 **[Next: Conclusion](conclusion.md)**
```

Or if no conclusion (last chapter overall):

```markdown
## Navigation

👈 **[Previous: Chapter 7 - Response Handler](07-response-handler.md)**
```

---

### Conclusion (conclusion.md)
Only has previous link (no next):

```markdown
## Navigation

👈 **[Previous: Chapter 8 - Caching Strategy](08-caching-strategy.md)**
```

---

## Best Practices

### Do:
- ✅ Use emoji arrows (👈 👉) for visual clarity
- ✅ Use consistent formatting: `👉 **[Next: Title](file.md)**`
- ✅ Include chapter number and descriptive title
- ✅ Use exact chapter titles from SUMMARY.md
- ✅ Separate previous and next links with a blank line

### Don't:
- ❌ Mix navigation styles (be consistent)
- ❌ Use different emoji or symbols
- ❌ Omit the chapter number in link text
- ❌ Use generic text like "Next Chapter" without specifics
- ❌ Break navigation links across multiple lines

## Rendering Example

When rendered in HonKit, navigation should look like this:

---

**Navigation**

👈 **Previous: Chapter 2 - EmbeddingService**

👉 **Next: Chapter 4 - VectorStoreService**

---

This provides clear, clickable navigation that helps readers move through the tutorial sequentially.
