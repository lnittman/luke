# CLI Application Setup Guide

This guide provides detailed setup instructions for getting started with your command-line application project.

## Prerequisites

### Go-based CLI
- Go 1.22 or later
- Git
- Make (optional but recommended)
- GoReleaser (for releases)

### Node.js-based CLI
- Node.js 20.x or later
- npm, yarn, or pnpm
- TypeScript (if using TypeScript)

### Rust-based CLI
- Rust 1.76 or later
- Cargo
- rustup

## Initial Setup

### Go Project Setup

```bash
# Clone the repository
git clone [REPOSITORY_URL]
cd [PROJECT_NAME]

# Install dependencies
go mod download
go mod tidy

# Build the project
go build -o bin/[app-name] ./cmd/[app-name]

# Run the application
./bin/[app-name]
```

### Node.js Project Setup

```bash
# Clone the repository
git clone [REPOSITORY_URL]
cd [PROJECT_NAME]

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Build TypeScript (if applicable)
npm run build

# Link the CLI globally for development
npm link
# or
yarn link

# Run the application
[app-name] --help
```

### Rust Project Setup

```bash
# Clone the repository
git clone [REPOSITORY_URL]
cd [PROJECT_NAME]

# Build the project
cargo build

# Run the application
cargo run -- --help

# Install locally
cargo install --path .
```

## Environment Configuration

### Environment Variables

Configure your environment with the required variables:

```bash
# API configuration
export API_KEY="your-api-key"
export API_URL="https://api.example.com"

# Application configuration
export APP_ENV="development"  # or "production", "staging", etc.
export LOG_LEVEL="info"       # "debug", "info", "warn", "error"
```

### Configuration Files

Create a configuration file at one of these locations:

- `./config.yaml` (current directory)
- `$HOME/.config/[app-name]/config.yaml` (user's home directory)
- `/etc/[app-name]/config.yaml` (system-wide configuration)

Example configuration file:

```yaml
# config.yaml
api:
  key: "your-api-key"
  url: "https://api.example.com"
  timeout: 30

app:
  environment: "development"
  log_level: "info"
  data_dir: "~/.local/share/[app-name]"
```

## Development Workflow

### Building

#### Go Build

```bash
# Simple build
go build -o bin/[app-name] ./cmd/[app-name]

# Build with version information
go build -ldflags="-X 'github.com/username/appname/internal/version.Version=v1.0.0'" -o bin/[app-name] ./cmd/[app-name]

# Cross-platform build
GOOS=windows GOARCH=amd64 go build -o bin/[app-name].exe ./cmd/[app-name]
GOOS=darwin GOARCH=arm64 go build -o bin/[app-name]-macos-arm64 ./cmd/[app-name]
```

#### Node.js Build

```bash
# TypeScript build
npm run build

# Package for distribution
npm pack

# Create executable with pkg
npx pkg . --targets node18-macos-x64,node18-linux-x64,node18-win-x64
```

#### Rust Build

```bash
# Debug build
cargo build

# Release build
cargo build --release

# Cross-platform build (requires cross)
cargo install cross
cross build --target x86_64-pc-windows-gnu --release
```

### Testing

```bash
# Go tests
go test ./...
go test -race ./...

# Node.js tests
npm test

# Rust tests
cargo test
```

## Common Commands and Patterns

### Command Examples

```
# Show help
[app-name] --help

# Run a subcommand
[app-name] [subcommand] [options]

# Version information
[app-name] version

# Verbose output
[app-name] --verbose [subcommand]

# Using configuration file
[app-name] --config /path/to/config.yaml [subcommand]
```

### Global Flags

Most CLIs support these common flags:

- `--help, -h`: Show help
- `--version, -v`: Show version
- `--config, -c`: Specify configuration file
- `--verbose`: Increase output verbosity
- `--quiet`: Decrease output verbosity
- `--output, -o`: Specify output format (json, yaml, table)

## Distribution and Packaging

### Go Distribution

```bash
# Using GoReleaser
goreleaser release --snapshot --clean

# Manual distribution
GOOS=linux GOARCH=amd64 go build -o ./dist/[app-name]_linux_amd64/[app-name] ./cmd/[app-name]
tar -czf ./dist/[app-name]_linux_amd64.tar.gz -C ./dist [app-name]_linux_amd64
```

### Node.js Distribution

```bash
# Publish to npm
npm publish

# Create binary with pkg
npx pkg . --output ./dist/[app-name]
```

### Rust Distribution

```bash
# Publish to crates.io
cargo publish

# Build release artifacts
cargo build --release --target x86_64-unknown-linux-gnu
cargo build --release --target x86_64-apple-darwin
cargo build --release --target x86_64-pc-windows-msvc
```

## Troubleshooting

### Common Issues

1. **Missing dependencies**: Ensure all dependencies are installed
2. **Permission denied**: Check executable permissions with `chmod +x`
3. **Environment variables**: Verify environment variables are set correctly
4. **Configuration file**: Check configuration file syntax and location
5. **API connectivity**: Test API connection and authentication
