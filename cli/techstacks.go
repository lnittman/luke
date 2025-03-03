package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"sort"
	"strings"

	"github.com/charmbracelet/bubbles/list"
	"github.com/charmbracelet/bubbles/spinner"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/glamour"
	"github.com/charmbracelet/lipgloss"
)

// Messages
type TechDataLoaded struct {
	TechMd       string
	Relationships map[string][]string
}

type TechDataLoadFailed struct {
	Error string
}

type TechDetails struct {
	Name            string
	RelatedTechs    []string
	DocumentationMd string
}

type TechDetailsLoaded struct {
	Details TechDetails
	Rendered string
}

// Tech stack models
type techItem struct {
	name       string
	category   string
	related    []string
}

func (i techItem) Title() string       { return i.name }
func (i techItem) Description() string { return fmt.Sprintf("Category: %s", i.category) }
func (i techItem) FilterValue() string { return i.name }

type techStacksModel struct {
	list            list.Model
	spinner         spinner.Model
	loading         bool
	loaded          bool
	failed          bool
	viewingTech     bool
	techMd          string
	relationships   map[string][]string
	currentTech     TechDetails
	renderedContent string
	err             error
}

func initialTechStacksModel() techStacksModel {
	// Setup spinner
	s := spinner.New()
	s.Spinner = spinner.Dot
	s.Style = lipgloss.NewStyle().Foreground(lipgloss.Color("#9A348E"))

	// Setup list
	l := list.New([]list.Item{}, list.NewDefaultDelegate(), 0, 0)
	l.Title = "🧩 Tech Stacks"
	l.SetShowStatusBar(false)
	l.SetFilteringEnabled(true)
	l.Styles.Title = titleStyle

	return techStacksModel{
		list:        l,
		spinner:     s,
		loading:     true,
		loaded:      false,
		failed:      false,
		viewingTech: false,
	}
}

func (m techStacksModel) Init() tea.Cmd {
	return tea.Batch(
		m.spinner.Tick,
		loadTechData(),
	)
}

// Command to load tech data
func loadTechData() tea.Cmd {
	return func() tea.Msg {
		// Determine base URL
		baseURL := os.Getenv("LUKE_API_URL")
		if baseURL == "" {
			baseURL = "http://localhost:3000"
		}

		// Make HTTP request
		resp, err := http.Get(baseURL + "/api/tech")
		if err != nil {
			return TechDataLoadFailed{Error: err.Error()}
		}
		defer resp.Body.Close()

		// Check status code
		if resp.StatusCode != http.StatusOK {
			return TechDataLoadFailed{Error: fmt.Sprintf("API returned status code %d", resp.StatusCode)}
		}

		// Parse response
		var result struct {
			TechMd       string                 `json:"techMd"`
			Relationships map[string][]string   `json:"relationships"`
		}

		err = json.NewDecoder(resp.Body).Decode(&result)
		if err != nil {
			return TechDataLoadFailed{Error: err.Error()}
		}

		return TechDataLoaded{
			TechMd:       result.TechMd,
			Relationships: result.Relationships,
		}
	}
}

// Command to load tech details
func loadTechDetails(name string, related []string) tea.Cmd {
	return func() tea.Msg {
		// Determine base URL
		baseURL := os.Getenv("LUKE_API_URL")
		if baseURL == "" {
			baseURL = "http://localhost:3000"
		}

		// Fetch tech documentation
		resp, err := http.Post(
			baseURL+"/api/tech",
			"application/json",
			strings.NewReader(fmt.Sprintf(`{"techName":"%s"}`, name)),
		)
		
		if err != nil {
			return TechDetailsLoaded{
				Details: TechDetails{
					Name:         name,
					RelatedTechs: related,
					DocumentationMd: fmt.Sprintf("# %s\n\nError loading documentation: %s", name, err.Error()),
				},
				Rendered: fmt.Sprintf("Error loading documentation: %s", err.Error()),
			}
		}
		defer resp.Body.Close()

		var docContent struct {
			Content string `json:"content"`
		}
		
		err = json.NewDecoder(resp.Body).Decode(&docContent)
		if err != nil {
			return TechDetailsLoaded{
				Details: TechDetails{
					Name:         name,
					RelatedTechs: related,
					DocumentationMd: fmt.Sprintf("# %s\n\nError parsing documentation: %s", name, err.Error()),
				},
				Rendered: fmt.Sprintf("Error parsing documentation: %s", err.Error()),
			}
		}

		// Render markdown
		r, _ := glamour.NewTermRenderer(
			glamour.WithAutoStyle(),
			glamour.WithWordWrap(100),
		)

		rendered, err := r.Render(docContent.Content)
		if err != nil {
			rendered = fmt.Sprintf("Error rendering documentation: %s", err.Error())
		}

		return TechDetailsLoaded{
			Details: TechDetails{
				Name:         name,
				RelatedTechs: related,
				DocumentationMd: docContent.Content,
			},
			Rendered: rendered,
		}
	}
}

func buildTechList(md string, relationships map[string][]string) []list.Item {
	items := []list.Item{}
	
	// Extract tech items from markdown
	techMatches := make(map[string]string)
	
	// Process markdown to extract tech items
	for _, line := range strings.Split(md, "\n") {
		// Look for list items
		if strings.HasPrefix(strings.TrimSpace(line), "-") || strings.HasPrefix(strings.TrimSpace(line), "*") {
			line = strings.TrimSpace(line)
			line = strings.TrimPrefix(line, "-")
			line = strings.TrimPrefix(line, "*")
			line = strings.TrimSpace(line)
			
			// Extract tech name - sometimes in backticks, sometimes not
			var techName string
			if strings.Contains(line, "`") {
				parts := strings.Split(line, "`")
				if len(parts) >= 3 {
					techName = parts[1]
				}
			} else if strings.Contains(line, "**") {
				parts := strings.Split(line, "**")
				if len(parts) >= 3 {
					techName = parts[1]
				}
			} else {
				// Take first word
				parts := strings.SplitN(line, " ", 2)
				if len(parts) > 0 {
					techName = parts[0]
					// Remove colon if present
					techName = strings.TrimSuffix(techName, ":")
				}
			}
			
			if techName != "" && len(techName) < 30 {
				// Try to determine category based on markdown headers
				category := "Other"
				lines := strings.Split(md, "\n")
				for i, l := range lines {
					if strings.Contains(l, techName) && i > 0 {
						// Look for header before the tech item
						for j := i; j >= 0; j-- {
							if strings.HasPrefix(lines[j], "#") {
								headerText := strings.TrimSpace(strings.TrimLeft(lines[j], "#"))
								category = headerText
								break
							}
						}
					}
				}
				
				techMatches[techName] = category
			}
		}
	}
	
	// Add relationships from API response
	for tech := range relationships {
		if tech == "" || len(tech) > 30 {
			continue
		}
		
		// Skip duplicates
		if _, exists := techMatches[tech]; !exists {
			techMatches[tech] = "Framework/Library"
		}
	}
	
	// Convert to items
	for tech, category := range techMatches {
		// Get related techs
		related := relationships[tech]
		if related == nil {
			related = []string{}
		}
		
		items = append(items, techItem{
			name:     tech,
			category: category,
			related:  related,
		})
	}
	
	// Sort by name
	sort.Slice(items, func(i, j int) bool {
		return items[i].(techItem).name < items[j].(techItem).name
	})
	
	return items
}

func (m techStacksModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	var cmd tea.Cmd
	var cmds []tea.Cmd

	switch msg := msg.(type) {
	case tea.KeyMsg:
		if m.viewingTech {
			switch msg.String() {
			case "esc", "q", "backspace":
				m.viewingTech = false
				return m, nil
			}
		} else {
			switch msg.String() {
			case "ctrl+c", "q":
				return m, tea.Quit
				
			case "enter":
				if m.loaded {
					i, ok := m.list.SelectedItem().(techItem)
					if ok {
						m.viewingTech = true
						m.loading = true
						return m, tea.Batch(
							m.spinner.Tick,
							loadTechDetails(i.name, i.related),
						)
					}
				}
			}
		}
		
	case TechDataLoaded:
		m.loading = false
		m.loaded = true
		m.techMd = msg.TechMd
		m.relationships = msg.Relationships
		
		// Build tech list
		items := buildTechList(m.techMd, m.relationships)
		m.list.SetItems(items)
		
		return m, nil
		
	case TechDataLoadFailed:
		m.loading = false
		m.loaded = false
		m.failed = true
		m.err = fmt.Errorf(msg.Error)
		return m, nil
		
	case TechDetailsLoaded:
		m.loading = false
		m.currentTech = msg.Details
		m.renderedContent = msg.Rendered
		return m, nil
		
	case spinner.TickMsg:
		if m.loading {
			m.spinner, cmd = m.spinner.Update(msg)
			cmds = append(cmds, cmd)
		}
		
	case tea.WindowSizeMsg:
		h, v := appStyle.GetFrameSize()
		m.list.SetSize(msg.Width-h, msg.Height-v)
	}

	if !m.loading && !m.viewingTech {
		m.list, cmd = m.list.Update(msg)
		cmds = append(cmds, cmd)
	}

	return m, tea.Batch(cmds...)
}

func (m techStacksModel) View() string {
	if m.err != nil {
		return fmt.Sprintf("Error: %s\n\nPress any key to exit.", m.err.Error())
	}

	if m.loading {
		return fmt.Sprintf(
			"Loading tech data...\n\n%s",
			m.spinner.View(),
		)
	}

	if m.viewingTech {
		relatedTechs := ""
		if len(m.currentTech.RelatedTechs) > 0 {
			relatedTechs = "\n\nRelated Technologies:\n"
			for _, tech := range m.currentTech.RelatedTechs {
				relatedTechs += fmt.Sprintf("• %s\n", tech)
			}
		}
		
		return lipgloss.NewStyle().
			MaxWidth(100).
			MaxHeight(400).
			Padding(1).
			BorderStyle(lipgloss.RoundedBorder()).
			BorderForeground(lipgloss.Color("#9A348E")).
			Render(fmt.Sprintf("%s%s\n\n(Press ESC, q, or backspace to go back)", 
				m.renderedContent,
				relatedTechs))
	}

	return appStyle.Render(m.list.View())
}

func runTechStacks() {
	p := tea.NewProgram(initialTechStacksModel(), tea.WithAltScreen())
	if _, err := p.Run(); err != nil {
		fmt.Printf("Error running tech stacks viewer: %v", err)
		os.Exit(1)
	}
} 