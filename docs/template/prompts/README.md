# Prompts Directory

This directory contains specialized prompts for agentic LLM development workflows. These prompts help guide the LLM through specific tasks and roles when working with the project.

## Directory Structure

- **roles/**: Role-specific prompts that define specialized personas for different aspects of development
- **commands/**: Workflow-specific command prompts that provide instructions for common tasks

## Using Role Prompts

Role prompts define specialized personas that the LLM can adopt to focus on specific aspects of development:

- **architect.md**: Architecture and system design focus
- **developer.md**: Implementation and coding focus
- **designer.md**: UI/UX and visual design focus
- **enterprise.md**: Business strategy and growth focus

To activate a role, use:

```
@prompts/roles/architect.md [task description]
```

## Using Command Prompts

Command prompts provide structured instructions for common workflows:

- **setup.md**: Project setup and initialization
- **testing.md**: Testing workflows and strategies
- **deployment.md**: Deployment procedures
- **[workflow].md**: Additional workflow-specific commands

To execute a command workflow, use:

```
@prompts/commands/setup.md
```

## Creating Custom Prompts

You can create custom prompts for project-specific workflows by following these guidelines:

1. Use clear, concise language
2. Include specific examples
3. Define expected inputs and outputs
4. Document any prerequisites
5. Explain how to interpret results

Custom prompts should be added to the appropriate subdirectory based on whether they define a role or a workflow. 