# CLI Application Project Structure

This template provides the recommended directory structure for modern command-line applications. The structure is organized to support both simple and complex CLI tools with a focus on maintainability and extensibility.

## Directory Structure

```
/
├── cmd/                      # Command-line entry points
│   ├── [app-name]/           # Main application entry point
│   │   └── main.go           # Main function
│   └── tools/                # Supporting tools and utilities
├── internal/                 # Private application code
│   ├── commands/             # Command implementations
│   │   ├── root.go           # Root command
│   │   └── subcommands/      # Various subcommands
│   ├── config/               # Configuration management
│   │   └── config.go         # Configuration structure and loading
│   ├── ui/                   # User interface components
│   │   ├── prompts/          # Interactive prompts
│   │   ├── display/          # Output formatting
│   │   └── styles/           # Terminal styles
│   ├── api/                  # API client code
│   │   └── client.go         # API client implementation
│   └── models/               # Data models
├── pkg/                      # Public libraries
│   ├── logger/               # Logging utilities
│   ├── utils/                # General utilities
│   └── errors/               # Error handling
├── assets/                   # Static assets
│   ├── templates/            # Text templates
│   └── examples/             # Example data
├── scripts/                  # Build and development scripts
│   ├── build.sh              # Build script
│   └── release.sh            # Release automation
├── docs/                     # Documentation
│   ├── user/                 # User documentation
│   ├── dev/                  # Developer documentation
│   └── examples/             # Example use cases
├── config/                   # Default configurations
│   └── default.yaml          # Default config file
├── tests/                    # Tests
│   ├── unit/                 # Unit tests
│   ├── integration/          # Integration tests
│   └── fixtures/             # Test fixtures
├── .goreleaser.yml           # GoReleaser configuration
├── Makefile                  # Build automation
├── go.mod                    # Go module definition
└── README.md                 # Project documentation
```

## Alternative Structures

### Node.js CLI Structure

```
/
├── bin/                      # Executable scripts
│   └── cli.js                # Main entry point
├── src/                      # Source code
│   ├── commands/             # Command implementations
│   ├── lib/                  # Core functionality
│   └── utils/                # Utility functions
├── dist/                     # Compiled code (TypeScript)
├── test/                     # Tests
├── package.json              # Project and dependencies
└── tsconfig.json             # TypeScript configuration
```

### Rust CLI Structure

```
/
├── src/                      # Source files
│   ├── main.rs               # Application entry point
│   ├── commands/             # Command modules
│   ├── config/               # Configuration handling
│   └── ui/                   # User interface code
├── tests/                    # Integration tests
├── benches/                  # Benchmarks
├── Cargo.toml                # Project manifest
└── Cargo.lock                # Dependency lock file
```

## Key Files and Their Purpose

- **cmd/[app-name]/main.go**: Application entry point
- **internal/commands/root.go**: Root command definition
- **internal/config/config.go**: Configuration management
- **pkg/logger/logger.go**: Logging setup
- **Makefile**: Build and development tasks

## Development Workflow

1. **Setup**: Clone the repository and install dependencies
2. **Development**: Implement commands and features
3. **Testing**: Write unit and integration tests
4. **Building**: Create distributable binaries
5. **Distribution**: Package and publish the CLI

## Command Implementation Pattern

```go
// Example command implementation in Go with Cobra
func NewExampleCommand() *cobra.Command {
  cmd := &cobra.Command{
    Use:   "example",
    Short: "Example command description",
    Long:  "Detailed description of the example command",
    RunE: func(cmd *cobra.Command, args []string) error {
      // Command implementation
      return nil
    },
  }
  
  // Add flags
  cmd.Flags().StringP("flag", "f", "", "Flag description")
  
  return cmd
}
```

## Configuration Management

The CLI uses a hierarchical configuration system with the following precedence:

1. Command line flags
2. Environment variables
3. Configuration file
4. Default values

Refer to tech.md for the complete technology stack details and design.md for architectural decisions.
