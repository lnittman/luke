package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
	"unicode"

	"github.com/charmbracelet/bubbles/spinner"
	"github.com/charmbracelet/bubbles/textarea"
	"github.com/charmbracelet/bubbles/viewport"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/glamour"
	"github.com/charmbracelet/lipgloss"
	"luke/cli/api"
)

// Available models
var availableModels = []string{
	"anthropic/claude-3.7-sonnet",
	"anthropic/claude-3-opus",
	"anthropic/claude-3-sonnet",
	"anthropic/claude-3-haiku",
	"anthropic/claude-3.5-sonnet",
	"google/gemini-1.5-pro",
	"google/gemini-1.5-flash",
	"openai/gpt-4o",
	"openai/gpt-4-turbo",
	"openai/gpt-3.5-turbo",
	"meta/llama-3-70b-instruct",
	"mistral/mistral-large",
	"mistral/mistral-medium",
}

// Common model providers
var modelProviders = map[string]string{
	"anthropic": "blue",
	"google":    "green",
	"openai":    "magenta",
	"meta":      "yellow",
	"mistral":   "red",
}

// Chat message
type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// Messages for state updates
type APIKeyUpdated struct {
	Key string
}

type ModelSelected struct {
	Model string
}

type MessageSubmitted struct {
	Content string
}

type ResponseReceived struct {
	Content string
}

type StreamUpdate struct {
	Content string
}

type TokensInfo struct {
	Prompt     int
	Completion int
	Total      int
}

// Chat model struct
type chatModel struct {
	messages        []Message
	textarea        textarea.Model
	viewport        viewport.Model
	spinner         spinner.Model
	apiKey          string
	selectedModel   string
	availableModels []string
	waiting         bool
	showModelPicker bool
	streaming       bool
	streamContent   string
	tokens          TokensInfo
	responseStyle   lipgloss.Style
	userStyle       lipgloss.Style
	systemStyle     lipgloss.Style
	helpStyle       lipgloss.Style
	errorStyle      lipgloss.Style
	modelStyle      lipgloss.Style
	tokensStyle     lipgloss.Style
	err             error
	selectedModelIndex int // Added field for model picker navigation
	searchMode      bool  // Whether we're in search mode
	searchQuery     string // Search query for filtering models
	filteredModels  []string // Models filtered by search query
	viewportOffset  int  // Track viewport offset for model picker
	lastRefresh     time.Time // Track last UI refresh time
}

// Initialize the chat model
func initialChatModel() chatModel {
	ta := textarea.New()
	ta.Placeholder = "Type your message here..."
	ta.Focus()
	ta.CharLimit = 4000
	ta.SetHeight(3)
	ta.SetWidth(100)
	ta.ShowLineNumbers = false
	ta.KeyMap.InsertNewline.SetEnabled(true)

	// Create viewport for chat history with improved styles
	vp := viewport.New(100, 30)
	vp.SetContent("")

	// Spinner for loading state with improved style
	s := spinner.New()
	s.Spinner = spinner.Dot
	s.Style = lipgloss.NewStyle().Foreground(lipgloss.Color("#9A348E"))

	// Read API key from environment or config file
	apiKey := os.Getenv("OPENROUTER_API_KEY")
	if apiKey == "" {
		// Try to read from config file
		homeDir, err := os.UserHomeDir()
		if err == nil {
			configDir := filepath.Join(homeDir, ".luke")
			configFile := filepath.Join(configDir, "config.json")
			if _, err := os.Stat(configFile); err == nil {
				data, err := ioutil.ReadFile(configFile)
				if err == nil {
					var config map[string]string
					if err := json.Unmarshal(data, &config); err == nil {
						apiKey = config["openrouter_api_key"]
					}
				}
			}
		}
	}

	// Create styles with improved colors and spacing
	responseStyle := lipgloss.NewStyle().
		Foreground(lipgloss.Color("#83AAFF")).
		Bold(false).
		Italic(false).
		MarginTop(1).
		MarginBottom(1)

	userStyle := lipgloss.NewStyle().
		Foreground(lipgloss.Color("#FF83AA")).
		Bold(true).
		MarginTop(1).
		MarginBottom(0)

	systemStyle := lipgloss.NewStyle().
		Foreground(lipgloss.Color("#CCCCCC")).
		Italic(true).
		MarginTop(1).
		MarginBottom(1)

	helpStyle := lipgloss.NewStyle().
		Foreground(lipgloss.Color("#888888")).
		Italic(true).
		MarginTop(1).
		MarginBottom(1)

	errorStyle := lipgloss.NewStyle().
		Foreground(lipgloss.Color("#FF5555")).
		Bold(true).
		MarginTop(1).
		MarginBottom(1)

	modelStyle := lipgloss.NewStyle().
		Foreground(lipgloss.Color("#55AAFF")).
		Bold(true).
		MarginBottom(1)

	tokensStyle := lipgloss.NewStyle().
		Foreground(lipgloss.Color("#888888")).
		Italic(true).
		MarginTop(1)
		
	// Initial system message for context
	initialMessages := []Message{
		{
			Role:    "system",
			Content: "You are Claude, an AI assistant created by Anthropic to be helpful, harmless, and honest. " +
				"Respond to user queries accurately and concisely. You are being used in a terminal interface, " +
				"so format your responses appropriately using Markdown.",
		},
	}

	return chatModel{
		textarea:        ta,
		viewport:        vp,
		spinner:         s,
		apiKey:          apiKey,
		selectedModel:   "anthropic/claude-3.7-sonnet", // Set Claude 3.7 Sonnet as default
		availableModels: availableModels,
		filteredModels:  availableModels, // Initialize with all models
		selectedModelIndex: 0, // Initialize the selected index
		viewportOffset:  0, // Initialize viewport offset
		messages:        initialMessages,
		responseStyle:   responseStyle,
		userStyle:       userStyle,
		systemStyle:     systemStyle,
		helpStyle:       helpStyle,
		errorStyle:      errorStyle,
		modelStyle:      modelStyle,
		tokensStyle:     tokensStyle,
		searchMode:      false,
		searchQuery:     "",
		lastRefresh:     time.Now(), // Initialize lastRefresh
	}
}

func (m chatModel) Init() tea.Cmd {
	return tea.Batch(
		textarea.Blink,
		m.spinner.Tick,
		streamRefreshTick(),
		timeoutCheckerTick(),
	)
}

// Save API key to config file
func saveApiKey(key string) error {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return err
	}

	configDir := filepath.Join(homeDir, ".luke")
	if err := os.MkdirAll(configDir, 0700); err != nil {
		return err
	}

	configFile := filepath.Join(configDir, "config.json")

	// Read existing config if it exists
	var config map[string]string
	if _, err := os.Stat(configFile); err == nil {
		data, err := ioutil.ReadFile(configFile)
		if err != nil {
			config = make(map[string]string)
		} else {
			if err := json.Unmarshal(data, &config); err != nil {
				config = make(map[string]string)
			}
		}
	} else {
		config = make(map[string]string)
	}

	// Update the key
	config["openrouter_api_key"] = key

	// Write back to file
	data, err := json.MarshalIndent(config, "", "  ")
	if err != nil {
		return err
	}

	return ioutil.WriteFile(configFile, data, 0600)
}

// Fix model name format by cleaning up any special suffixes
func cleanModelName(model string) string {
	// Remove any suffixes like ":thinking", ":beta", etc.
	if idx := strings.Index(model, ":"); idx >= 0 {
		return model[:idx]
	}
	return model
}

// Create a tick command for refreshing the UI during streaming
func streamRefreshTick() tea.Cmd {
	return tea.Tick(time.Millisecond*50, func(t time.Time) tea.Msg {
		return streamRefreshTickMsg(t)
	})
}

// Add a timeout checker tick
func timeoutCheckerTick() tea.Cmd {
	return tea.Tick(time.Second*5, func(t time.Time) tea.Msg {
		return timeoutCheckerTickMsg(t)
	})
}

// Tick message type for handling streaming refreshes
type streamRefreshTickMsg time.Time

// Tick message type for handling timeouts
type timeoutCheckerTickMsg time.Time

// Submit message to OpenRouter API with streaming
func submitMessage(apiKey string, model string, messages []Message) tea.Cmd {
	return func() tea.Msg {
		// Check if we should use the unified API
		useUnifiedAPI := getConfigValue("use_unified_api") == "true"
		apiEndpoint := getConfigValue("api_endpoint")
		
		if useUnifiedAPI && apiEndpoint != "" {
			// Use the API client to submit the message
			client := api.NewAPIClient(apiEndpoint, apiKey)
			
			// Convert chat messages to prompt
			prompt := ""
			for _, msg := range messages {
				prompt += msg.Role + ": " + msg.Content + "\n\n"
			}
			
			// Create request
			req := api.LLMRequest{
				Prompt:      prompt,
				Model:       model,
				Temperature: 0.7,
			}
			
			// Send request to API
			response, err := client.GenerateLLMResponse(req)
			if err != nil {
				return fmt.Errorf("API error: %v", err)
			}
			
			// Return the response
			return ResponseReceived{Content: response.Content}
		} else {
			// Use the existing direct OpenRouter implementation
			// (keep existing code here)
			return ResponseReceived{Content: "Error: Implementation missing"}
		}
	}
}

// List available models from OpenRouter
func fetchAvailableModels(apiKey string) tea.Cmd {
	return func() tea.Msg {
		if apiKey == "" {
			return availableModels
		}

		req, err := http.NewRequest("GET", "https://openrouter.ai/api/v1/models", nil)
		if err != nil {
			return availableModels
		}

		req.Header.Set("Authorization", "Bearer "+apiKey)
		req.Header.Set("HTTP-Referer", "https://github.com/yourusername/luke-cli")
		req.Header.Set("X-Title", "Luke CLI Chat")

		client := &http.Client{Timeout: 10 * time.Second}
		resp, err := client.Do(req)
		if err != nil {
			return availableModels
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			return availableModels
		}

		var modelsResponse struct {
			Data []struct {
				ID          string `json:"id"`
				Name        string `json:"name"`
				Description string `json:"description"`
			} `json:"data"`
		}

		if err := json.NewDecoder(resp.Body).Decode(&modelsResponse); err != nil {
			return availableModels
		}

		models := []string{}
		for _, model := range modelsResponse.Data {
			models = append(models, model.ID)
		}

		if len(models) == 0 {
			return availableModels
		}

		return models
	}
}

// Detect image paths in the message and add image URLs if needed
func processMultiModalMessage(message string) Message {
	// Split message by lines
	lines := strings.Split(message, "\n")
	
	// Look for image paths
	for i, line := range lines {
		trimmedLine := strings.TrimSpace(line)
		if strings.HasPrefix(trimmedLine, "image:") || strings.HasSuffix(trimmedLine, ".jpg") || 
		   strings.HasSuffix(trimmedLine, ".png") || strings.HasSuffix(trimmedLine, ".jpeg") {
			// Replace the line with markdown image
			imagePath := strings.TrimPrefix(trimmedLine, "image:")
			imagePath = strings.TrimSpace(imagePath)
			
			// Check if file exists
			if _, err := os.Stat(imagePath); err == nil {
				// Convert to absolute path if needed
				if !filepath.IsAbs(imagePath) {
					currentDir, err := os.Getwd()
					if err == nil {
						imagePath = filepath.Join(currentDir, imagePath)
					}
				}
				
				// Use file:// protocol for local files
				lines[i] = fmt.Sprintf("![image](file://%s)", imagePath)
			}
		}
	}
	
	// Rejoin the lines
	processedMessage := strings.Join(lines, "\n")
	
	return Message{
		Role:    "user",
		Content: processedMessage,
	}
}

// Improve the fuzzy filtering function to be more flexible
func fuzzyFilter(query string, models []string) []string {
	if query == "" {
		return models
	}
	
	query = strings.ToLower(query)
	queryParts := strings.Fields(query) // Split by whitespace to support multi-term search
	filtered := []string{}
	
	for _, model := range models {
		modelLower := strings.ToLower(model)
		
		// If we have multiple query parts, check that all parts match
		allPartsMatch := true
		for _, part := range queryParts {
			if !strings.Contains(modelLower, part) {
				allPartsMatch = false
				break
			}
		}
		
		if allPartsMatch {
			filtered = append(filtered, model)
		}
	}
	
	return filtered
}

// Add a function to group models by provider for better organization
func groupModelsByProvider(models []string) map[string][]string {
	grouped := make(map[string][]string)
	
	for _, model := range models {
		// Extract provider from model ID
		parts := strings.Split(model, "/")
		provider := "other"
		
		if len(parts) > 0 {
			provider = parts[0]
		}
		
		// Add to appropriate group
		if _, exists := grouped[provider]; !exists {
			grouped[provider] = []string{}
		}
		
		grouped[provider] = append(grouped[provider], model)
	}
	
	return grouped
}

// Enhanced model picker rendering
func renderModelPicker(m chatModel) string {
	var content strings.Builder
	
	// Show search prompt if in search mode
	if m.searchMode {
		searchStyle := lipgloss.NewStyle().
			Foreground(lipgloss.Color("#55AAFF")).
			Bold(true).
			MarginBottom(1)
		
		content.WriteString(searchStyle.Render(fmt.Sprintf("Search Models: '%s_'", m.searchQuery)) + "\n")
		content.WriteString("ESC: Exit Search • Type to filter • ↑/↓: Navigate • Enter: Select\n\n")
	} else {
		headerStyle := lipgloss.NewStyle().
			Foreground(lipgloss.Color("#55AAFF")).
			Bold(true).
			MarginBottom(1)
		
		content.WriteString(headerStyle.Render("Model Selector") + "\n")
		content.WriteString("i or /: Search • ↑↓ or j/k: Navigate • PgUp/PgDn: Jump • Enter: Select • ESC: Close\n\n")
	}
	
	// If we have a search query, show how many matches
	if m.searchQuery != "" {
		matchStyle := lipgloss.NewStyle().
			Foreground(lipgloss.Color("#AAAAAA")).
			Italic(true).
			MarginBottom(1)
		
		content.WriteString(matchStyle.Render(fmt.Sprintf("Showing %d/%d models matching '%s'", 
			len(m.filteredModels), len(m.availableModels), m.searchQuery)) + "\n\n")
	}
	
	// If we're searching, show flat list
	if m.searchQuery != "" {
		// Show filtered models with improved highlighting
		for i, model := range m.filteredModels {
			// Determine provider color
			color := "white"
			for provider, providerColor := range modelProviders {
				if strings.HasPrefix(model, provider) {
					color = providerColor
					break
				}
			}
			
			// Format model name with colored highlighting
			modelStyle := lipgloss.NewStyle().Foreground(lipgloss.Color(color))
			
			// Highlight selected model
			if i == m.selectedModelIndex {
				selectedStyle := lipgloss.NewStyle().
					Bold(true).
					Background(lipgloss.Color("#333333")).
					Foreground(lipgloss.Color(color)).
					Padding(0, 1)
				
				content.WriteString(fmt.Sprintf(" → %s ←\n", selectedStyle.Render(model)))
			} else {
				content.WriteString(fmt.Sprintf("   %s\n", modelStyle.Render(model)))
			}
		}
	} else {
		// Group models by provider for better organization
		groupedModels := groupModelsByProvider(m.filteredModels)
		
		// Get sorted list of providers for consistent display
		providers := make([]string, 0, len(groupedModels))
		for provider := range groupedModels {
			providers = append(providers, provider)
		}
		sort.Strings(providers)
		
		// Track the overall index for selection
		currentIndex := 0
		
		// Display models grouped by provider
		for _, provider := range providers {
			models := groupedModels[provider]
			
			// Skip empty groups
			if len(models) == 0 {
				continue
			}
			
			// Get provider color
			color := "white"
			if providerColor, exists := modelProviders[provider]; exists {
				color = providerColor
			}
			
			// Display provider header
			headerStyle := lipgloss.NewStyle().
				Foreground(lipgloss.Color(color)).
				Bold(true).
				Underline(true).
				MarginTop(1)
			
			content.WriteString(headerStyle.Render(strings.ToUpper(provider)) + "\n")
			
			// Display models in this provider group
			for _, model := range models {
				// Format model name (remove provider prefix for cleaner display)
				displayName := model
				if strings.HasPrefix(model, provider+"/") {
					displayName = strings.TrimPrefix(model, provider+"/")
				}
				
				modelStyle := lipgloss.NewStyle().Foreground(lipgloss.Color(color))
				
				// Highlight selected model
				if currentIndex == m.selectedModelIndex {
					selectedStyle := lipgloss.NewStyle().
						Bold(true).
						Background(lipgloss.Color("#333333")).
						Foreground(lipgloss.Color(color)).
						Padding(0, 1)
					
					content.WriteString(fmt.Sprintf(" → %s ←\n", selectedStyle.Render(displayName)))
				} else {
					content.WriteString(fmt.Sprintf("   %s\n", modelStyle.Render(displayName)))
				}
				
				currentIndex++
			}
		}
	}
	
	// If no matches, show message
	if len(m.filteredModels) == 0 {
		noMatchStyle := lipgloss.NewStyle().
			Foreground(lipgloss.Color("#FF5555")).
			Italic(true).
			MarginTop(1)
		
		content.WriteString(noMatchStyle.Render("\nNo models match your search query."))
	}
	
	return content.String()
}

func (m chatModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	var cmds []tea.Cmd
	var cmd tea.Cmd

	switch msg := msg.(type) {
	case tea.KeyMsg:
		// Special handling for arrow keys in model picker
		if m.showModelPicker {
			// Check if key is up, down, j, k, pgup, pgdown regardless of search mode
			switch msg.String() {
			case "up", "k":
				if m.selectedModelIndex > 0 {
					m.selectedModelIndex--
					
					// Ensure the selected model is visible in the viewport
					headerLines := 4
					selectedLine := headerLines + m.selectedModelIndex
					if selectedLine < m.viewport.YOffset {
						m.viewport.SetYOffset(selectedLine)
					}
					
					// Redraw the model picker
					content := renderModelPicker(m)
					m.viewport.SetContent(content)
					return m, nil
				}
				return m, nil
				
			case "down", "j":
				if m.selectedModelIndex < len(m.filteredModels) - 1 {
					m.selectedModelIndex++
					
					// Ensure the selected model is visible in the viewport
					headerLines := 4
					visibleLines := m.viewport.Height - 5 // Adjust for header/footer
					selectedLine := headerLines + m.selectedModelIndex
					if selectedLine >= m.viewport.YOffset + visibleLines {
						m.viewport.SetYOffset(selectedLine - visibleLines + 1)
					}
					
					// Redraw the model picker
					content := renderModelPicker(m)
					m.viewport.SetContent(content)
					return m, nil
				}
				return m, nil
				
			case "pgup":
				// Page up - move selection up by 10 items
				m.selectedModelIndex = max(0, m.selectedModelIndex-10)
				
				// Ensure the selected model is visible in the viewport
				headerLines := 4
				selectedLine := headerLines + m.selectedModelIndex
				if selectedLine < m.viewport.YOffset {
					m.viewport.SetYOffset(selectedLine)
				}
				
				// Redraw the model picker
				content := renderModelPicker(m)
				m.viewport.SetContent(content)
				return m, nil
				
			case "pgdown":
				// Page down - move selection down by 10 items
				m.selectedModelIndex = min(len(m.filteredModels)-1, m.selectedModelIndex+10)
				
				// Ensure the selected model is visible in the viewport
				headerLines := 4
				visibleLines := m.viewport.Height - 5 // Adjust for header/footer
				selectedLine := headerLines + m.selectedModelIndex
				if selectedLine >= m.viewport.YOffset + visibleLines {
					m.viewport.SetYOffset(selectedLine - visibleLines + 1)
				}
				
				// Redraw the model picker
				content := renderModelPicker(m)
				m.viewport.SetContent(content)
				return m, nil
			}
		}
		
		// If we're in model picker and search mode, handle search specific keys
		if m.showModelPicker && m.searchMode {
			switch msg.String() {
			case "esc":
				// Exit search mode, but stay in model picker
				m.searchMode = false
				
				// Refilter models based on current search query
				m.filteredModels = fuzzyFilter(m.searchQuery, m.availableModels)
				
				// Reset selection if filtered list is empty
				if len(m.filteredModels) > 0 {
					if m.selectedModelIndex >= len(m.filteredModels) {
						m.selectedModelIndex = len(m.filteredModels) - 1
					}
				} else {
					m.selectedModelIndex = 0
				}
				
				// Redraw the model picker
				content := renderModelPicker(m)
				m.viewport.SetContent(content)
				return m, nil
				
			case "enter":
				// Select model if we have results and exit model picker
				if len(m.filteredModels) > 0 && m.selectedModelIndex < len(m.filteredModels) {
					m.selectedModel = m.filteredModels[m.selectedModelIndex]
					m.showModelPicker = false
					m.searchMode = false
					
					// Restore chat view
					content := m.renderMessages()
					m.viewport.SetContent(content)
				}
				return m, nil
				
			case "backspace":
				// Handle backspace in search
				if len(m.searchQuery) > 0 {
					m.searchQuery = m.searchQuery[:len(m.searchQuery)-1]
					
					// Refilter models
					m.filteredModels = fuzzyFilter(m.searchQuery, m.availableModels)
					
					// Reset selection if necessary
					if len(m.filteredModels) > 0 {
						if m.selectedModelIndex >= len(m.filteredModels) {
							m.selectedModelIndex = len(m.filteredModels) - 1
						}
					} else {
						m.selectedModelIndex = 0
					}
					
					// Redraw model picker
					content := renderModelPicker(m)
					m.viewport.SetContent(content)
					return m, nil
				}
				return m, nil
				
			default:
				// For printable characters, add to search
				if len(msg.String()) == 1 && unicode.IsPrint([]rune(msg.String())[0]) {
					m.searchQuery += msg.String()
					
					// Refilter models
					m.filteredModels = fuzzyFilter(m.searchQuery, m.availableModels)
					
					// Reset selection
					m.selectedModelIndex = 0
					
					// Redraw model picker
					content := renderModelPicker(m)
					m.viewport.SetContent(content)
					return m, nil
				}
			}
		} else if m.showModelPicker {
			// Normal mode model picker key handling
			switch msg.String() {
			case "i", "/":
				// Enter search mode if in model picker
				m.searchMode = true
				m.searchQuery = ""
				
				// Reset filtered models to show all
				m.filteredModels = m.availableModels
				
				// Redraw model picker
				content := renderModelPicker(m)
				m.viewport.SetContent(content)
				return m, nil
				
			case "enter":
				// Handle model selection
				if len(m.filteredModels) > 0 && m.selectedModelIndex < len(m.filteredModels) {
					m.selectedModel = m.filteredModels[m.selectedModelIndex]
					m.showModelPicker = false
					m.searchMode = false
					
					// Restore chat view
					content := m.renderMessages()
					m.viewport.SetContent(content)
					return m, nil
				}
				return m, nil
				
			case "esc":
				// If we're in model picker, exit it
				m.showModelPicker = false
				m.searchMode = false
				
				// Restore chat view
				content := m.renderMessages()
				m.viewport.SetContent(content)
				return m, nil
			}
		} else {
			// Normal key handling for chat mode
			switch msg.String() {
			case "ctrl+c":
				return m, tea.Quit

			case "ctrl+f": // Toggle model picker
				if !m.waiting {
					m.showModelPicker = !m.showModelPicker
					if m.showModelPicker {
						// Reset search state
						m.searchMode = false
						m.searchQuery = ""
						
						// Find the index of the current selected model
						for i, model := range m.availableModels {
							if model == m.selectedModel {
								m.selectedModelIndex = i
								break
							}
						}
						
						// Initialize filtered models with all models
						m.filteredModels = m.availableModels
						
						// Render the model picker view
						content := renderModelPicker(m)
						m.viewport.SetContent(content)
						
						// Also fetch available models to refresh
						return m, fetchAvailableModels(m.apiKey)
					} else {
						// When closing the model picker, restore chat view
						content := m.renderMessages()
						m.viewport.SetContent(content)
					}
				}
				return m, nil
				
			case "ctrl+k": // Clear chat history
				m.messages = []Message{}
				m.viewport.SetContent("")
				return m, nil

			case "ctrl+s": // Enter API key
				if !m.waiting {
					// Prompt for API key
					fmt.Print("Enter your OpenRouter API key: ")
					scanner := bufio.NewScanner(os.Stdin)
					scanner.Scan()
					apiKey := scanner.Text()
					
					if apiKey != "" {
						m.apiKey = apiKey
						// Save API key
						if err := saveApiKey(apiKey); err != nil {
							fmt.Printf("Failed to save API key: %v\n", err)
						} else {
							fmt.Println("API key saved successfully!")
						}
						
						// Set the key as environment variable for current session
						os.Setenv("OPENROUTER_API_KEY", apiKey)
					}
					
					// Refresh screen
					return m, tea.ClearScreen
				}

			case "enter":
				// Handle chat message
				if !m.textarea.Focused() || m.waiting {
					return m, nil
				}

				userInput := strings.TrimSpace(m.textarea.Value())
				if userInput == "" {
					return m, nil
				}

				// Special command for API key
				if strings.HasPrefix(userInput, "/key ") {
					apiKey := strings.TrimPrefix(userInput, "/key ")
					m.apiKey = apiKey
					
					// Save API key
					if err := saveApiKey(apiKey); err != nil {
						m.err = fmt.Errorf("failed to save API key: %v", err)
					}
					
					// Set the key as environment variable for current session
					os.Setenv("OPENROUTER_API_KEY", apiKey)
					
					// Clear textarea
					m.textarea.Reset()
					return m, nil
				}

				// Process user message (check for images, etc.)
				userMessage := processMultiModalMessage(userInput)
				m.messages = append(m.messages, userMessage)
				
				// Update content with new message
				content := m.renderMessages()
				m.viewport.SetContent(content)
				m.viewport.GotoBottom()
				
				// Reset and enter waiting state
				m.textarea.Reset()
				m.waiting = true
				m.streaming = true
				m.streamContent = ""
				m.lastRefresh = time.Now() // Initialize the timer when starting to wait
				
				// Submit to API
				return m, tea.Batch(
					m.spinner.Tick,
					submitMessage(m.apiKey, m.selectedModel, m.messages),
					timeoutCheckerTick(),
				)

			case "pgup":
				// In chat view, scroll viewport up
				m.viewport.LineUp(10)
				return m, nil
				
			case "pgdown":
				// In chat view, scroll viewport down
				m.viewport.LineDown(10)
				return m, nil
				
			default:
				// Process normally for chat mode
				m.textarea, cmd = m.textarea.Update(msg)
				cmds = append(cmds, cmd)
			}
		}

	case streamRefreshTickMsg:
		if m.streaming {
			// If we are streaming and it's time for a refresh, update the UI
			if time.Since(m.lastRefresh) > 100*time.Millisecond {
				m.lastRefresh = time.Now()
				
				// Create temporary messages with current stream content
				tempMessages := append([]Message{}, m.messages...)
				tempMessages = append(tempMessages, Message{
					Role:    "assistant",
					Content: m.streamContent,
				})
				
				// Render the messages and update the viewport
				content := m.renderMessagesWithTemp(tempMessages)
				m.viewport.SetContent(content)
				m.viewport.GotoBottom()
			}
			
			// Always set up the next tick when streaming
			return m, streamRefreshTick()
		}
		
		// If we're not streaming, still set up the next tick but less frequently
		return m, tea.Tick(time.Millisecond*500, func(t time.Time) tea.Msg {
			return streamRefreshTickMsg(t)
		})

	case StreamUpdate:
		if m.streaming {
			// Update the stream content
			m.streamContent = msg.Content
			m.lastRefresh = time.Now()
			
			// Create temporary messages
			tempMessages := append([]Message{}, m.messages...)
			tempMessages = append(tempMessages, Message{
				Role:    "assistant",
				Content: m.streamContent,
			})
			
			// Update the viewport
			content := m.renderMessagesWithTemp(tempMessages)
			m.viewport.SetContent(content)
			m.viewport.GotoBottom()
			
			return m, nil
		}
		return m, nil

	case ResponseReceived:
		m.waiting = false
		m.streaming = false
		
		// Add the response to messages
		m.messages = append(m.messages, Message{
			Role:    "assistant",
			Content: msg.Content,
		})
		
		// Update content
		content := m.renderMessages()
		m.viewport.SetContent(content)
		
		// Scroll to bottom
		m.viewport.GotoBottom()
		return m, nil

	case TokensInfo:
		m.tokens = msg
		
		// Update content to show token info
		content := m.renderMessages()
		m.viewport.SetContent(content)
		
		return m, nil

	case []string:
		// Update available models
		m.availableModels = msg
		
		// Update filtered models
		m.filteredModels = fuzzyFilter(m.searchQuery, m.availableModels)
		
		// Make sure selectedModelIndex is within bounds
		if m.selectedModelIndex >= len(m.filteredModels) {
			m.selectedModelIndex = len(m.filteredModels) - 1
		}
		if m.selectedModelIndex < 0 && len(m.filteredModels) > 0 {
			m.selectedModelIndex = 0
		}
		
		// Find the index of the current model if not set
		if m.selectedModel != "" && m.searchQuery == "" {
			foundCurrentModel := false
			for i, model := range m.filteredModels {
				if model == m.selectedModel {
					m.selectedModelIndex = i
					foundCurrentModel = true
					break
				}
			}
			
			// If we didn't find the current model in the list, reset to first model
			if !foundCurrentModel && len(m.filteredModels) > 0 {
				m.selectedModel = m.filteredModels[0]
				m.selectedModelIndex = 0
			}
		}
		
		// Render model picker with the new function
		content := renderModelPicker(m)
		m.viewport.SetContent(content)
		
		// Ensure the selected model is visible
		if m.selectedModelIndex >= 0 && m.selectedModelIndex < len(m.filteredModels) {
			// Calculate where the selected model is in the viewport
			headerLines := 4 // Adjust based on your header size
			selectedLine := headerLines + m.selectedModelIndex
			
			// If it's outside the visible area, adjust the viewport
			if selectedLine < m.viewport.YOffset {
				m.viewport.SetYOffset(selectedLine)
			} else if selectedLine >= m.viewport.YOffset + m.viewport.Height {
				m.viewport.SetYOffset(selectedLine - m.viewport.Height + 1)
			}
		}
		
		return m, nil

	case error:
		m.err = msg
		m.waiting = false
		m.streaming = false
		
		// Log error for debugging
		fmt.Printf("Error occurred: %v\n", m.err)
		
		// Show error in the viewport
		content := m.renderMessages()
		m.viewport.SetContent(content)
		
		// Add error to chat history for visibility
		m.messages = append(m.messages, Message{
			Role:    "system",
			Content: fmt.Sprintf("Error: %s", m.err.Error()),
		})
		
		// Update content with the error message included
		content = m.renderMessages()
		m.viewport.SetContent(content)
		m.viewport.GotoBottom()
		
		return m, nil

	case timeoutCheckerTickMsg:
		if m.waiting && m.err == nil {
			// If we've been waiting for more than 90 seconds, consider it a timeout
			if m.lastRefresh.IsZero() {
				m.lastRefresh = time.Now()
			} else if time.Since(m.lastRefresh) > 90*time.Second {
				m.waiting = false
				m.streaming = false
				m.err = fmt.Errorf("Request timed out. The API didn't respond in a reasonable time.")
				
				// Show error in the viewport
				content := m.renderMessages()
				m.viewport.SetContent(content)
				
				// Add error to chat history for visibility
				m.messages = append(m.messages, Message{
					Role:    "system",
					Content: "Error: Request timed out. The API didn't respond in a reasonable time.",
				})
				
				// Reset the timer
				m.lastRefresh = time.Time{}
				
				return m, nil
			}
		} else {
			// Reset the timer when not waiting
			m.lastRefresh = time.Time{}
		}
		
		// Always check again after some time
		return m, timeoutCheckerTick()

	case spinner.TickMsg:
		if m.waiting {
			m.spinner, cmd = m.spinner.Update(msg)
			return m, m.spinner.Tick
		}

	case tea.WindowSizeMsg:
		// Adjust viewport and textarea sizes
		verticalMargins := 6 // For header and footer
		m.viewport.Width = msg.Width
		m.viewport.Height = msg.Height - verticalMargins - 3 // Subtract textarea height
		m.textarea.SetWidth(msg.Width - 2)
		
		// Update content with new dimensions
		if m.showModelPicker {
			// Refresh model picker view
			content := renderModelPicker(m)
			m.viewport.SetContent(content)
		} else {
			// Refresh chat view
			content := m.renderMessages()
			m.viewport.SetContent(content)
		}
	}

	// Handle textarea and viewport updates
	if !m.showModelPicker {
		m.viewport, cmd = m.viewport.Update(msg)
		cmds = append(cmds, cmd)
	} else {
		// For model picker, only handle viewport updates
		m.viewport, cmd = m.viewport.Update(msg)
		cmds = append(cmds, cmd)
	}

	return m, tea.Batch(cmds...)
}

// Render messages for display
func (m chatModel) renderMessages() string {
	var content strings.Builder
	
	// Add header with model info
	content.WriteString(m.modelStyle.Render(fmt.Sprintf("Using model: %s", m.selectedModel)) + "\n\n")
	
	if len(m.messages) <= 1 && m.messages[0].Role == "system" {
		// Only system message, so show help text
		content.WriteString(m.helpStyle.Render("Type a message to start the conversation.\n"))
		content.WriteString(m.helpStyle.Render("Ctrl+F to select a model, Ctrl+S to set API key, Ctrl+K to clear chat history.\n"))
		content.WriteString(m.helpStyle.Render("You can include images by adding 'image:' followed by the path to the image.\n"))
	} else {
		// Skip the first message if it's a system message when rendering
		startIdx := 0
		if len(m.messages) > 0 && m.messages[0].Role == "system" {
			startIdx = 1
		}
		
		for i := startIdx; i < len(m.messages); i++ {
			message := m.messages[i]
			
			switch message.Role {
			case "user":
				// Add extra spacing before messages (except the first one)
				if i > startIdx {
					content.WriteString("\n")
				}
				content.WriteString(m.userStyle.Render("You: "))
				content.WriteString("\n" + message.Content + "\n")
			case "assistant":
				// Add spacing between messages
				content.WriteString("\n")
				content.WriteString(m.responseStyle.Render("AI: "))
				content.WriteString("\n")
				
				// Render response with markdown formatting
				r, _ := glamour.NewTermRenderer(
					glamour.WithAutoStyle(),
					glamour.WithWordWrap(m.viewport.Width),
				)
				
				rendered, err := r.Render(message.Content)
				if err != nil {
					content.WriteString(message.Content + "\n")
				} else {
					// Trim extra newlines from the rendered content
					rendered = strings.TrimSpace(rendered)
					content.WriteString(rendered + "\n")
				}
			case "system":
				// Only show system messages that aren't the initial one
				if i > 0 {
					// Add spacing and highlight system messages
					content.WriteString("\n")
					content.WriteString(m.systemStyle.Render("System: "))
					content.WriteString("\n")
					content.WriteString(m.systemStyle.Render(message.Content) + "\n")
				}
			}
		}
	}
	
	// Add token count if available
	if m.tokens.Total > 0 {
		content.WriteString("\n" + m.tokensStyle.Render(fmt.Sprintf("Tokens: %d prompt + %d completion = %d total", 
			m.tokens.Prompt, m.tokens.Completion, m.tokens.Total)))
	}
	
	return content.String()
}

// Enhanced renderMessagesWithTemp function with animated cursor for streaming
func (m chatModel) renderMessagesWithTemp(messages []Message) string {
	var content strings.Builder
	
	// Add header with model info
	content.WriteString(m.modelStyle.Render(fmt.Sprintf("Using model: %s", m.selectedModel)) + "\n\n")
	
	// Skip the first message if it's a system message when rendering
	startIdx := 0
	if len(messages) > 0 && messages[0].Role == "system" {
		startIdx = 1
	}
	
	for i := startIdx; i < len(messages); i++ {
		message := messages[i]
		
		switch message.Role {
		case "user":
			// Add extra spacing before messages (except the first one)
			if i > startIdx {
				content.WriteString("\n")
			}
			content.WriteString(m.userStyle.Render("You: "))
			content.WriteString("\n" + message.Content + "\n")
		case "assistant":
			// Add spacing between messages
			content.WriteString("\n")
			content.WriteString(m.responseStyle.Render("AI: "))
			content.WriteString("\n")
			
			// For the last message that's streaming, add typing cursor
			if i == len(messages)-1 && m.streaming {
				// Use a bright style to make the streaming content stand out
				streamStyle := lipgloss.NewStyle().
					Foreground(lipgloss.Color("#83AAFF"))
				
				// Get a cursor emoji that cycles based on time
				// Use different emoji sets based on the selected model
				var typingCursors []string
				if strings.Contains(m.selectedModel, "claude") {
					typingCursors = []string{"✨", "💫", "✨", "🔮", "✨", "💫"}
				} else if strings.Contains(m.selectedModel, "gemini") {
					typingCursors = []string{"🌈", "✨", "🌟", "✨", "🌈", "✨"}
				} else if strings.Contains(m.selectedModel, "gpt") {
					typingCursors = []string{"🤖", "✨", "💬", "✨", "🤖", "✨"}
				} else if strings.Contains(m.selectedModel, "llama") {
					typingCursors = []string{"🦙", "✨", "🦙", "✨", "🦙", "✨"}
				} else if strings.Contains(m.selectedModel, "mistral") {
					typingCursors = []string{"🌬️", "✨", "❄️", "✨", "🌬️", "✨"}
				} else {
					typingCursors = []string{"✨", "💫", "✨", "💫", "✨", "💫"}
				}
				
				// Cycle the cursor faster for a more visible animation
				cursorIndex := int(time.Now().UnixNano()/150000000) % len(typingCursors)
				cursor := typingCursors[cursorIndex]
				
				// Make sure we have content to display
				if len(message.Content) > 0 {
					content.WriteString(streamStyle.Render(message.Content + " " + cursor))
				} else {
					// Show a thinking animation with dots and emoji
					dots := strings.Repeat(".", (cursorIndex % 3) + 1)
					content.WriteString(streamStyle.Render("Thinking" + dots + " " + cursor))
				}
			} else {
				// Render response with markdown formatting
				r, _ := glamour.NewTermRenderer(
					glamour.WithAutoStyle(),
					glamour.WithWordWrap(m.viewport.Width),
				)
				
				rendered, err := r.Render(message.Content)
				if err != nil {
					content.WriteString(message.Content)
				} else {
					// Trim extra newlines from the rendered content
					rendered = strings.TrimSpace(rendered)
					content.WriteString(rendered)
				}
			}
		case "system":
			// Only show system messages that aren't the initial one
			if i > 0 {
				// Add spacing and highlight system messages
				content.WriteString("\n")
				content.WriteString(m.systemStyle.Render("System: "))
				content.WriteString("\n")
				content.WriteString(m.systemStyle.Render(message.Content) + "\n")
			}
		}
	}
	
	return content.String()
}

func (m chatModel) View() string {
	// If model picker is active, handle it differently
	if m.showModelPicker {
		modeHelp := ""
		if m.searchMode {
			modeHelp = m.helpStyle.Render("INPUT MODE • ESC: Exit Search • Type to filter models • ↑/↓: Navigate • PgUp/PgDn: Jump • Enter: Select")
		} else {
			modeHelp = m.helpStyle.Render("NORMAL MODE • i or /: Enter Search • ↑/↓ or j/k: Navigate • PgUp/PgDn: Jump • Enter: Select • ESC: Close")
		}
		return m.viewport.View() + "\n\n" + modeHelp
	}

	// For regular chat view
	if m.waiting && !m.streaming {
		spinnerView := fmt.Sprintf("\n\n%s Thinking...", m.spinner.View())
		return fmt.Sprintf(
			"%s\n\n%s\n\n%s",
			m.viewport.View(),
			spinnerView,
			m.textarea.View(),
		)
	}

	// Show error if any - make it more prominent
	errorView := ""
	if m.err != nil {
		errorStyle := lipgloss.NewStyle().
			Foreground(lipgloss.Color("#FF5555")).
			Background(lipgloss.Color("#330000")).
			Bold(true).
			Padding(1).
			MarginTop(1).
			MarginBottom(1).
			BorderStyle(lipgloss.RoundedBorder()).
			BorderForeground(lipgloss.Color("#FF5555"))
		
		errorView = "\n" + errorStyle.Render(fmt.Sprintf("ERROR: %s", m.err.Error()))
	}

	// Bottom helptext
	helpText := m.helpStyle.Render("Ctrl+F: Change Model • Ctrl+S: Set API Key • Ctrl+K: Clear Chat • PgUp/PgDn: Scroll • Ctrl+C: Quit")

	return fmt.Sprintf(
		"%s\n\n%s\n%s\n\n%s",
		m.viewport.View(),
		errorView,
		m.textarea.View(),
		helpText,
	)
}

// Run the chat interface
func runChatInterface() {
	// Check if API key is set
	apiKey := os.Getenv("OPENROUTER_API_KEY")
	if apiKey == "" {
		// Try to read from config file
		homeDir, err := os.UserHomeDir()
		configDir := ""
		configFile := ""
		
		if err == nil {
			configDir = filepath.Join(homeDir, ".luke")
			configFile = filepath.Join(configDir, "config.json")
			
			if _, err := os.Stat(configFile); err == nil {
				data, err := ioutil.ReadFile(configFile)
				if err == nil {
					var config map[string]string
					if err := json.Unmarshal(data, &config); err == nil {
						apiKey = config["openrouter_api_key"]
					}
				}
			}
		}
		
		// If still no API key, prompt for it
		if apiKey == "" {
			fmt.Println("OpenRouter API key is required for chat functionality.")
			fmt.Println("Get your free API key at: https://openrouter.ai/")
			fmt.Print("Enter your OpenRouter API key: ")
			
			// Read API key from stdin
			reader := bufio.NewReader(os.Stdin)
			apiKey, _ = reader.ReadString('\n')
			apiKey = strings.TrimSpace(apiKey)
			
			if apiKey != "" {
				// Ensure config directory exists
				if configDir != "" {
					if _, err := os.Stat(configDir); os.IsNotExist(err) {
						os.MkdirAll(configDir, 0700)
					}
					
					// Save API key
					if configFile != "" {
						config := map[string]string{
							"openrouter_api_key": apiKey,
						}
						
						data, err := json.MarshalIndent(config, "", "  ")
						if err == nil {
							err = ioutil.WriteFile(configFile, data, 0600)
							if err == nil {
								fmt.Println("✅ API key saved successfully!")
							} else {
								fmt.Printf("⚠️ Failed to save API key: %v\n", err)
							}
						}
					}
				}
				
				// Set environment variable for current session
				os.Setenv("OPENROUTER_API_KEY", apiKey)
			} else {
				fmt.Println("⚠️ No API key provided. The chat will have limited functionality.")
				fmt.Println("You can set your API key later using Ctrl+S during chat or with the /key command.")
			}
			
			// Give the user a moment to read the messages
			fmt.Println("\nPress Enter to continue to the chat interface...")
			reader.ReadString('\n')
		}
	}
	
	// Start the chat interface
	p := tea.NewProgram(initialChatModel(), tea.WithAltScreen())
	if _, err := p.Run(); err != nil {
		fmt.Printf("Error running chat interface: %v", err)
		os.Exit(1)
	}
}

// Add a max function since Go doesn't have one built-in
func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

// Only define min if it's not already defined elsewhere
// func min(a, b int) int {
// 	if a < b {
// 		return a
// 	}
// 	return b
// }

// Add a helper function to get map keys for debugging
func getMapKeys(m map[string]interface{}) []string {
	keys := make([]string, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	return keys
} 