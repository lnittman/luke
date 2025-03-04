package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"luke/cli/api"

	"github.com/charmbracelet/bubbles/list"
	tea "github.com/charmbracelet/bubbletea"
)

// Messages
type ConfigOptionSelected struct {
	Key string
}

type ConfigValueSet struct {
	Key   string
	Value string
}

// Config item
type configItem struct {
	key         string
	title       string
	description string
}

func (i configItem) Title() string       { return i.title }
func (i configItem) Description() string { return i.description }
func (i configItem) FilterValue() string { return i.title }

// Config models
type configModel struct {
	list      list.Model
	inputMode bool
	selected  string
	value     string
	config    map[string]string
	saved     bool
	quitting  bool
}

func initialConfigModel() configModel {
	// Define configuration options
	items := []list.Item{
		configItem{
			key:         "openrouter_api_key",
			title:       "OpenRouter API Key",
			description: "Required for chat functionality with AI models",
		},
		configItem{
			key:         "vercel_blob_token",
			title:       "Vercel Blob Token",
			description: "Required for uploading tech docs to Vercel Blob storage",
		},
		configItem{
			key:         "blob_read_write_token",
			title:       "Blob Read-Write Token",
			description: "Alternative token for Vercel Blob storage (from .env file)",
		},
		configItem{
			key:         "luke_api_url",
			title:       "Luke API URL",
			description: "Base URL for Luke API server (default: http://localhost:3000)",
		},
	}

	l := list.New(items, list.NewDefaultDelegate(), 0, 0)
	l.Title = "Configuration"
	l.SetShowStatusBar(false)
	l.SetFilteringEnabled(true)
	l.Styles.Title = titleStyle

	// Load existing config
	config := loadConfig()

	return configModel{
		list:      l,
		inputMode: false,
		config:    config,
		saved:     false,
	}
}

func (m configModel) Init() tea.Cmd {
	return nil
}

func (m configModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		// Handle input mode
		if m.inputMode {
			switch msg.String() {
			case "ctrl+c", "esc":
				m.inputMode = false
				return m, nil
			case "enter":
				m.inputMode = false
				m.config[m.selected] = m.value
				m.saved = false
				saveConfig(m.config)
				m.saved = true
				return m, nil
			case "backspace":
				if len(m.value) > 0 {
					m.value = m.value[:len(m.value)-1]
				}
				return m, nil
			default:
				if len(msg.String()) == 1 {
					m.value += msg.String()
				}
				return m, nil
			}
		}

		// Handle normal mode
		switch msg.String() {
		case "ctrl+c", "q", "esc":
			m.quitting = true
			return m, tea.Quit
		case "enter":
			if i, ok := m.list.SelectedItem().(configItem); ok {
				m.selected = i.key
				m.value = m.config[i.key]
				m.inputMode = true
			}
			return m, nil
		}

	case tea.WindowSizeMsg:
		h, v := appStyle.GetFrameSize()
		m.list.SetSize(msg.Width-h, msg.Height-v)
	}

	var cmd tea.Cmd
	m.list, cmd = m.list.Update(msg)
	return m, cmd
}

func (m configModel) View() string {
	if m.quitting {
		return "thanks for using luke! 👋\n"
	}

	if m.inputMode {
		// Input mode view
		item := "unknown"
		for _, i := range m.list.Items() {
			if ci, ok := i.(configItem); ok && ci.key == m.selected {
				item = ci.title
				break
			}
		}

		return fmt.Sprintf(
			"Enter %s:\n\n%s\n\n(press Enter to save, Esc to cancel)",
			item,
			m.value+"|", // Add cursor
		)
	}

	// List view with current values
	var items []list.Item
	for _, item := range m.list.Items() {
		if ci, ok := item.(configItem); ok {
			var description string
			if value, exists := m.config[ci.key]; exists && value != "" {
				// Show masked value for sensitive data
				if strings.Contains(ci.key, "key") || strings.Contains(ci.key, "token") {
					if len(value) > 4 {
						description = "Set: " + value[:4] + "..." + value[len(value)-4:]
					} else {
						description = "Set: ****"
					}
				} else {
					description = "Set: " + value
				}
			} else {
				description = ci.description + " (Not set)"
			}

			items = append(items, configItem{
				key:         ci.key,
				title:       ci.title,
				description: description,
			})
		}
	}

	// Update list with current values
	m.list.SetItems(items)

	// Show success message if saved
	var savedMessage string
	if m.saved {
		savedMessage = "\n\n✅ Configuration saved successfully!"
	}

	return fmt.Sprintf(
		"%s%s\n\n(press Enter to edit, q to quit)",
		appStyle.Render(m.list.View()),
		savedMessage,
	)
}

// Load config from file
func loadConfig() map[string]string {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return make(map[string]string)
	}

	configDir := filepath.Join(homeDir, ".luke")
	configFile := filepath.Join(configDir, "config.json")

	// Check if config file exists
	if _, err := os.Stat(configFile); os.IsNotExist(err) {
		return make(map[string]string)
	}

	// Read config file
	data, err := ioutil.ReadFile(configFile)
	if err != nil {
		return make(map[string]string)
	}

	// Parse config file
	var config map[string]string
	if err := json.Unmarshal(data, &config); err != nil {
		return make(map[string]string)
	}

	return config
}

// Save config to file
func saveConfig(config map[string]string) error {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return err
	}

	configDir := filepath.Join(homeDir, ".luke")
	configFile := filepath.Join(configDir, "config.json")

	// Create config directory if it doesn't exist
	if _, err := os.Stat(configDir); os.IsNotExist(err) {
		if err := os.MkdirAll(configDir, 0700); err != nil {
			return err
		}
	}

	// Write config file
	data, err := json.MarshalIndent(config, "", "  ")
	if err != nil {
		return err
	}

	return ioutil.WriteFile(configFile, data, 0600)
}

// Run the config tool
func runConfigTool() {
	p := tea.NewProgram(initialConfigModel(), tea.WithAltScreen())
	if _, err := p.Run(); err != nil {
		fmt.Printf("Error running config tool: %v", err)
		os.Exit(1)
	}
}

// Set a specific config value
func setConfigValue(key, value string) error {
	config := loadConfig()
	config[key] = value
	return saveConfig(config)
}

// Get a config value
func getConfigValue(key string) string {
	config := loadConfig()
	return config[key]
}

// Set the API endpoint for unified functionality
func setAPIEndpoint(endpoint string) error {
	return setConfigValue("api_endpoint", endpoint)
}

// Get the API endpoint
func getAPIEndpoint() string {
	return getConfigValue("api_endpoint")
}

// Enable or disable unified API mode
func setUseUnifiedAPI(enabled bool) error {
	val := "false"
	if enabled {
		val = "true"
	}
	return setConfigValue("use_unified_api", val)
}

// Check if unified API mode is enabled
func isUseUnifiedAPIEnabled() bool {
	return getConfigValue("use_unified_api") == "true"
}

// Configure the unified API settings
func setupUnifiedAPIConfig() {
	fmt.Println("=== Luke API Setup ===")
	fmt.Println("This will configure your Luke CLI to connect to your Luke API instance.")
	fmt.Println()
	
	// Get current configuration
	apiEndpoint := getConfigValue("api_endpoint")
	if apiEndpoint == "" {
		apiEndpoint = "http://localhost:3000"
	}
	
	// Prompt for API endpoint
	fmt.Printf("Enter API endpoint [%s]: ", apiEndpoint)
	reader := bufio.NewReader(os.Stdin)
	input, _ := reader.ReadString('\n')
	input = strings.TrimSpace(input)
	
	if input != "" {
		apiEndpoint = input
	}
	
	// Check if the endpoint is valid
	apiEndpoint = strings.TrimSuffix(apiEndpoint, "/")
	
	// Validate the endpoint
	_, err := url.Parse(apiEndpoint)
	if err != nil {
		fmt.Printf("❌ Invalid API endpoint: %v\n", err)
		return
	}
	
	// Save the configuration
	err = setConfigValue("api_endpoint", apiEndpoint)
	if err != nil {
		fmt.Printf("❌ Failed to save API endpoint: %v\n", err)
		return
	}
	
	// Force the use of unified API
	err = setConfigValue("use_unified_api", "true")
	if err != nil {
		fmt.Printf("❌ Failed to save API configuration: %v\n", err)
		return
	}
	
	// Get current API key
	apiKey := os.Getenv("LUKE_API_KEY")
	if apiKey == "" {
		// Try to read from config
		apiKey = getConfigValue("luke_api_key")
	}
	
	if apiKey == "" {
		// Prompt for API key
		fmt.Print("Enter your Luke API key: ")
		apiKey, _ = reader.ReadString('\n')
		apiKey = strings.TrimSpace(apiKey)
		
		if apiKey != "" {
			err = setConfigValue("luke_api_key", apiKey)
			if err != nil {
				fmt.Printf("❌ Failed to save API key: %v\n", err)
				return
			}
			
			// Set environment variable for current session
			os.Setenv("LUKE_API_KEY", apiKey)
		} else {
			fmt.Println("⚠️ No API key provided.")
		}
	}
	
	// Test the connection
	fmt.Println("Testing connection to API...")
	
	client := api.NewAPIClient(apiEndpoint, apiKey)
	
	// Try to get available models as a test
	models, err := client.GetAvailableModels()
	if err != nil {
		fmt.Printf("❌ Failed to connect to API: %v\n", err)
		fmt.Println("  Check your API endpoint and API key, then try again.")
		fmt.Println("  Proceeding with default configuration.")
	} else {
		fmt.Println("✅ Successfully connected to API!")
		if len(models) > 0 {
			fmt.Println("📋 Available models:")
			for _, model := range models {
				fmt.Printf("  • %s\n", model)
			}
		}
	}
	
	fmt.Println()
	fmt.Println("API configuration complete!")
	fmt.Printf("• Endpoint: %s\n", apiEndpoint)
	fmt.Printf("• API key: %s\n", maskAPIKey(apiKey))
	fmt.Println()
	fmt.Println("You can now use the Luke CLI with your API!")
}

// Helper to mask API key for display
func maskAPIKey(key string) string {
	if key == "" {
		return "not set"
	}
	
	if len(key) <= 8 {
		return "***" + key[len(key)-3:]
	}
	
	return key[0:4] + "..." + key[len(key)-4:]
} 