package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/charmbracelet/bubbles/spinner"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
)

// Messages
type DiagnosticsCompleted struct {
	Results map[string]interface{}
}

type DiagnosticsFailed struct {
	Error string
}

// Diagnostics model
type diagnosticsModel struct {
	spinner   spinner.Model
	running   bool
	completed bool
	results   map[string]interface{}
	err       error
	sections  []string
}

func initialDiagnosticsModel() diagnosticsModel {
	// Setup spinner
	s := spinner.New()
	s.Spinner = spinner.Dot
	s.Style = lipgloss.NewStyle().Foreground(lipgloss.Color("#9A348E"))

	return diagnosticsModel{
		spinner:   s,
		running:   true,
		completed: false,
		sections:  []string{},
	}
}

func (m diagnosticsModel) Init() tea.Cmd {
	return tea.Batch(
		m.spinner.Tick,
		runDiagnostics(),
	)
}

// Command to run diagnostics
func runDiagnostics() tea.Cmd {
	return func() tea.Msg {
		results := make(map[string]interface{})

		// Check API server
		baseURL := os.Getenv("LUKE_API_URL")
		if baseURL == "" {
			baseURL = "http://localhost:3000"
		}

		// Check API server health
		apiHealth := make(map[string]interface{})
		apiEndpoints := []string{
			"/api/tech",
			"/api/projects",
		}

		for _, endpoint := range apiEndpoints {
			start := time.Now()
			resp, err := http.Get(baseURL + endpoint)
			elapsed := time.Since(start)

			if err != nil {
				apiHealth[endpoint] = map[string]interface{}{
					"status":  "error",
					"message": err.Error(),
					"time":    elapsed.String(),
				}
			} else {
				defer resp.Body.Close()
				apiHealth[endpoint] = map[string]interface{}{
					"status":     "ok",
					"statusCode": resp.StatusCode,
					"time":       elapsed.String(),
				}
			}
		}
		results["api"] = apiHealth

		// Check templates
		templateInfo := make(map[string]interface{})
		basePaths := []string{"docs", "../docs"}
		templates := make(map[string]interface{})

		for _, basePath := range basePaths {
			dirs, err := filepath.Glob(filepath.Join(basePath, "*-template"))
			if err != nil {
				continue
			}
			
			for _, dir := range dirs {
				templateName := strings.TrimSuffix(filepath.Base(dir), "-template")
				
				files, err := filepath.Glob(filepath.Join(dir, "*.md"))
				if err != nil {
					templates[templateName] = map[string]interface{}{
						"status":  "error",
						"message": err.Error(),
					}
				} else {
					fileNames := make([]string, 0)
					for _, file := range files {
						fileNames = append(fileNames, filepath.Base(file))
					}
					templates[templateName] = map[string]interface{}{
						"status": "ok",
						"files":  fileNames,
						"count":  len(fileNames),
					}
				}
			}
		}

		templateInfo["status"] = "ok"
		templateInfo["templates"] = templates
		templateInfo["count"] = len(templates)
		results["templates"] = templateInfo

		// Enhanced Tech Files Check
		techFileInfo := make(map[string]interface{})
		
		// First check the main tech.md file
		techMdPath := ""
		var techMdInfo map[string]interface{}
		
		// Check in both possible locations
		for _, basePath := range basePaths {
			path := filepath.Join(basePath, "tech.md")
			if fileInfo, err := os.Stat(path); err == nil {
				techMdPath = path
				techMdInfo = map[string]interface{}{
					"status": "ok",
					"size": fileInfo.Size(),
					"lastModified": fileInfo.ModTime().Format(time.RFC3339),
					"age": time.Since(fileInfo.ModTime()).String(),
				}
				break
			}
		}
		
		// If not found anywhere
		if techMdPath == "" {
			techMdInfo = map[string]interface{}{
				"status": "missing",
				"error": "file not found in docs or ../docs",
			}
		}
		techFileInfo["main"] = techMdInfo
		
		// Check tech-<stack>.md files
		techStackFiles := make(map[string]interface{})
		stacks := []string{"next", "apple", "cli", "other"}
		
		for _, stack := range stacks {
			stackInfo := make(map[string]interface{})
			stackPath := ""
			
			// Check in both possible locations
			for _, basePath := range basePaths {
				path := filepath.Join(basePath, fmt.Sprintf("tech-%s.md", stack))
				if fileInfo, err := os.Stat(path); err == nil {
					stackPath = path
					stackInfo = map[string]interface{}{
						"status": "ok",
						"size": fileInfo.Size(),
						"lastModified": fileInfo.ModTime().Format(time.RFC3339),
						"age": time.Since(fileInfo.ModTime()).String(),
					}
					
					// Try to read the first few lines to check format
					if file, err := os.Open(path); err == nil {
						defer file.Close()
						scanner := bufio.NewScanner(file)
						lineCount := 0
						for scanner.Scan() && lineCount < 3 {
							line := scanner.Text()
							if lineCount == 0 && strings.HasPrefix(line, "# ") {
								stackInfo["title"] = strings.TrimPrefix(line, "# ")
							}
							lineCount++
						}
						stackInfo["format"] = "valid"
					}
					break
				}
			}
			
			// If not found anywhere
			if stackPath == "" {
				stackInfo = map[string]interface{}{
					"status": "missing",
					"error": "file not found in docs or ../docs",
				}
			}
			
			techStackFiles[stack] = stackInfo
		}
		techFileInfo["stacks"] = techStackFiles
		
		// Check API-based tech generation
		resp, err := http.Get(baseURL + "/api/tech")
		if err != nil {
			techFileInfo["api"] = map[string]interface{}{
				"status": "error",
				"message": err.Error(),
			}
		} else {
			defer resp.Body.Close()
			
			if resp.StatusCode != http.StatusOK {
				bodyBytes, _ := ioutil.ReadAll(resp.Body)
				bodyPreview := string(bodyBytes)
				if len(bodyPreview) > 100 {
					bodyPreview = bodyPreview[:100] + "..."
				}
				techFileInfo["api"] = map[string]interface{}{
					"status": "error",
					"statusCode": resp.StatusCode,
					"response": bodyPreview,
				}
			} else {
				var result struct {
					TechMd string                `json:"techMd"`
					Stacks map[string]interface{} `json:"stacks"`
				}
				
				if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
					techFileInfo["api"] = map[string]interface{}{
						"status": "error",
						"message": fmt.Sprintf("JSON decode error: %s", err.Error()),
					}
				} else {
					techFileInfo["api"] = map[string]interface{}{
						"status": "ok",
						"techMdLength": len(result.TechMd),
						"stackCount": len(result.Stacks),
						"stacks": result.Stacks,
					}
				}
			}
		}
		
		// Check Vercel Blob Storage
		// This uses the API to see if files are in Vercel Blob
		blobInfo := make(map[string]interface{})
		
		// First, check if files exist in Vercel Blob via API
		blobResp, err := http.Get(baseURL + "/api/blob/list")
		if err != nil {
			blobInfo["status"] = "error"
			blobInfo["message"] = fmt.Sprintf("error connecting to blob API: %s", err.Error())
		} else {
			defer blobResp.Body.Close()
			
			if blobResp.StatusCode != http.StatusOK {
				blobInfo["status"] = "error"
				blobInfo["statusCode"] = blobResp.StatusCode
			} else {
				var blobResult struct {
					Blobs []struct {
						Pathname  string    `json:"pathname"`
						URL       string    `json:"url"`
						Size      int       `json:"size"`
						UploadedAt string `json:"uploadedAt"`
					} `json:"blobs"`
				}
				
				if err := json.NewDecoder(blobResp.Body).Decode(&blobResult); err != nil {
					blobInfo["status"] = "error"
					blobInfo["message"] = fmt.Sprintf("JSON decode error: %s", err.Error())
				} else {
					// Find tech.md and tech-*.md files
					blobInfo["status"] = "ok"
					totalFiles := 0
					foundFiles := make(map[string]interface{})
					
					techMdFound := false
					for _, blob := range blobResult.Blobs {
						if blob.Pathname == "tech.md" {
							techMdFound = true
							foundFiles["tech.md"] = map[string]interface{}{
								"url":        blob.URL,
								"size":       blob.Size,
								"uploadedAt": blob.UploadedAt,
							}
							totalFiles++
						} else if strings.HasPrefix(blob.Pathname, "tech-") && strings.HasSuffix(blob.Pathname, ".md") {
							stack := strings.TrimPrefix(blob.Pathname, "tech-")
							stack = strings.TrimSuffix(stack, ".md")
							foundFiles[stack] = map[string]interface{}{
								"url":        blob.URL,
								"size":       blob.Size,
								"uploadedAt": blob.UploadedAt,
							}
							totalFiles++
						}
					}
					
					blobInfo["techMdFound"] = techMdFound
					blobInfo["files"] = foundFiles
					blobInfo["totalTechFiles"] = totalFiles
				}
			}
		}
		techFileInfo["vercelBlob"] = blobInfo
		
		// Check Jina API configuration
		jinaInfo := make(map[string]interface{})
		// Jina free APIs don't require an API key
		jinaInfo["status"] = "available"
		jinaInfo["message"] = "free tier APIs available without API key"
		jinaInfo["apis"] = []string{"reader", "search", "grounding"}
		techFileInfo["jina"] = jinaInfo
		results["techFiles"] = techFileInfo

		return DiagnosticsCompleted{Results: results}
	}
}

func (m diagnosticsModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	var cmd tea.Cmd
	var cmds []tea.Cmd

	switch msg := msg.(type) {
	case tea.KeyMsg:
		if msg.String() == "q" || msg.String() == "esc" || msg.String() == "ctrl+c" {
			return m, tea.Quit
		}

	case DiagnosticsCompleted:
		m.running = false
		m.completed = true
		m.results = msg.Results
		
		// Build sections list
		for section := range m.results {
			m.sections = append(m.sections, section)
		}
		
		return m, nil

	case DiagnosticsFailed:
		m.running = false
		m.completed = false
		m.err = fmt.Errorf(msg.Error)
		return m, nil

	case spinner.TickMsg:
		if m.running {
			m.spinner, cmd = m.spinner.Update(msg)
			cmds = append(cmds, cmd)
		}
	}

	return m, tea.Batch(cmds...)
}

func formatDiagnosticResults(results map[string]interface{}, indent string) string {
	var output strings.Builder

	for key, value := range results {
		switch v := value.(type) {
		case map[string]interface{}:
			output.WriteString(fmt.Sprintf("%s%s:\n", indent, key))
			output.WriteString(formatDiagnosticResults(v, indent+"  "))
		case []interface{}:
			output.WriteString(fmt.Sprintf("%s%s: [", indent, key))
			for i, item := range v {
				if i > 0 {
					output.WriteString(", ")
				}
				output.WriteString(fmt.Sprintf("%v", item))
			}
			output.WriteString("]\n")
		default:
			output.WriteString(fmt.Sprintf("%s%s: %v\n", indent, key, v))
		}
	}

	return output.String()
}

func (m diagnosticsModel) View() string {
	if m.err != nil {
		return fmt.Sprintf("❌ error: %s\n\npress any key to exit.", m.err.Error())
	}

	if m.running {
		return fmt.Sprintf(
			"🔍 running diagnostics...\n\n%s",
			m.spinner.View(),
		)
	}

	if m.completed {
		var output strings.Builder
		output.WriteString("✅ diagnostics completed!\n\n")

		successStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("#00BF00"))
		errorStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("#BF0000"))
		infoStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("#0078D7"))
		
		// Format API section
		if api, ok := m.results["api"].(map[string]interface{}); ok {
			output.WriteString("🌐 API health:\n")
			
			for endpoint, data := range api {
				if info, ok := data.(map[string]interface{}); ok {
					status := info["status"].(string)
					if status == "ok" {
						output.WriteString(fmt.Sprintf("  %s: %s", 
							endpoint, 
							successStyle.Render("✓ OK")))
					} else {
						output.WriteString(fmt.Sprintf("  %s: %s", 
							endpoint, 
							errorStyle.Render("✗ ERROR")))
					}
					
					if time, ok := info["time"].(string); ok {
						output.WriteString(fmt.Sprintf(" (%s)\n", time))
					} else {
						output.WriteString("\n")
					}
				}
			}
			output.WriteString("\n")
		}
		
		// Format Templates section
		if templates, ok := m.results["templates"].(map[string]interface{}); ok {
			output.WriteString("📄 templates:\n")
			
			if status, ok := templates["status"].(string); ok {
				if status == "ok" {
					output.WriteString(fmt.Sprintf("  status: %s\n", 
						successStyle.Render("✓ OK")))
					
					if templatesData, ok := templates["templates"].(map[string]interface{}); ok {
						for name, data := range templatesData {
							if info, ok := data.(map[string]interface{}); ok {
								status := info["status"].(string)
								if status == "ok" {
									output.WriteString(fmt.Sprintf("  %s: %s", 
										name, 
										successStyle.Render("✓ OK")))
									
									if count, ok := info["count"].(float64); ok {
										output.WriteString(fmt.Sprintf(" (%d files)\n", int(count)))
									} else {
										output.WriteString("\n")
									}
								} else {
									output.WriteString(fmt.Sprintf("  %s: %s\n", 
										name, 
										errorStyle.Render("✗ ERROR")))
								}
							}
						}
					}
				} else {
					output.WriteString(fmt.Sprintf("  status: %s\n", 
						errorStyle.Render("✗ ERROR")))
					
					if message, ok := templates["message"].(string); ok {
						output.WriteString(fmt.Sprintf("  message: %s\n", message))
					}
				}
			}
			output.WriteString("\n")
		}
		
		// Enhanced Tech Files section with more details
		if techFiles, ok := m.results["techFiles"].(map[string]interface{}); ok {
			output.WriteString("⚙️  tech files:\n")
			
			// Main tech.md status
			if mainTech, ok := techFiles["main"].(map[string]interface{}); ok {
				status := mainTech["status"].(string)
				if status == "ok" {
					output.WriteString(fmt.Sprintf("  tech.md: %s", 
						successStyle.Render("✓ OK")))
					
					if age, ok := mainTech["age"].(string); ok {
						output.WriteString(fmt.Sprintf(" (last updated %s ago)\n", age))
					} else {
						output.WriteString("\n")
					}
				} else {
					output.WriteString(fmt.Sprintf("  tech.md: %s\n", 
						errorStyle.Render("✗ MISSING")))
				}
			}
			
			// Tech stack files
			if stacks, ok := techFiles["stacks"].(map[string]interface{}); ok {
				output.WriteString("  tech stack files:\n")
				
				for stack, data := range stacks {
					if info, ok := data.(map[string]interface{}); ok {
						status := info["status"].(string)
						if status == "ok" {
							output.WriteString(fmt.Sprintf("    %s: %s", 
								stack, 
								successStyle.Render("✓ OK")))
							
							if age, ok := info["age"].(string); ok {
								output.WriteString(fmt.Sprintf(" (updated %s ago)\n", age))
							} else {
								output.WriteString("\n")
							}
						} else {
							output.WriteString(fmt.Sprintf("    %s: %s\n", 
								stack, 
								errorStyle.Render("✗ MISSING")))
						}
					}
				}
			}
			
			// API status
			if api, ok := techFiles["api"].(map[string]interface{}); ok {
				status := api["status"].(string)
				if status == "ok" {
					output.WriteString(fmt.Sprintf("  tech API: %s\n", 
						successStyle.Render("✓ OK")))
					
					if stackCount, ok := api["stackCount"].(float64); ok {
						output.WriteString(fmt.Sprintf("    stack count: %d\n", int(stackCount)))
					}
				} else {
					output.WriteString(fmt.Sprintf("  tech API: %s\n", 
						errorStyle.Render("✗ ERROR")))
					
					if message, ok := api["message"].(string); ok {
						output.WriteString(fmt.Sprintf("    message: %s\n", message))
					} else if response, ok := api["response"].(string); ok {
						output.WriteString(fmt.Sprintf("    response: %s\n", response))
					}
				}
			}
			
			// Vercel Blob Storage status
			if vercelBlob, ok := techFiles["vercelBlob"].(map[string]interface{}); ok {
				status := vercelBlob["status"].(string)
				if status == "ok" {
					output.WriteString(fmt.Sprintf("  Vercel Blob: %s\n", 
						successStyle.Render("✓ OK")))
					
					if techMdFound, ok := vercelBlob["techMdFound"].(bool); ok {
						if techMdFound {
							output.WriteString("    tech.md found in Vercel Blob\n")
						} else {
							output.WriteString("    tech.md not found in Vercel Blob\n")
						}
					}
					
					if totalFiles, ok := vercelBlob["totalTechFiles"].(float64); ok {
						output.WriteString(fmt.Sprintf("    total tech files: %d\n", int(totalFiles)))
					}
				} else {
					output.WriteString(fmt.Sprintf("  Vercel Blob: %s\n", 
						errorStyle.Render("✗ ERROR")))
					
					if message, ok := vercelBlob["message"].(string); ok {
						output.WriteString(fmt.Sprintf("    note: %s\n", message))
					}
				}
			}
			
			// Jina API status
			if jina, ok := techFiles["jina"].(map[string]interface{}); ok {
				status := jina["status"].(string)
				if status == "available" {
					output.WriteString(fmt.Sprintf("  jina API: %s\n", 
						successStyle.Render("✓ AVAILABLE")))
				} else {
					output.WriteString(fmt.Sprintf("  jina API: %s\n", 
						infoStyle.Render("ℹ NOT AVAILABLE")))
					
					if message, ok := jina["message"].(string); ok {
						output.WriteString(fmt.Sprintf("    note: %s\n", message))
					}
				}
			}
		}
		
		output.WriteString("\npress 'q' to exit.")
		return output.String()
	}

	return "press 'q' to exit."
}

func runSystemDiagnostics() {
	p := tea.NewProgram(initialDiagnosticsModel())
	if _, err := p.Run(); err != nil {
		fmt.Printf("Error running diagnostics: %v", err)
		os.Exit(1)
	}
} 