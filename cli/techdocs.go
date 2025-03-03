package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"math/rand"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
	"time"

	"github.com/charmbracelet/bubbles/spinner"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/glamour"
	"github.com/charmbracelet/lipgloss"
	"luke/cli/api"
)

// Messages
type TechDocsUpdated struct {
	TechMd  string
	Stacks  map[string]StackInfo
}

type StackInfo struct {
	LastUpdated time.Time
}

type TechDocsUpdateFailed struct {
	Error string
}

type MarkdownRendered struct {
	Content string
}

// TechDocsResult is the final result of fetching tech docs
type TechDocsResult struct {
	Content string
}

// Tech docs model
type techDocsModel struct {
	spinner    spinner.Model
	updating   bool
	updated    bool
	techMd     string
	stacks     map[string]StackInfo
	err        error
	rendered   string
	statusText string
}

func initialTechDocsModel() techDocsModel {
	// Setup spinner
	s := spinner.New()
	s.Spinner = spinner.Dot
	s.Style = lipgloss.NewStyle().Foreground(lipgloss.Color("#9A348E"))

	return techDocsModel{
		spinner:    s,
		updating:   true,
		updated:    false,
		statusText: "🔄 updating tech documentation...",
	}
}

func (m techDocsModel) Init() tea.Cmd {
	return tea.Batch(
		m.spinner.Tick,
		updateTechDocs(),
	)
}

// Command to update tech docs
func updateTechDocs() tea.Cmd {
	return func() tea.Msg {
		// Determine base URL for Luke API
		baseURL := os.Getenv("LUKE_API_URL")
		if baseURL == "" {
			baseURL = "http://localhost:3000"
		}

		// First try the Luke API
		lukeApiSuccess := false
		var techData struct {
			TechMd       string                `json:"techMd"`
			Relationships map[string][]string  `json:"relationships"`
			Stacks       map[string]StackInfo  `json:"stacks"`
		}

		resp, err := http.Get(baseURL + "/api/tech")
		if err == nil {
			defer resp.Body.Close()
			
			if resp.StatusCode == http.StatusOK {
				if err := json.NewDecoder(resp.Body).Decode(&techData); err == nil {
					lukeApiSuccess = true
				}
			}
		}

		// If Luke API failed, use Jina API directly
		if !lukeApiSuccess {
			fmt.Println("🔄 Luke API unavailable, using Jina APIs directly...")
			techData, err = updateTechDocsWithJina()
			if err != nil {
				return TechDocsUpdateFailed{Error: fmt.Sprintf("Jina API error: %s", err.Error())}
			}
		}

		return TechDocsUpdated{
			TechMd: techData.TechMd,
			Stacks: techData.Stacks,
		}
	}
}

// Upload file to Vercel Blob storage
func uploadToVercelBlob(baseURL, filename string, content []byte) (string, error) {
	// Get Vercel Blob token from environment variable or config file
	blobToken := os.Getenv("VERCEL_BLOB_TOKEN")
	
	// Try the LUKE_VERCEL_BLOB_TOKEN as well
	if blobToken == "" {
		blobToken = os.Getenv("LUKE_VERCEL_BLOB_TOKEN")
	}
	
	// Try the BLOB_READ_WRITE_TOKEN as well
	if blobToken == "" {
		blobToken = os.Getenv("BLOB_READ_WRITE_TOKEN")
	}
	
	// If token not in env var, try to read from config file
	if blobToken == "" {
		homeDir, err := os.UserHomeDir()
		if err == nil {
			configDir := filepath.Join(homeDir, ".luke")
			configFile := filepath.Join(configDir, "config.json")
			
			if _, err := os.Stat(configFile); err == nil {
				data, err := ioutil.ReadFile(configFile)
				if err == nil {
					var config map[string]string
					if err := json.Unmarshal(data, &config); err == nil {
						// Try all possible token keys
						blobToken = config["vercel_blob_token"]
						if blobToken == "" {
							blobToken = config["luke_vercel_blob_token"]
						}
						if blobToken == "" {
							blobToken = config["blob_read_write_token"]
						}
					}
				}
			}
		}
	}
	
	// Still no token found, let user know how to set it up
	if blobToken == "" {
		return "", fmt.Errorf("no blob token found. Set VERCEL_BLOB_TOKEN, LUKE_VERCEL_BLOB_TOKEN, or BLOB_READ_WRITE_TOKEN environment variable or add to ~/.luke/config.json")
	}

	// Prepare the multipart form data
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	
	// Add the filename field
	if err := writer.WriteField("filename", filename); err != nil {
		return "", fmt.Errorf("error writing filename field: %w", err)
	}
	
	// Create a form file for the content
	part, err := writer.CreateFormFile("file", filename)
	if err != nil {
		return "", fmt.Errorf("error creating form file: %w", err)
	}
	
	// Write the content to the form file
	if _, err := part.Write(content); err != nil {
		return "", fmt.Errorf("error writing content to form file: %w", err)
	}
	
	// Close the writer
	if err := writer.Close(); err != nil {
		return "", fmt.Errorf("error closing multipart writer: %w", err)
	}
	
	// Create the request to the Vercel Blob API endpoint
	req, err := http.NewRequest("POST", baseURL+"/api/blob", body)
	if err != nil {
		return "", fmt.Errorf("error creating request: %w", err)
	}
	
	// Set the content type to the multipart form data
	req.Header.Set("Content-Type", writer.FormDataContentType())
	
	// Add authorization header with token
	req.Header.Set("Authorization", "Bearer "+blobToken)
	
	// Send the request
	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("error sending request: %w", err)
	}
	defer resp.Body.Close()
	
	// Check the response status
	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		bodyPreview := string(bodyBytes)
		if len(bodyPreview) > 100 {
			bodyPreview = bodyPreview[:100] + "..."
		}
		return "", fmt.Errorf("error from blob API (status %d): %s", resp.StatusCode, bodyPreview)
	}
	
	// Parse the response to get the URL
	var blobResponse struct {
		URL string `json:"url"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&blobResponse); err != nil {
		return "", fmt.Errorf("error parsing response: %w", err)
	}
	
	return blobResponse.URL, nil
}

// Use Jina APIs to update tech documentation
func updateTechDocsWithJina() (struct {
	TechMd       string                `json:"techMd"`
	Relationships map[string][]string  `json:"relationships"`
	Stacks       map[string]StackInfo  `json:"stacks"`
}, error) {
	var result struct {
		TechMd       string                `json:"techMd"`
		Relationships map[string][]string  `json:"relationships"`
		Stacks       map[string]StackInfo  `json:"stacks"`
	}

	// Set up the stacks
	stacks := []string{"next", "apple", "cli", "other"}
	stackInfo := make(map[string]StackInfo)
	relationships := make(map[string][]string)
	
	// Determine base URL for Luke API (needed for Blob storage)
	baseURL := os.Getenv("LUKE_API_URL")
	if baseURL == "" {
		baseURL = "http://localhost:3000"
	}

	// Generate main tech.md content
	mainContent := "# Technology Stack Guide 2024\n\n> Comprehensive guide to modern development technologies across different platforms.\n\n"

	// Create docs directory if it doesn't exist
	localDocsPath := "docs"
	if _, err := os.Stat(localDocsPath); os.IsNotExist(err) {
		// Try one level up if the immediate docs doesn't exist
		localDocsPath = "../docs"
		if _, err := os.Stat(localDocsPath); os.IsNotExist(err) {
			// Create docs directory
			if err := os.MkdirAll(localDocsPath, 0755); err != nil {
				fmt.Printf("⚠️ warning: error creating docs directory: %s\n", err)
			}
		}
	}

	// Process each tech stack
	for _, stack := range stacks {
		fmt.Printf("🔍 searching for %s documentation...\n", stack)
		
		// Use Jina Search API to find documentation about the tech stack
		query := fmt.Sprintf("%s technology stack guide 2024", stack)
		stackContent, stackRels, err := searchForTechContent(query, stack)
		if err != nil {
			fmt.Printf("⚠️ warning: error fetching %s documentation: %s\n", stack, err)
			continue
		}

		// Add to relationships map
		for tech, related := range stackRels {
			relationships[tech] = related
		}

		// Save the content to local file first
		stackFileName := fmt.Sprintf("tech-%s.md", stack)
		stackFilePath := filepath.Join(localDocsPath, stackFileName)
		if err := os.WriteFile(stackFilePath, []byte(stackContent), 0644); err != nil {
			fmt.Printf("⚠️ warning: error writing local file %s: %s\n", stackFilePath, err)
		} else {
			fmt.Printf("✅ saved %s to local file: %s\n", stackFileName, stackFilePath)
		}

		// Try uploading to Vercel Blob (but don't fail if it doesn't work)
		fmt.Printf("📤 trying to upload %s to vercel blob...\n", stackFileName)
		stackFileURL, err := uploadToVercelBlob(baseURL, stackFileName, []byte(stackContent))
		if err != nil {
			fmt.Printf("ℹ️ blob storage not used: %s\n", err)
		} else {
			fmt.Printf("✅ also uploaded %s to blob: %s\n", stackFileName, stackFileURL)
		}

		// Add to main content
		mainContent += fmt.Sprintf("\n## %s\n\n%s\n\n---\n\n", 
			strings.ToUpper(stack[:1]) + stack[1:], 
			strings.Join(strings.Split(stackContent, "\n")[2:], "\n"))
		
		// Add to stacks info
		stackInfo[stack] = StackInfo{
			LastUpdated: time.Now(),
		}
	}

	// Save main tech.md file locally
	mainFilePath := filepath.Join(localDocsPath, "tech.md")
	if err := os.WriteFile(mainFilePath, []byte(mainContent), 0644); err != nil {
		fmt.Printf("⚠️ warning: error writing main tech.md file: %s\n", err)
	} else {
		fmt.Printf("✅ saved tech.md to local file: %s\n", mainFilePath)
	}

	// Try to upload main tech.md file to Vercel Blob
	fmt.Printf("📤 trying to upload main tech.md to vercel blob...\n")
	mainFileURL, err := uploadToVercelBlob(baseURL, "tech.md", []byte(mainContent))
	if err != nil {
		fmt.Printf("ℹ️ blob storage not used for main file: %s\n", err)
	} else {
		fmt.Printf("✅ also uploaded tech.md to blob: %s\n", mainFileURL)
	}

	// Set up result
	result.TechMd = mainContent
	result.Relationships = relationships
	result.Stacks = stackInfo

	return result, nil
}

// Search for tech documentation using Jina API
func searchForTechContent(query, techName string) (string, map[string][]string, error) {
	// Define headers
	headers := map[string]string{
		"Content-Type": "application/json",
		"Accept": "application/json",
	}

	// Prepare the search request
	searchBody := map[string]interface{}{
		"q": query,
		"options": "Markdown",
	}
	searchJSON, _ := json.Marshal(searchBody)

	// Create the HTTP client
	client := &http.Client{
		Timeout: time.Second * 30,
	}

	// Make the search request
	searchReq, err := http.NewRequest("POST", "https://s.jina.ai/", bytes.NewBuffer(searchJSON))
	if err != nil {
		return "", nil, fmt.Errorf("error creating search request: %w", err)
	}

	// Add headers
	for key, value := range headers {
		searchReq.Header.Add(key, value)
	}

	// Execute the search request
	searchResp, err := client.Do(searchReq)
	if err != nil {
		return "", nil, fmt.Errorf("error executing search request: %w", err)
	}
	defer searchResp.Body.Close()

	// Read and parse search results
	searchRespBody, err := io.ReadAll(searchResp.Body)
	if err != nil {
		return "", nil, fmt.Errorf("error reading search response: %w", err)
	}

	var searchResult struct {
		Code   int `json:"code"`
		Status int `json:"status"`
		Data   []struct {
			Title       string `json:"title"`
			Description string `json:"description"`
			URL         string `json:"url"`
			Content     string `json:"content"`
		} `json:"data"`
	}

	if err := json.Unmarshal(searchRespBody, &searchResult); err != nil {
		return "", nil, fmt.Errorf("error parsing search response: %w", err)
	}

	// Extract technologies and build relationships
	techRelationships := make(map[string][]string)
	
	// Build content from search results
	var content strings.Builder
	content.WriteString(fmt.Sprintf("# %s Technology Stack\n\n", strings.ToUpper(techName[:1]) + techName[1:]))
	
	// Get current date
	currentTime := time.Now().Format("January 2, 2006")
	content.WriteString(fmt.Sprintf("> Generated documentation for %s technologies. Last updated on %s.\n\n", 
		techName, currentTime))

	// Extract content from top results
	if len(searchResult.Data) > 0 {
		// Extract technologies by regex pattern
		techPattern := regexp.MustCompile(`\b([A-Za-z0-9.]+(?:[A-Za-z0-9-]*[A-Za-z0-9]+)?\.?[A-Za-z0-9]*)\b`)
		
		// Build technologies section
		technologies := make(map[string]bool)
		
		// Parse tech names from content
		for _, result := range searchResult.Data[:min(3, len(searchResult.Data))] {
			content.WriteString(fmt.Sprintf("## From %s\n\n", result.Title))
			
			// Limit content length
			truncatedContent := result.Content
			if len(truncatedContent) > 2000 {
				truncatedContent = truncatedContent[:2000] + "..."
			}
			
			content.WriteString(truncatedContent + "\n\n")
			
			// Extract technologies
			matches := techPattern.FindAllString(result.Content, -1)
			for _, match := range matches {
				// Filter out common words and numbers
				if len(match) > 2 && !isCommonWord(match) {
					technologies[match] = true
				}
			}
		}
		
		// Add technologies list
		content.WriteString("## Key Technologies\n\n")
		
		techList := make([]string, 0, len(technologies))
		for tech := range technologies {
			techList = append(techList, tech)
		}
		sort.Strings(techList)
		
		for _, tech := range techList {
			content.WriteString(fmt.Sprintf("- %s\n", tech))
		}
		
		// Build relationships
		for _, tech := range techList {
			// Find related technologies
			related := findRelatedTechs(tech, techList, 5)
			techRelationships[tech] = related
		}
	} else {
		content.WriteString("No documentation found for this technology stack.\n")
	}

	return content.String(), techRelationships, nil
}

// Find min of two ints
func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

// Check if a word is common and should be excluded
func isCommonWord(word string) bool {
	commonWords := map[string]bool{
		"the": true, "and": true, "for": true, "with": true, "this": true,
		"that": true, "from": true, "com": true, "org": true, "net": true,
		"http": true, "https": true, "html": true, "www": true, "web": true,
	}
	
	return commonWords[strings.ToLower(word)]
}

// Find related technologies based on simple similarity
func findRelatedTechs(tech string, allTechs []string, maxRelated int) []string {
	related := make([]string, 0, maxRelated)
	tech = strings.ToLower(tech)
	
	// Simple heuristic: technologies with similar names or common prefixes/suffixes
	for _, other := range allTechs {
		otherLower := strings.ToLower(other)
		
		// Skip self
		if otherLower == tech {
			continue
		}
		
		// Check for prefix/suffix match
		if strings.HasPrefix(otherLower, tech) || strings.HasPrefix(tech, otherLower) ||
		   strings.HasSuffix(otherLower, tech) || strings.HasSuffix(tech, otherLower) {
			related = append(related, other)
			if len(related) >= maxRelated {
				break
			}
		}
	}
	
	// Fill with random techs if not enough related ones
	if len(related) < maxRelated {
		shuffle(allTechs)
		for _, other := range allTechs {
			otherLower := strings.ToLower(other)
			if otherLower != tech && !contains(related, other) {
				related = append(related, other)
				if len(related) >= maxRelated {
					break
				}
			}
		}
	}
	
	return related
}

// Check if a slice contains a string
func contains(slice []string, str string) bool {
	for _, item := range slice {
		if item == str {
			return true
		}
	}
	return false
}

// Shuffle a slice
func shuffle(slice []string) {
	rand.Seed(time.Now().UnixNano())
	rand.Shuffle(len(slice), func(i, j int) {
		slice[i], slice[j] = slice[j], slice[i]
	})
}

func (m techDocsModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	var cmd tea.Cmd
	var cmds []tea.Cmd

	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch msg.String() {
		case "ctrl+c", "q", "esc":
			return m, tea.Quit
		}

	case TechDocsUpdated:
		m.updating = false
		m.updated = true
		m.techMd = msg.TechMd
		m.stacks = msg.Stacks
		return m, renderMarkdown(m.techMd)

	case TechDocsUpdateFailed:
		m.updating = false
		m.updated = false
		m.err = fmt.Errorf(msg.Error)
		return m, nil

	case MarkdownRendered:
		m.rendered = msg.Content
		return m, nil

	case spinner.TickMsg:
		if m.updating {
			m.spinner, cmd = m.spinner.Update(msg)
			cmds = append(cmds, cmd)
		}
	}

	return m, tea.Batch(cmds...)
}

func (m techDocsModel) View() string {
	if m.err != nil {
		return fmt.Sprintf("❌ error: %s\n\npress any key to exit.", m.err.Error())
	}

	if m.updating {
		return fmt.Sprintf(
			"%s\n\n%s",
			m.statusText,
			m.spinner.View(),
		)
	}

	if m.updated && m.rendered != "" {
		stackInfo := "🧩 tech stack information:\n"
		for name, info := range m.stacks {
			stackInfo += fmt.Sprintf("- %s: updated %s\n", name, 
				info.LastUpdated.Format("Jan 02, 2006 15:04:05"))
		}
		
		// Add information about the storage location
		storageInfo := "📦 documentation storage: Vercel Blob (cloud)\n"
		storageInfo += "📝 access documentation anywhere using the web UI\n"
		
		return fmt.Sprintf(
			"✅ tech documentation updated successfully! 🎉\n\n%s\n%s\n\n%s\n\npress 'q' to exit.",
			stackInfo,
			storageInfo,
			m.rendered,
		)
	}

	return "press 'q' to exit."
}

// Command to render markdown
func renderMarkdown(markdown string) tea.Cmd {
	return func() tea.Msg {
		r, _ := glamour.NewTermRenderer(
			glamour.WithAutoStyle(),
			glamour.WithWordWrap(80),
		)

		rendered, err := r.Render(markdown)
		if err != nil {
			rendered = "❌ error rendering markdown: " + err.Error()
		}

		return MarkdownRendered{Content: rendered}
	}
}

// FetchTechDoc is a command to fetch tech documentation
func FetchTechDoc(techName string) tea.Cmd {
	return func() tea.Msg {
		apiEndpoint := getConfigValue("api_endpoint")
		apiKey := getConfigValue("api_key")
		
		if apiEndpoint == "" {
			return fmt.Errorf("API endpoint not configured. Use 'luke config' to set up.")
		}
		
		client := api.NewAPIClient(apiEndpoint, apiKey)
		content, err := client.FetchTechDocumentation(techName)
		if err != nil {
			return fmt.Errorf("Failed to fetch tech docs: %v", err)
		}
		
		return TechDocsResult{Content: content}
	}
}

// Run the tech docs viewer
func runTechDocsViewer() {
	fmt.Println("🔍 Tech Documentation Viewer")
	fmt.Println("Enter a technology name to view documentation (or 'q' to quit):")
	
	reader := bufio.NewReader(os.Stdin)
	for {
		fmt.Print("> ")
		input, _ := reader.ReadString('\n')
		input = strings.TrimSpace(input)
		
		if input == "q" || input == "quit" || input == "exit" {
			break
		}
		
		if input == "" {
			continue
		}
		
		// Fetch the documentation
		apiEndpoint := getConfigValue("api_endpoint")
		apiKey := getConfigValue("api_key")
		
		if apiEndpoint == "" {
			fmt.Println("❌ API endpoint not configured. Use 'luke config' to set up.")
			continue
		}
		
		client := api.NewAPIClient(apiEndpoint, apiKey)
		content, err := client.FetchTechDocumentation(input)
		if err != nil {
			fmt.Printf("❌ Failed to fetch tech docs: %v\n", err)
			continue
		}
		
		// Render the markdown
		renderer, _ := glamour.NewTermRenderer(
			glamour.WithAutoStyle(),
			glamour.WithWordWrap(100),
		)
		
		rendered, err := renderer.Render(content)
		if err != nil {
			fmt.Println(content)
		} else {
			fmt.Println(rendered)
		}
		
		fmt.Println("\nPress Enter to continue...")
		reader.ReadString('\n')
	}
}

func runTechDocsUpdate() {
	m := initialTechDocsModel()
	m.statusText = "🔄 updating tech documentation..."
	m.updating = true
	
	p := tea.NewProgram(m)
	if _, err := p.Run(); err != nil {
		fmt.Printf("❌ error updating tech docs: %v", err)
		os.Exit(1)
	}
} 