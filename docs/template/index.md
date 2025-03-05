# [PROJECT_NAME] Documentation Index

> This document provides a comprehensive overview of all documentation folders and files for [PROJECT_NAME].

## Documentation Structure

The project documentation is organized into the following directory structure:

```
project-docs/
│
├── README.md                      # Human-readable GitHub README
├── index.md                       # This file - summary of all folders and files
│
├── docs/                          # Core documentation
│   ├── overview.md                # Project overview (former index.md)
│   ├── design.md                  # Architecture and design decisions
│   ├── code.md                    # Implementation guide
│   ├── deployment.md              # Deployment guide
│   ├── api.md                     # API documentation (if applicable)
│   └── README.md                  # Summary of core documentation
│
├── tech/                          # Technology documentation
│   ├── index.md                   # Tech stack overview
│   ├── [technology1].md           # Detailed docs for each technology
│   ├── [technology2].md           # (Generated for each tech in stack)
│   └── README.md                  # Guide to tech documentation
│
├── system/                        # LLM system files
│   ├── init.md                    # System prompt for LLM initialization
│   ├── instructions.md            # Project-specific workflow instructions
│   └── README.md                  # Guide to using system files
│
├── memory/                        # Memory system
│   ├── index.md                   # Memory system guide
│   ├── bank_1.md                  # Initial memory bank
│   └── README.md                  # Memory usage instructions
│
├── prompts/                       # Role and workflow prompts
│   ├── roles/                     # Role-specific prompts
│   │   ├── architect.md           # Architecture-focused role
│   │   ├── developer.md           # Development-focused role
│   │   ├── designer.md            # Design-focused role
│   │   └── enterprise.md          # Business/growth-focused role
│   ├── commands/                  # Workflow command prompts
│   │   ├── setup.md               # Project setup commands
│   │   ├── testing.md             # Testing workflow commands
│   │   ├── deployment.md          # Deployment workflow commands
│   │   ├── debugging.md           # Debugging workflow (project-specific)
│   │   ├── optimization.md        # Performance optimization (project-specific)
│   │   └── [custom-workflow].md   # Additional project-specific workflows
│   └── README.md                  # Guide to using prompts
│
└── architecture/                  # Architecture documentation
    ├── sample-feature.md          # Sample architecture document
    ├── components.md              # Component architecture details
    ├── [feature1].md              # Feature-specific architecture docs
    └── README.md                  # Architecture documentation guide
```

## Directory Contents

### docs/ - Core Documentation

The `docs/` directory contains the core project documentation:

- **overview.md**: High-level project overview, goals, and scope
- **design.md**: Architecture and design decisions
- **code.md**: Implementation guide with code patterns and examples
- **deployment.md**: Deployment procedures and environments
- **README.md**: Summary of core documentation

These documents provide the essential information needed to understand and implement the project.

### tech/ - Technology Documentation

The `tech/` directory contains documentation for all technologies used in the project:

- **index.md**: Overview of the complete technology stack
- **[technology1].md**: Detailed documentation for [technology1]
- **[technology2].md**: Detailed documentation for [technology2]
- **README.md**: Guide to using the technology documentation

Each technology file includes setup instructions, best practices, and project-specific usage patterns.

### system/ - LLM System Files

The `system/` directory contains files used to initialize and guide LLM agents:

- **init.md**: System prompt for initializing LLM agents
- **instructions.md**: Project-specific workflow instructions
- **README.md**: Guide to using system files with LLM agents

These files are designed to be used with agentic LLM tools like Cursor to accelerate development.

### memory/ - Memory System

The `memory/` directory contains the memory system for agentic LLMs:

- **index.md**: Guide to using the memory system
- **bank_1.md**: Initial memory bank for storing context
- **README.md**: Memory system usage instructions

The memory system helps maintain context across development sessions and store important decisions.

### prompts/ - Role and Workflow Prompts

The `prompts/` directory contains specialized prompts for different roles and workflows:

- **roles/**: Role-specific prompts
  - **architect.md**: Architecture-focused role
  - **developer.md**: Development-focused role
  - **designer.md**: Design-focused role
  - **enterprise.md**: Business/growth-focused role
- **commands/**: Workflow-specific command prompts
  - **setup.md**: Project setup commands
  - **testing.md**: Testing workflow commands
  - **deployment.md**: Deployment workflow commands
  - **[workflow].md**: Additional workflow-specific commands
- **README.md**: Guide to using prompts and commands

These prompts help guide LLM agents through specific tasks and roles when working with the project.

### architecture/ - Architecture Documentation

The `architecture/` directory contains detailed architecture documentation:

- **sample-feature.md**: Sample architecture document for a specific feature
- **components.md**: Component architecture and interactions
- **README.md**: Architecture documentation guide

These documents provide in-depth technical details about specific aspects of the project architecture.

## Using This Documentation

### For Human Developers

1. Start with `README.md` for a high-level overview
2. Read `docs/overview.md` to understand the project goals
3. Explore `docs/design.md` for architecture decisions
4. Use `docs/code.md` for implementation guidance
5. Reference `tech/index.md` for technology stack details

### For LLM Agents

1. Begin with `system/init.md` to initialize the agent
2. Follow `system/instructions.md` for project-specific workflows
3. Use role prompts in `prompts/roles/` for specialized tasks
4. Reference command prompts in `prompts/commands/` for common workflows
5. Store and retrieve context using the memory system in `memory/`

## Document Relationships

The documentation is designed to be interconnected:

- `docs/overview.md` provides context for `docs/design.md`
- `docs/design.md` informs the implementation in `docs/code.md`
- `tech/index.md` references individual technology files in `tech/`
- `system/instructions.md` references command prompts in `prompts/commands/`
- `prompts/roles/` files reference architecture documents in `architecture/`

## Maintenance and Updates

This documentation should be updated when:

1. New features are added to the project
2. Architecture decisions change
3. Technology stack is modified
4. Workflows are improved or changed

When updating documentation, ensure cross-references remain accurate and the index.md file is updated to reflect any new files or directories. 