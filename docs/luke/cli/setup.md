# Luke CLI Setup Guide

This guide walks you through setting up the Luke CLI tool and connecting it to the web application for enhanced functionality.

## Installation

### Prerequisites

- Go 1.18 or higher
- OpenRouter API key
- Luke API key (for web app integration)

### Building from Source

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/luke-cli.git
   cd luke-cli
   ```

2. Install dependencies and build:
   ```
   # Ensure all Go module dependencies are properly downloaded
   go mod download
   go mod tidy
   
   # Build the CLI
   go build -o luke
   ```

3. Move the binary to your path:
   ```
   # Create a bin directory in your home folder if it doesn't exist
   mkdir -p $HOME/bin
   
   # Copy the binary
   cp luke $HOME/bin/
   
   # Ensure $HOME/bin is in your PATH (add to your .bashrc, .zshrc, etc. if not)
   echo 'export PATH="$HOME/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc   # or restart your terminal
   ```

## Configuration

### Basic Configuration

Run the configuration tool to set up your API keys:

```
luke config
```

Navigate to the "OpenRouter API Key" option and enter your key.

### Web App Integration

For full functionality, connect the CLI to the web application:

```
luke setup-api
```

You'll be prompted to enter:
1. API endpoint URL (e.g., https://luke-app.vercel.app)
2. API key for authentication
3. Whether to enable unified API mode

## Usage

### Available Commands

- `luke chat` - Interactive AI chat with streaming responses
- `luke project` - Generate a new project
- `luke techdocs` - Search and browse tech documentation
- `luke docs` - View documentation templates
- `luke diag` - Run system diagnostics
- `luke config` - Configure settings

### Chat Command

The chat command opens an interactive chat interface with an AI model:

```
luke chat
```

- Use `Ctrl+F` to select a different model
- Use `Ctrl+S` to set your API key
- Use `Ctrl+K` to clear chat history
- Type `/help` to see available commands

### Tech Documentation

The CLI can access the shared tech documentation system:

```
luke techdocs
```

Enter a technology name to view its documentation.

### Project Generation

Generate a new project using the web app's project generator:

```
luke project
```

Follow the prompts to enter project details and select technologies.

## Troubleshooting

### Build Issues

#### Missing Go Module Dependencies

If you see errors about missing entries in go.sum, run:

```
go mod download
go mod tidy
```

Then try building again.

#### Permission Issues

If you see "permission denied" when running the CLI:

```
chmod +x /path/to/luke
```

### API Connection Issues

If you encounter connection issues:

1. Verify your internet connection
2. Check that your API keys are correctly configured
3. Ensure the API endpoint URL is correct
4. Run `luke diag` to check the system status

### Authentication Errors

If you see authentication errors:

1. Re-run `luke setup-api` to update your API key
2. Check that your API key hasn't expired
3. Verify that your account has access to the required endpoints

## Advanced Configuration

For advanced users, configuration settings are stored in:

```
~/.luke/config.json
```

You can manually edit this file, but it's recommended to use the `luke config` command. 