# Title Capitalization Guide

All chapter titles in SUMMARY.md and throughout the tutorial should follow **Chicago Manual of Style** (title case) capitalization rules.

## Chicago Style Rules

### Always Capitalize:
1. ✅ **First word** of the title
2. ✅ **Last word** of the title
3. ✅ **Major words**: Nouns, pronouns, verbs, adjectives, adverbs
4. ✅ **First word after a colon or dash**

### Always Lowercase:
1. ❌ **Articles**: a, an, the
2. ❌ **Coordinating conjunctions**: and, but, or, for, nor, so, yet
3. ❌ **Prepositions** (regardless of length): in, on, at, to, from, by, with, of, for, about, through, etc.
4. ❌ **"to" in infinitives**: to Run, to Build, to Create

### Special Cases:
- **After hyphens**: Capitalize if it's a major word: "Self-Service API", "Real-Time Processing"
- **Prepositions as part of phrasal verbs**: Capitalize when part of the verb: "Setting Up the Project" (not "Setting up the Project")
- **Short words that are verbs**: Always capitalize: "How It Works", "What Is Next"

---

## Examples

### ✅ Correct (Chicago Style):

- Introduction
- Getting Started
- User Service: The Heart of Authentication
- Understanding the Repository Pattern
- How the Service Layer Works
- Building Your First API Endpoint
- Connecting to the Database
- Working with Environment Variables
- What's Next for Your Journey
- Testing and Debugging
- Deploying to Production
- Error Handling and Validation
- Real-Time Data Processing
- Setting Up Your Development Environment

### ❌ Incorrect:

- ~~getting started~~ (first word not capitalized)
- ~~User Service: The Heart Of Authentication~~ ("Of" should be lowercase)
- ~~Understanding The Repository Pattern~~ ("The" should be lowercase)
- ~~How The Service Layer Works~~ ("The" should be lowercase)
- ~~Building Your First Api Endpoint~~ ("Api" should be "API")
- ~~Connecting To The Database~~ ("To" and "The" should be lowercase)
- ~~Working With Environment Variables~~ ("With" should be lowercase)
- ~~What's Next For Your Journey~~ ("For" should be lowercase)
- ~~Error handling and validation~~ (first word not capitalized)
- ~~Real-time Data Processing~~ (word after hyphen should be capitalized: "Real-Time")
- ~~Setting up Your Development Environment~~ ("Up" is part of phrasal verb, should be capitalized)

---

## Quick Reference: Common Words

### Lowercase in Titles:

**Articles**:
- a, an, the

**Coordinating Conjunctions**:
- and, but, or, for, nor, so, yet

**Common Prepositions**:
- about, above, across, after, against, along, among, around, at, before, behind, below, beneath, beside, between, beyond, by, down, during, except, for, from, in, inside, into, like, near, of, off, on, onto, out, outside, over, past, since, through, throughout, till, to, toward, under, underneath, until, up, upon, with, within, without

**To in Infinitives**:
- to be, to run, to build, to create, etc.

### Always Capitalize:

**Verbs** (including short ones):
- Is, Are, Was, Were, Be, Been, Being, Have, Has, Had, Do, Does, Did, Will, Would, Could, Should, May, Might, Must, Can

**Short but Important Words**:
- It, Its, As, If

**Acronyms**:
- API, REST, HTTP, SQL, JSON, XML (always all caps)

---

## Chapter Title Patterns

### Component Chapters:
Format: `ComponentName: Descriptive Subtitle`

Examples:
- User Service: The Heart of Authentication
- Database Repository: Managing Data Access
- API Gateway: Routing Requests Efficiently
- Cache Layer: Improving Performance at Scale

### Concept Chapters:
Format: `Action/Concept + Details`

Examples:
- Understanding Dependency Injection
- Implementing Error Handling
- Building RESTful APIs
- Testing Your Application
- Deploying to Production

### How-To Chapters:
Format: `Verb + Object + Optional Context`

Examples:
- Setting Up Your Environment
- Connecting to the Database
- Creating Your First Endpoint
- Working with Configuration Files

### Numbered Chapters in SUMMARY.md:
Format: `Chapter N - Title in Chicago Style`

Examples:
- Chapter 1 - Getting Started
- Chapter 2 - User Service: The Heart of Authentication
- Chapter 3 - Understanding the Repository Pattern
- Chapter 4 - Building Your First API

---

## Implementation Checklist

When generating chapter titles:

1. ✅ Write the title naturally
2. ✅ Capitalize first word
3. ✅ Capitalize last word
4. ✅ Capitalize all major words (nouns, verbs, adjectives, adverbs)
5. ✅ Lowercase articles (a, an, the)
6. ✅ Lowercase conjunctions (and, but, or, etc.)
7. ✅ Lowercase prepositions (in, on, at, to, from, etc.)
8. ✅ Check for phrasal verbs (keep "up" in "Setting Up")
9. ✅ Check acronyms (API, not Api)
10. ✅ Check words after colons (always capitalize)

---

## Special Considerations

### Technical Terms:
- Keep technical terms in their conventional case: "RESTful API", "OAuth2", "PostgreSQL"
- Acronyms stay all-caps: "API", "HTTP", "JSON"

### Subtitles After Colons:
- Always capitalize the first word after a colon
- "User Service: The Heart of Authentication" ✅
- "User Service: the Heart of Authentication" ❌

### Phrasal Verbs:
Phrasal verbs are verb + preposition combinations where the meaning is different from the individual words. The preposition should be capitalized.

Examples:
- "Setting Up" (phrasal verb) ✅
- "Setting up" ❌
- "Looking Into" (phrasal verb) ✅
- "Looking At" (phrasal verb) ✅

But: "Looking at the Code" - here "at" is just a preposition, not part of phrasal verb, so lowercase ❌
Should be: "Looking at the Code" only if "looking at" is used as phrasal verb, otherwise it depends on context.

To be safe: When in doubt, check if the word can stand alone as a preposition. If removing it changes the verb's meaning significantly, capitalize it.

---

## Tools for Verification

You can verify capitalization with these mental checks:

1. **Is it the first or last word?** → Capitalize
2. **Is it a verb, noun, adjective, or adverb?** → Capitalize
3. **Is it an article, conjunction, or preposition?** → Lowercase (unless first/last word)
4. **Is it after a colon or hyphen?** → Capitalize
5. **Is it an acronym?** → All caps

---

## Example SUMMARY.md

```markdown
# Summary

* [Introduction](README.md)
* [Chapter 1 - Getting Started](01-getting-started.md)
* [Chapter 2 - User Service: The Heart of Authentication](02-user-service.md)
* [Chapter 3 - Understanding the Repository Pattern](03-repository-pattern.md)
* [Chapter 4 - Database Connection: Setting Up and Managing](04-database.md)
* [Chapter 5 - Building Your First API Endpoint](05-first-endpoint.md)
* [Chapter 6 - Working with Environment Variables](06-environment.md)
* [Chapter 7 - Error Handling and Validation](07-error-handling.md)
* [Chapter 8 - Testing Your Application](08-testing.md)
* [Conclusion](conclusion.md)
```

Note: Every chapter title follows Chicago style capitalization consistently.
