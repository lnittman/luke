package main

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/charmbracelet/bubbles/list"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
)

var (
	appStyle = lipgloss.NewStyle().
		Padding(1, 2).
		BorderStyle(lipgloss.RoundedBorder()).
		BorderForeground(lipgloss.Color("#9A348E"))

	titleStyle = lipgloss.NewStyle().
		Foreground(lipgloss.Color("#FFFFFF")).
		Background(lipgloss.Color("#9A348E")).
		Padding(0, 1).
		Bold(true)
)

type item struct {
	title       string
	description string
	command     string
}

func (i item) Title() string       { return i.title }
func (i item) Description() string { return i.description }
func (i item) FilterValue() string { return i.title }

type model struct {
	list     list.Model
	selected item
	quitting bool
}

func initialModel() model {
	items := []list.Item{
		item{
			title:       "✨ generate project",
			description: "create a new project with the project generator",
			command:     "generate",
		},
		item{
			title:       "💬 chat interface",
			description: "interactive AI chat with streaming responses & model selection",
			command:     "chat",
		},
		item{
			title:       "🔄 update tech docs",
			description: "manually update tech.md and tech stack documentation",
			command:     "update-tech",
		},
		item{
			title:       "📚 view documentation",
			description: "browse and view documentation templates",
			command:     "view-docs",
		},
		item{
			title:       "🛠️ run diagnostics",
			description: "check system configuration and diagnose issues",
			command:     "diagnostics",
		},
		item{
			title:       "🧩 tech stack viewer",
			description: "browse and explore available tech stacks",
			command:     "tech-stacks",
		},
		item{
			title:       "⚙️ configure",
			description: "set up API keys and other configuration values",
			command:     "config",
		},
		item{
			title:       "👋 quit",
			description: "exit the luke tool",
			command:     "quit",
		},
	}

	l := list.New(items, list.NewDefaultDelegate(), 0, 0)
	l.Title = "💫 luke"
	l.SetShowStatusBar(false)
	l.SetFilteringEnabled(false)
	l.Styles.Title = titleStyle

	return model{list: l}
}

func (m model) Init() tea.Cmd {
	return nil
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		if msg.String() == "ctrl+c" {
			return m, tea.Quit
		}

		if msg.String() == "enter" {
			i, ok := m.list.SelectedItem().(item)
			if ok {
				m.selected = i
				if i.command == "quit" {
					m.quitting = true
					return m, tea.Quit
				}
				
				// Launch the selected tool
				switch i.command {
				case "generate":
					m.quitting = true
					// We'll run this after tea.Quit
					return m, tea.Quit
				case "chat":
					m.quitting = true
					// Set a flag to run the chat interface after quitting
					return m, tea.Quit
				case "update-tech":
					m.quitting = true
					return m, tea.Quit
				case "view-docs":
					m.quitting = true
					return m, tea.Quit
				case "diagnostics":
					m.quitting = true
					return m, tea.Quit
				case "tech-stacks":
					m.quitting = true
					return m, tea.Quit
				case "config":
					m.quitting = true
					return m, tea.Quit
				}
			}
		}
	case tea.WindowSizeMsg:
		h, v := appStyle.GetFrameSize()
		m.list.SetSize(msg.Width-h, msg.Height-v)
	}

	var cmd tea.Cmd
	m.list, cmd = m.list.Update(msg)
	return m, cmd
}

func (m model) View() string {
	if m.quitting {
		return "thanks for using luke! 👋\n"
	}
	return appStyle.Render(m.list.View())
}

func main() {
	// Check if command line args are provided for subcommands
	if len(os.Args) > 1 {
		command := os.Args[1]
		
		switch command {
		case "chat":
			runChatInterface()
		case "config":
			runConfigTool()
		case "diag", "diagnostics":
			runSystemDiagnostics()
		case "docs", "doc":
			runDocViewer()
		case "techdocs", "tech":
			runTechDocsViewer()
		case "project", "generate":
			runProjectGenerator()
		case "setup-api":
			setupUnifiedAPIConfig()
		default:
			fmt.Printf("Unknown command: %s\n", command)
			fmt.Println("Available commands: chat, config, diagnostics, docs, techdocs, project, setup-api")
			os.Exit(1)
		}
		
		return
	}
	
	// If no command provided, show a menu of options
	clearScreen()
	fmt.Println("🌿 Luke CLI - 2025")
	fmt.Println("------------------")
	fmt.Println("1. Chat with LLM")
	fmt.Println("2. Configure settings")
	fmt.Println("3. Run diagnostics")
	fmt.Println("4. View documentation templates")
	fmt.Println("5. Search tech documentation")
	fmt.Println("6. Generate project")
	fmt.Println("7. Setup API connection")
	fmt.Println("8. Exit")
	
	fmt.Print("\nSelect an option: ")
	reader := bufio.NewReader(os.Stdin)
	input, _ := reader.ReadString('\n')
	input = strings.TrimSpace(input)
	
	switch input {
	case "1":
		runChatInterface()
	case "2":
		runConfigTool()
	case "3":
		runSystemDiagnostics()
	case "4":
		runDocViewer()
	case "5":
		runTechDocsViewer()
	case "6":
		runProjectGenerator()
	case "7":
		setupUnifiedAPIConfig()
	case "8", "exit", "quit":
		fmt.Println("Goodbye! 👋")
		os.Exit(0)
	default:
		fmt.Println("Invalid option. Exiting.")
		os.Exit(1)
	}
}

// loadEnvFromDotEnvLocal reads variables from .env.local and sets them in the environment
func loadEnvFromDotEnvLocal() {
	// Try to locate the .env.local file or .env file
	envPaths := []string{
		".env.local",              // Current directory .env.local
		".env",                    // Current directory .env
		"../.env.local",           // Parent directory .env.local
		"../.env",                 // Parent directory .env
		"../../.env.local",        // Two levels up .env.local
		"../../.env",              // Two levels up .env
		filepath.Join(os.Getenv("HOME"), "Developer/apps/luke/.env.local"), // Common project location
		filepath.Join(os.Getenv("HOME"), "Developer/apps/luke/.env"),       // Common project location
	}
	
	var envFile string
	for _, path := range envPaths {
		if _, err := os.Stat(path); err == nil {
			envFile = path
			fmt.Printf("Found environment file: %s\n", path)
			break
		}
	}
	
	if envFile == "" {
		// No env file found, check if environment variables are already set
		if os.Getenv("LUKE_VERCEL_BLOB_TOKEN") == "" && os.Getenv("VERCEL_BLOB_TOKEN") == "" {
			fmt.Println("Warning: No .env or .env.local file found and no blob token in environment")
		}
		return
	}
	
	// Read the env file
	content, err := os.ReadFile(envFile)
	if err != nil {
		fmt.Printf("Warning: Error reading environment file: %v\n", err)
		return
	}
	
	// Parse the file line by line
	lines := strings.Split(string(content), "\n")
	for _, line := range lines {
		// Skip empty lines and comments
		line = strings.TrimSpace(line)
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		
		// Parse key-value pairs
		parts := strings.SplitN(line, "=", 2)
		if len(parts) != 2 {
			continue
		}
		
		key := strings.TrimSpace(parts[0])
		value := strings.TrimSpace(parts[1])
		
		// Remove quotes if present
		value = strings.Trim(value, `"'`)
		
		// Check for Vercel Blob token or the Vercel Blob Read-Write token
		if key == "VERCEL_BLOB_TOKEN" || key == "BLOB_READ_WRITE_TOKEN" {
			// Set as VERCEL_BLOB_TOKEN if not already set
			if os.Getenv("VERCEL_BLOB_TOKEN") == "" {
				os.Setenv("VERCEL_BLOB_TOKEN", value)
				fmt.Printf("✅ Exported %s as VERCEL_BLOB_TOKEN\n", key)
			}
			
			// Also set as LUKE_VERCEL_BLOB_TOKEN if not already set
			if os.Getenv("LUKE_VERCEL_BLOB_TOKEN") == "" {
				os.Setenv("LUKE_VERCEL_BLOB_TOKEN", value)
				fmt.Printf("✅ Exported %s as LUKE_VERCEL_BLOB_TOKEN\n", key)
			}
		}
		
		// You can add other environment variables to export here as needed
	}
}

func printHelp() {
	fmt.Println(`luke - project management and documentation tools 🚀

usage:
  luke [command]

available commands:
  generate     ✨ create a new project with the project generator
  chat         💬 interactive AI chat with streaming responses & model selection
  update-tech  🔄 manually update tech.md and tech stack documentation
  view-docs    📚 browse and view documentation templates
  diagnostics  🛠️ check system configuration and diagnose issues
  tech-stacks  🧩 browse and explore available tech stacks
  config       ⚙️ set up API keys and other configuration values
  help         ❓ print this help message

if no command is provided, an interactive menu will be displayed.
`)
}

// clearScreen clears the terminal screen
func clearScreen() {
	fmt.Print("\033[H\033[2J")
} 