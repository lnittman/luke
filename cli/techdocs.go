package main

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"github.com/charmbracelet/bubbles/spinner"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/glamour"
	"github.com/charmbracelet/lipgloss"
	"github.com/dustin/go-humanize"
)

// Directory structure constants
const (
	DocsDir     = "docs"
	LukeDir     = "luke"
	ToolsDir    = "tools"
	TemplateDir = "template"
)

// Define styles for the UI - with unique names to avoid conflicts
var (
	docsTitleStyle       = lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("205")).MarginBottom(1)
	docsMainStyle        = lipgloss.NewStyle().Margin(1, 2)
	docsListItemStyle    = lipgloss.NewStyle().PaddingLeft(2)
	docsSelectedItemStyle = lipgloss.NewStyle().PaddingLeft(2).Background(lipgloss.Color("205")).Foreground(lipgloss.Color("#000000"))
	docsErrorStyle       = lipgloss.NewStyle().Foreground(lipgloss.Color("196"))
	docsInfoStyle        = lipgloss.NewStyle().Foreground(lipgloss.Color("86"))
)

// Helper functions
func getProjectDir() string {
	// Try to determine the root directory
	dir, err := os.Getwd()
	if err != nil {
		return ".."
	}

	// Check if we're in the project root or cli directory
	if filepath.Base(dir) == "cli" {
		return filepath.Dir(dir)
	}

	// Check if we're already at the project root (has docs dir)
	docsPath := filepath.Join(dir, "docs")
	if _, err := os.Stat(docsPath); err == nil {
		return dir
	}

	// Default case: assume one level up
	return ".."
}

func getServerURL() string {
	// Try to get from environment or config
	serverURL := os.Getenv("LUKE_SERVER_URL")
	if serverURL != "" {
		return serverURL
	}
	
	// Default development URL
	return "http://localhost:3000"
}

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

// DocItem represents a documentation item in the filesystem or blob storage
type DocItem struct {
	Name        string
	Path        string
	IsDirectory bool
	Size        int64
	LastUpdated time.Time
	Children    []DocItem
}

// Tech docs model
type techDocsModel struct {
	spinner     spinner.Model
	updating    bool
	updated     bool
	techMd      string
	stacks      map[string]StackInfo
	err         error
	rendered    string
	statusText  string
	rootDocs    []DocItem
	selectedDoc string
	viewMode    string // "list" or "content"
	scrollY     int
}

func initialTechDocsModel() techDocsModel {
	// Setup spinner
	s := spinner.New()
	s.Spinner = spinner.Dot
	s.Style = lipgloss.NewStyle().Foreground(lipgloss.Color("205"))

	return techDocsModel{
		spinner:     s,
		updating:    false,
		updated:     false,
		techMd:      "",
		stacks:      make(map[string]StackInfo),
		err:         nil,
		rendered:    "",
		statusText:  "Loading tech documentation...",
		rootDocs:    []DocItem{},
		selectedDoc: "",
		viewMode:    "list",
		scrollY:     0,
	}
}

// Init initializes the techDocsModel
func (m techDocsModel) Init() tea.Cmd {
	return tea.Batch(
		m.spinner.Tick,
		loadDocsStructure(),
	)
}

// loadDocsStructure loads the docs directory structure
func loadDocsStructure() tea.Cmd {
	return func() tea.Msg {
		root := []DocItem{}
		baseDir := filepath.Join(getProjectDir(), DocsDir)
		
		if _, err := os.Stat(baseDir); os.IsNotExist(err) {
			return root
		}

		// Create root categories
		lukeItem := DocItem{
			Name:        "Luke App Documentation",
			Path:        filepath.Join(DocsDir, LukeDir),
			IsDirectory: true,
			Children:    []DocItem{},
		}
		
		toolsItem := DocItem{
			Name:        "Tech & Tools Documentation",
			Path:        filepath.Join(DocsDir, ToolsDir),
			IsDirectory: true,
			Children:    []DocItem{},
		}
		
		templateItem := DocItem{
			Name:        "Project Templates",
			Path:        filepath.Join(DocsDir, TemplateDir),
			IsDirectory: true,
			Children:    []DocItem{},
		}
		
		// Legacy items - files directly under docs/ for backward compatibility
		legacyItem := DocItem{
			Name:        "Legacy Files",
			Path:        DocsDir,
			IsDirectory: true,
			Children:    []DocItem{},
		}

		// Load docs/luke files
		lukeDir := filepath.Join(baseDir, LukeDir)
		if _, err := os.Stat(lukeDir); !os.IsNotExist(err) {
			lukeItem.Children = loadDocsDir(lukeDir, filepath.Join(DocsDir, LukeDir))
		}
		
		// Load docs/tools files
		toolsDir := filepath.Join(baseDir, ToolsDir)
		if _, err := os.Stat(toolsDir); !os.IsNotExist(err) {
			toolsItem.Children = loadDocsDir(toolsDir, filepath.Join(DocsDir, ToolsDir))
		}
		
		// Process template directory - special handling for tech stacks
		templateDir := filepath.Join(baseDir, TemplateDir)
		if _, err := os.Stat(templateDir); !os.IsNotExist(err) {
			entries, err := ioutil.ReadDir(templateDir)
		if err == nil {
				for _, entry := range entries {
					if entry.IsDir() {
						stackItem := DocItem{
							Name:        getCategoryName(entry.Name()) + " Stack",
							Path:        filepath.Join(DocsDir, TemplateDir, entry.Name()),
							IsDirectory: true,
							Children:    loadDocsDir(filepath.Join(templateDir, entry.Name()), filepath.Join(DocsDir, TemplateDir, entry.Name())),
						}
						templateItem.Children = append(templateItem.Children, stackItem)
					}
				}
			}
		}
		
		// Load legacy files (direct under docs/)
		legacyItems := []DocItem{}
		entries, err := ioutil.ReadDir(baseDir)
		if err == nil {
			for _, entry := range entries {
				if !entry.IsDir() {
					// Legacy files
					legacyItems = append(legacyItems, DocItem{
						Name:        entry.Name(),
						Path:        filepath.Join(DocsDir, entry.Name()),
						IsDirectory: false,
						Size:        entry.Size(),
						LastUpdated: entry.ModTime(),
					})
				}
			}
		}
		
		legacyItem.Children = legacyItems
		
		// Only add categories that have content
		if len(lukeItem.Children) > 0 {
			root = append(root, lukeItem)
		}
		
		if len(toolsItem.Children) > 0 {
			root = append(root, toolsItem)
		}
		
		if len(templateItem.Children) > 0 {
			root = append(root, templateItem)
		}
		
		if len(legacyItem.Children) > 0 {
			root = append(root, legacyItem)
		}

		return root
	}
}

// loadDocsDir loads a directory's contents into DocItem structures
func loadDocsDir(dirPath string, relativePath string) []DocItem {
	result := []DocItem{}
	
	if _, err := os.Stat(dirPath); os.IsNotExist(err) {
		return result
	}
	
	entries, err := ioutil.ReadDir(dirPath)
	if err != nil {
		return result
	}
	
	// Process directories first
	dirs := []DocItem{}
	files := []DocItem{}
	
	for _, entry := range entries {
		entryPath := filepath.Join(dirPath, entry.Name())
		relPath := filepath.Join(relativePath, entry.Name())
		
		if entry.IsDir() {
			item := DocItem{
				Name:        entry.Name(),
				Path:        relPath,
				IsDirectory: true,
				Children:    loadDocsDir(entryPath, relPath),
			}
			dirs = append(dirs, item)
		} else {
			item := DocItem{
				Name:        entry.Name(),
				Path:        relPath,
				IsDirectory: false,
				Size:        entry.Size(),
				LastUpdated: entry.ModTime(),
			}
			files = append(files, item)
		}
	}
	
	// Sort directories and files by name
	sort.Slice(dirs, func(i, j int) bool {
		return dirs[i].Name < dirs[j].Name
	})
	
	sort.Slice(files, func(i, j int) bool {
		return files[i].Name < files[j].Name
	})
	
	// Directories first, then files
	result = append(result, dirs...)
	result = append(result, files...)
	
	return result
}

// getCategoryName returns a nice display name for a category
func getCategoryName(dirname string) string {
	switch strings.ToLower(dirname) {
	case "next":
		return "Next.js"
	case "apple":
		return "Apple"
	case "cli":
		return "CLI"
	case "other":
		return "Other"
	default:
		// Capitalize first letter
		if len(dirname) > 0 {
			return strings.ToUpper(dirname[0:1]) + dirname[1:]
		}
		return dirname
	}
}

// updateTechDocs fetches the latest tech documentation
func updateTechDocs() tea.Cmd {
	return func() tea.Msg {
		serverURL := getServerURL()
		endpoint := serverURL + "/api/tech"

		// POST request to trigger update
		client := &http.Client{
			Timeout: 30 * time.Second,
		}

		resp, err := client.Post(endpoint, "application/json", nil)
		if err != nil {
			return TechDocsUpdateFailed{Error: err.Error()}
		}
		defer resp.Body.Close()

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			return TechDocsUpdateFailed{Error: fmt.Sprintf("Failed to read response: %v", err)}
		}

		// Check if response is JSON
		var contentType string
		if contentTypes, ok := resp.Header["Content-Type"]; ok && len(contentTypes) > 0 {
			contentType = contentTypes[0]
		}

		if !strings.Contains(contentType, "application/json") {
			// If HTML or other non-JSON response, handle gracefully
			truncatedResponse := string(body)
			if len(truncatedResponse) > 100 {
				truncatedResponse = truncatedResponse[:100] + "..."
			}
			return TechDocsUpdateFailed{Error: fmt.Sprintf("API returned non-JSON response: %s\nFalling back to local files.", truncatedResponse)}
		}

		// Attempt to decode
		if resp.StatusCode == http.StatusOK {
			var techData struct {
				Success bool `json:"success"`
				Data    struct {
					TechMd       string                `json:"main"`
					Relationships map[string][]string  `json:"relationships"`
					Next         string                `json:"next"`
					Apple        string                `json:"apple"`
					CLI          string                `json:"cli"`
					Other        string                `json:"other"`
		} `json:"data"`
	}

			if err := json.Unmarshal(body, &techData); err != nil {
				return TechDocsUpdateFailed{Error: fmt.Sprintf("Failed to unmarshal JSON: %v", err)}
			}

			// Convert to expected structure
			stacks := make(map[string]StackInfo)
			stacks["next"] = StackInfo{LastUpdated: time.Now()}
			stacks["apple"] = StackInfo{LastUpdated: time.Now()}
			stacks["cli"] = StackInfo{LastUpdated: time.Now()}
			stacks["other"] = StackInfo{LastUpdated: time.Now()}

			return TechDocsUpdated{
				TechMd:  techData.Data.TechMd,
				Stacks:  stacks,
			}
		} else {
			// Try to parse error message from JSON
			var errorData struct {
				Error      string `json:"error"`
				Message    string `json:"message"`
				Fallback   string `json:"fallback"`
				Timestamp  string `json:"timestamp"`
			}

			if err := json.Unmarshal(body, &errorData); err != nil {
				// If can't parse error JSON, show raw response
				return TechDocsUpdateFailed{Error: fmt.Sprintf("API error (Status %d): %s", resp.StatusCode, string(body))}
			}

			return TechDocsUpdateFailed{Error: fmt.Sprintf("API error: %s - %s", errorData.Error, errorData.Message)}
		}
	}
}

// FetchDocContent fetches content of a specific document
func FetchDocContent(docPath string) tea.Cmd {
	return func() tea.Msg {
		// Check if file exists locally first
		fullPath := filepath.Join(getProjectDir(), docPath)
		if _, err := os.Stat(fullPath); err == nil {
			content, err := ioutil.ReadFile(fullPath)
			if err != nil {
				return TechDocsResult{Content: fmt.Sprintf("Error reading file: %v", err)}
			}
			return TechDocsResult{Content: string(content)}
		}
		
		return TechDocsResult{Content: fmt.Sprintf("File not found: %s", docPath)}
	}
}

// renderMarkdown renders markdown content
func renderMarkdown(markdown string) tea.Cmd {
	return func() tea.Msg {
		r, _ := glamour.NewTermRenderer(
			glamour.WithAutoStyle(),
			glamour.WithWordWrap(120),
		)

		out, err := r.Render(markdown)
		if err != nil {
			return MarkdownRendered{Content: fmt.Sprintf("Error rendering markdown: %v", err)}
		}

		return MarkdownRendered{Content: out}
	}
}

// Update handles messages and events for the techDocsModel
func (m techDocsModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch msg.String() {
		case "q", "esc":
			if m.viewMode == "content" {
				// Go back to list view
				m.viewMode = "list"
				m.scrollY = 0
				return m, nil
			}
			return m, tea.Quit
		case "u":
			if !m.updating {
				m.updating = true
				m.statusText = "Updating tech documentation..."
				return m, updateTechDocs()
			}
		case "enter":
			if m.viewMode == "list" && m.selectedDoc != "" {
				// Check if the selected item is a directory
				for _, item := range flattenDocs(m.rootDocs) {
					if item.Path == m.selectedDoc && !item.IsDirectory {
						m.viewMode = "content"
						m.scrollY = 0
						return m, tea.Batch(
							FetchDocContent(m.selectedDoc),
							m.spinner.Tick,
						)
					}
				}
			}
		case "up", "k":
			if m.viewMode == "list" {
				allDocs := flattenDocs(m.rootDocs)
				if len(allDocs) > 0 {
					currentIndex := -1
					for i, doc := range allDocs {
						if doc.Path == m.selectedDoc {
							currentIndex = i
							break
						}
					}

					if currentIndex > 0 {
						m.selectedDoc = allDocs[currentIndex-1].Path
					} else if currentIndex == -1 {
						// Nothing selected yet, select the first item
						m.selectedDoc = allDocs[0].Path
					}
				}
			} else if m.viewMode == "content" {
				if m.scrollY > 0 {
					m.scrollY--
				}
			}
		case "down", "j":
			if m.viewMode == "list" {
				allDocs := flattenDocs(m.rootDocs)
				if len(allDocs) > 0 {
					currentIndex := -1
					for i, doc := range allDocs {
						if doc.Path == m.selectedDoc {
							currentIndex = i
							break
						}
					}

					if currentIndex >= 0 && currentIndex < len(allDocs)-1 {
						m.selectedDoc = allDocs[currentIndex+1].Path
					} else if currentIndex == -1 {
						// Nothing selected yet, select the first item
						m.selectedDoc = allDocs[0].Path
					}
				}
			} else if m.viewMode == "content" {
				m.scrollY++
			}
		}

	case spinner.TickMsg:
		var cmd tea.Cmd
		m.spinner, cmd = m.spinner.Update(msg)
		return m, cmd

	case []DocItem:
		m.rootDocs = msg
		if len(flattenDocs(m.rootDocs)) > 0 && m.selectedDoc == "" {
			// Select the first item by default
			m.selectedDoc = flattenDocs(m.rootDocs)[0].Path
		}
		m.updating = false
		m.statusText = "Select a document to view"
		return m, nil

	case TechDocsUpdated:
		m.techMd = msg.TechMd
		m.stacks = msg.Stacks
		m.updating = false
		m.updated = true
		m.statusText = "Tech documentation updated"
		
		// Reload the docs structure
		return m, loadDocsStructure()

	case TechDocsUpdateFailed:
		m.err = fmt.Errorf(msg.Error)
		m.updating = false
		m.statusText = "Failed to update: " + msg.Error
		return m, nil

	case TechDocsResult:
		// Content fetched, now render it
		return m, renderMarkdown(msg.Content)

	case MarkdownRendered:
		m.rendered = msg.Content
		m.statusText = "Viewing document"
		return m, nil
	}

	return m, nil
}

// flattenDocs flattens the docs structure for easier navigation
func flattenDocs(docs []DocItem) []DocItem {
	result := []DocItem{}
	
	for _, doc := range docs {
		result = append(result, doc)
		if doc.IsDirectory && len(doc.Children) > 0 {
			for _, child := range flattenDocs(doc.Children) {
				// Indent child name for display
				if !child.IsDirectory {
					child.Name = "  " + child.Name
				}
				result = append(result, child)
			}
		}
	}
	
	return result
}

// View renders the tech docs viewer
func (m techDocsModel) View() string {
	s := docsTitleStyle.Render("📚 Luke Documentation Viewer")
	s += "\n\n"

	if m.updating {
		s += m.spinner.View() + " " + m.statusText
		return docsMainStyle.Render(s)
	}

	if m.err != nil {
		s += docsErrorStyle.Render("Error: "+m.err.Error()) + "\n\n"
		s += docsInfoStyle.Render("Press 'u' to try updating again or 'q' to quit")
		return docsMainStyle.Render(s)
	}

	if m.viewMode == "content" {
		// View document content
		content := m.rendered
		if content == "" {
			content = m.spinner.View() + " Loading content..."
		}
		
		// Apply scrolling
		lines := strings.Split(content, "\n")
		visibleHeight := 30 // Approximate terminal height
		startLine := m.scrollY
		if startLine > len(lines)-visibleHeight {
			startLine = len(lines) - visibleHeight
		}
		if startLine < 0 {
			startLine = 0
		}
		
		endLine := startLine + visibleHeight
		if endLine > len(lines) {
			endLine = len(lines)
		}
		
		visibleContent := strings.Join(lines[startLine:endLine], "\n")
		
		// Add scrollbar indicators
		if startLine > 0 {
			visibleContent = "↑ More above ↑\n" + visibleContent
		}
		if endLine < len(lines) {
			visibleContent = visibleContent + "\n↓ More below ↓"
		}
		
		s += visibleContent + "\n\n"
		s += docsInfoStyle.Render("Press 'Esc' to go back to the document list, 'j'/'k' to scroll, 'q' to quit")
		return docsMainStyle.Render(s)
	}

	// List view
	s += docsInfoStyle.Render(m.statusText) + "\n\n"

	// Document list
	if len(m.rootDocs) == 0 {
		s += "No documentation found. Press 'u' to update."
	} else {
		// Display items in a tree-like structure
		allDocs := flattenDocs(m.rootDocs)
		for _, doc := range allDocs {
			lineStyle := docsListItemStyle
			prefix := ""
			
			if doc.Path == m.selectedDoc {
				lineStyle = docsSelectedItemStyle
				prefix = "> "
			} else {
				prefix = "  "
			}
			
			// Calculate indentation based on path depth
			indent := strings.Count(doc.Path, string(os.PathSeparator)) - 1
			if indent < 0 {
				indent = 0
			}
			
			indentStr := strings.Repeat("  ", indent)
			
			if doc.IsDirectory {
				// Directory items - use folder emoji
				s += lineStyle.Render(prefix + indentStr + "📁 " + doc.Name) + "\n"
			} else {
				// File items - use file emoji
				fileInfo := ""
				if doc.Size > 0 {
					fileInfo = fmt.Sprintf(" (%s", humanize.Bytes(uint64(doc.Size)))
					if !doc.LastUpdated.IsZero() {
						fileInfo += fmt.Sprintf(", %s", humanize.Time(doc.LastUpdated))
					}
					fileInfo += ")"
				}
				
				// Check file extension to determine icon
				icon := "📄"
				if strings.HasSuffix(strings.ToLower(doc.Name), ".md") {
					icon = "📝" // Markdown
				} else if strings.HasSuffix(strings.ToLower(doc.Name), ".json") {
					icon = "🔍" // JSON
				}
				
				s += lineStyle.Render(prefix + indentStr + icon + " " + doc.Name + fileInfo) + "\n"
			}
		}
	}

	s += "\n" + docsInfoStyle.Render("Press 'j'/'k' to navigate, 'Enter' to view, 'u' to update, 'q' to quit")
	return docsMainStyle.Render(s)
}

// runTechDocsViewer runs the tech docs viewer
func runTechDocsViewer() {
	p := tea.NewProgram(initialTechDocsModel())
	if _, err := p.Run(); err != nil {
		fmt.Printf("Error running tech docs viewer: %v\n", err)
		os.Exit(1)
	}
}

// runTechDocsUpdate runs a tech docs update
func runTechDocsUpdate() {
	fmt.Println("Updating tech documentation...")
	
	serverURL := getServerURL()
	endpoint := serverURL + "/api/tech"
	
	client := &http.Client{
		Timeout: 30 * time.Second,
	}
	
	resp, err := client.Post(endpoint, "application/json", nil)
	if err != nil {
		fmt.Printf("❌ Error updating tech documentation: %v\n", err)
		return
	}
	defer resp.Body.Close()
	
	if resp.StatusCode == http.StatusOK {
		fmt.Println("✅ Tech documentation updated")
	} else {
		body, _ := io.ReadAll(resp.Body)
		fmt.Printf("❌ Error updating tech documentation: %s\n", string(body))
	}
} 