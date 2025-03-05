# Memory System Guide

This document explains how the memory system works for maintaining context in agentic LLM workflows. The memory system helps maintain project context, decisions, and progress throughout the development lifecycle.

## Memory Bank Structure

Memory is organized into numbered bank files with a consistent structure:

```
memory/
├── index.md          # This file - explains the memory system
├── bank_1.md         # First memory bank
├── bank_2.md         # Second memory bank (created when bank_1 is full)
└── ...               # Additional banks as needed
```

## Memory Bank Template

Each memory bank follows this structure:

```markdown
# Memory Bank [NUMBER]

## Context Summary

Brief summary of the overall project context and current implementation status.

## Entries

### [TIMESTAMP] - [TOPIC]

[CONTENT]

### [TIMESTAMP] - [TOPIC]

[CONTENT]

...
```

## How to Use the Memory System

### For AI Assistants

1. **Initialization**:
   - At the start of a new project, create `bank_1.md` with initial project context
   - Include key information from project documentation

2. **Adding Entries**:
   - Add new entries with timestamps when significant progress is made
   - Include detailed context that might be useful in future sessions
   - Use clear topic titles for easy reference

3. **Memory Bank Management**:
   - Create a new bank when the current one reaches ~50 entries
   - Include a summary of previous banks in each new bank
   - Cross-reference between banks when relevant

4. **Retrieval and Searching**:
   - When asked to recall information, search relevant memory banks
   - Quote specific entries when referencing past decisions
   - Summarize across multiple entries when providing context

5. **Updating Entries**:
   - When information changes, add a new entry rather than modifying old ones
   - Reference the previous entry being updated
   - Explain what changed and why

### For Developers

1. **Invoking Memory Operations**:
   - Use natural language commands to work with memory
   - Example: "store in memory: decision about authentication approach"
   - Example: "recall from memory: database schema decisions"

2. **Reviewing Memory**:
   - Ask for memory summaries to review progress
   - Request specific memories by topic
   - Use memory to track decisions that might not be documented elsewhere

3. **Maintaining Continuity**:
   - Reference memory at the start of new sessions to maintain context
   - Ask the AI to update memory with recent progress
   - Use memory to track tasks that span multiple sessions

## Entry Categories

Memory entries should be categorized for easier reference:

1. **Decisions**: Architectural, technical, or design decisions
2. **Implementation**: Details about how features were implemented
3. **Context**: Background information about the project
4. **Tasks**: Completed and pending tasks
5. **Issues**: Problems encountered and their solutions
6. **References**: Useful resources, links, or code snippets

## Example Memory Entry

```markdown
### 2025-03-04T14:30:00Z - Decision: Authentication Approach

Decided to use JWT-based authentication with refresh tokens instead of session-based auth for the following reasons:

1. Better scalability with stateless authentication
2. Easier integration with the mobile app planned for phase 2
3. Reduced database load by not requiring session storage

This approach will require:
- Implementing token refresh logic on the frontend
- Setting up secure token storage
- Configuring proper CORS settings

Related code: `src/auth/authService.ts`
```

## When to Create New Memory Banks

Create a new memory bank when:
1. The current bank exceeds 50 entries
2. The project shifts to a new major phase
3. A significant architectural change occurs
4. The current bank becomes difficult to navigate

When creating a new bank, include a summary section that references key entries from previous banks.

---

This memory system ensures that important context is preserved throughout the development process, enabling more effective assistance and maintaining continuity across sessions. 