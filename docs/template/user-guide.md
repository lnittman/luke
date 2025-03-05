# Agentic LLM Development Workflow

This README explains how to effectively use the generated project documentation with agentic LLM tools like Cursor to accelerate your development process.

## Directory Structure

The documentation is organized into a structured system designed to support agentic development:

```
docs/
│
├── index.md              # Project overview
├── tech.md               # Technology glossary
├── design.md             # Architecture and design decisions
├── code.md               # Implementation guide
├── init.md               # System/utility prompt for LLMs
├── instructions.md       # Project-specific workflow instructions
│
├── memory/
│   ├── index.md          # Template for memory bank files
│   └── bank_<n>.md       # Memory bank files (created as needed)
│
├── architecture/
│   └── [task-specific].md # Task-specific architectural documents
│
└── prompts/
    ├── architect.md      # Architecture-focused role
    ├── developer.md      # Development-focused role
    ├── designer.md       # Design-focused role
    └── enterprise.md     # Business/growth/marketing-focused role
```

## Getting Started with Agentic Development

### Initial Setup

1. After generating your project, download the documentation files
2. Drag the entire `docs/` directory into your project in Cursor
3. Navigate to your project in the Cursor editor

### Basic LLM Workflow

To initiate the agentic LLM development workflow, type:

```
@init.md follow @instructions.md
```

This command does two key things:
1. Loads the base system prompt (`init.md`) to establish the LLM's general behavior
2. Follows the project-specific instructions (`instructions.md`) to begin implementing the project

### Working with Memory Banks

Memory banks store context, decisions, and progress throughout the development process:

- The system will automatically create new memory banks as needed
- Memory banks follow the naming convention `bank_<number>.md`
- Each memory bank contains timestamped entries with context and decisions
- Reference memory banks with: `@memory/bank_1.md recall [topic]`

### Using Role-Specific Prompts

For specialized development tasks, invoke a specific role:

- **Architect role**: `@prompts/architect.md design [component/system]`
- **Developer role**: `@prompts/developer.md implement [feature]`
- **Designer role**: `@prompts/designer.md create [UI element]`
- **Enterprise role**: `@prompts/enterprise.md plan [growth strategy]`

The LLM will adapt its tone, approach, and focus based on the selected role.

## Advanced Usage

### Context-Aware Repository Navigation

The agentic system understands the project structure and can efficiently navigate it:

- To search for relevant file context: `explore [query or concept]`
- To get a file overview: `examine [file path]`
- To understand a specific codebase area: `map [directory or component]`

### Task Management

Break down complex implementation tasks:

```
@prompts/developer.md implement [feature] with:
- step-by-step plan
- reference architectures
- unit tests
```

### Architecture Deep Dives

For comprehensive architecture planning:

```
@prompts/architect.md create architecture for [subsystem] in architecture/[name].md
```

This will generate a detailed architecture document in the `architecture/` directory.

## Best Practices

1. **Start with a clear objective**: The more specific your request, the better
2. **Reference existing files**: Help the LLM find relevant context
3. **Balance specificity and flexibility**: Give clear goals but allow the LLM to suggest approaches
4. **Update memory regularly**: After significant progress, ask to update the memory bank
5. **Switch roles when appropriate**: Use the specialized prompts for their intended purposes

## Example Workflows

### Starting a New Feature

```
@init.md follow @instructions.md
@prompts/architect.md design user authentication system
@prompts/developer.md implement user authentication based on architecture/auth.md
```

### Improving Existing Code

```
@init.md follow @instructions.md
examine src/components/UserProfile.tsx
@prompts/developer.md optimize this component for performance
```

### Planning Growth Strategy

```
@init.md follow @instructions.md
@prompts/enterprise.md create marketing strategy for user acquisition
```

## Troubleshooting

- **LLM seems to lack context**: Use `explore [context]` to help it find relevant information
- **Instructions not being followed**: Ensure you've initiated with `@init.md follow @instructions.md`
- **Inconsistent responses**: Try updating memory with `update memory with recent progress`

---

By following these guidelines, you'll be able to leverage the full potential of the agentic LLM development system, enabling faster and more effective implementation of your project. 