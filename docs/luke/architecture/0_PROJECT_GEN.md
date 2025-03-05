# Project Generation System Architecture Enhancements

## 1. Current System Architecture

### 1.1 Overview

The current project generation system is a sophisticated pipeline that combines multiple AI models (Claude and Perplexity) to generate comprehensive project documentation based on user prompts. The system takes a project concept, generates relevant technical documentation, and produces a set of markdown files that serve as a foundation for project development.

### 1.2 Current Generation Pipeline

The current workflow consists of two main paths:

1. **Random Idea Generation**:
   - User clicks "Generate Random Idea"
   - System generates search queries using Claude
   - Perplexity (Sonar Reasoning) executes searches
   - Results are compiled into an app idea
   - A tech stack is generated
   - Documents are created sequentially (tech.md from Perplexity, others from Claude)

2. **Project Generation**:
   - User enters a project prompt and selects a tech stack
   - System generates search queries for relevant context
   - Claude processes input and generates project structure
   - Perplexity enhances tech documentation
   - Claude generates remaining documentation (index.md, design.md, code.md, init.md)
   - Documents are enhanced with resource sections

### 1.3 Current Documentation Structure

The system currently generates five key documents:

- **index.md**: Project overview and summary
- **tech.md**: Comprehensive technology glossary
- **design.md**: Architectural and design decisions
- **code.md**: Implementation details and code examples
- **init.md**: Project initialization guide

### 1.4 Current Issues

1. **Project Name Inconsistency**: The user-provided project name ("treats") is not consistently used throughout documentation, with many instances defaulting to "Project" instead.

2. **API Failures**: Some Perplexity searches are failing, affecting the quality of generated documentation.

3. **Documentation Purpose Misalignment**: The current `init.md` is designed as a project initialization guide rather than an LLM system/utility prompt.

4. **Limited Agent Workflow Support**: The documentation structure isn't optimized for agentic LLM workflows, lacking clear instructions for memory management, role-based prompting, and contextual awareness.

## 2. Proposed Enhancements

### 2.1 Enhanced Documentation Structure

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
│   └── bank_1.md         # First memory bank (subsequent banks generated as needed)
│
├── architecture/
│   └── [task-specific].md # Comprehensive architecture for specific tasks
│
└── prompts/
    ├── architect.md      # Architecture-focused role prompt
    ├── developer.md      # Development-focused role prompt
    ├── designer.md       # Design-focused role prompt
    └── enterprise.md     # Business/growth/marketing-focused role prompt
```

### 2.2 Document Purpose Redefinition

#### 2.2.1 Core Documents

- **index.md**: Unchanged - Project overview and summary
- **tech.md**: Unchanged - Comprehensive technology glossary
- **design.md**: Unchanged - Architectural and design decisions
- **code.md**: Unchanged - Implementation details and code examples

#### 2.2.2 New and Redefined Documents

- **init.md**: Transformed into an LLM system/utility prompt that establishes the base behavior, context handling, and general workflow for the LLM. This becomes the foundation that all other instructions build upon.

- **instructions.md**: A new document providing project-specific workflows, how to interact with memory banks, and detailed guidance for implementing the project. This serves as the primary developer guide.

- **memory/index.md**: A template for memory bank files, explaining the structure and purpose of memory in the system.

- **memory/bank_[n].md**: Memory bank files that store context, decisions, and progress throughout the development process.

- **architecture/*.md**: Task-specific architectural documents for comprehensive planning.

- **prompts/*.md**: Role-specific prompts that help the LLM adapt to different aspects of the development process.

### 2.3 Enhanced Workflow

1. User generates a project in the app
2. System generates all documentation files with the new structure
3. Files are downloaded with memory/ directory containing index.md template
4. User imports files into Cursor
5. User initiates the LLM workflow with `@init.md follow @instructions.md`
6. LLM processes the commands, gaining understanding of:
   - Project context from core documents
   - How to maintain and utilize memory banks
   - Which role prompts to apply in different contexts
   - How to navigate the repository effectively

### 2.4 Project Name Consistency

The system will be modified to ensure the user-provided project name is consistently applied throughout all generated documentation, replacing the generic "Project" reference.

## 3. Implementation Strategy

### 3.1 Document Template Updates

The existing template system needs to be expanded to include templates for:
- instructions.md
- memory/index.md
- prompts/architect.md
- prompts/developer.md
- prompts/designer.md
- prompts/enterprise.md

### 3.2 Pipeline Modifications

1. **Project Name Handling**:
   - Store the user-provided project name earlier in the process
   - Ensure all LLM prompts clearly specify the project name
   - Add validation to check for consistent project name usage

2. **Documentation Generation Enhancement**:
   - Modify the `generateProjectDocumentation` function to include the new document types
   - Add cross-referencing between documents
   - Ensure the LLM understands the relationships between documents

3. **Agentic Awareness**:
   - Update the prompts to ensure the LLM understands how to navigate the repository
   - Include tool usage instructions in the init.md and instructions.md
   - Enable the LLM to properly search for relevant context

### 3.3 Memory Management

The memory system needs to be implemented with:
- Clear instructions on when to create new memory banks
- Guidelines for summarizing previous context
- Methods for the LLM to efficiently reference and update memory

### 3.4 Role-Based Prompting

Each role prompt should:
- Be contextually aware of the project's tech stack and architecture
- Include specific instructions for that role's responsibilities
- Reference other documents and tools as needed
- Be templated to adapt to the specific project context

## 4. Resilience Improvements

To address API failures:

1. **Enhanced Error Handling**:
   - Implement better fallback mechanisms for Perplexity search failures
   - Store cached results for common queries
   - Add retry logic with exponential backoff

2. **Redundant Information Sources**:
   - Implement alternative search methods when Perplexity fails
   - Include baseline information in templates that can be used if searches fail

## 5. Next Steps

1. Update the template system to include new document types
2. Modify the document generation pipeline to ensure project name consistency
3. Implement the memory bank system
4. Create and refine role-based prompts
5. Enhance error handling for API calls
6. Update the UI to reflect the new document structure
7. Develop comprehensive testing procedures for the enhanced system

The proposed enhancements will transform the current project generation system into a more robust, agentic framework that can maintain context and guide development more effectively through specialized role prompts and memory management. 