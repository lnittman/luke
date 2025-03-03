package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"

	"github.com/charmbracelet/bubbles/list"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/glamour"
	"github.com/charmbracelet/lipgloss"
)

// Messages
type TemplateSelected struct {
	Name    string
	Content string
}

type TemplateSelectionCancelled struct{}

// Template item
type templateItem struct {
	title       string
	description string
	path        string
}

func (i templateItem) Title() string       { return i.title }
func (i templateItem) Description() string { return i.description }
func (i templateItem) FilterValue() string { return i.title }

// Template viewer model
type templateViewerModel struct {
	list       list.Model
	loaded     bool
	selected   bool
	cancelled  bool
	name       string
	content    string
	rendered   string
	viewingDoc bool
}

func initialTemplateViewerModel() templateViewerModel {
	l := list.New([]list.Item{}, list.NewDefaultDelegate(), 0, 0)
	l.Title = "📚 documentation templates"
	l.SetShowStatusBar(false)
	l.SetFilteringEnabled(true)
	l.Styles.Title = titleStyle

	return templateViewerModel{
		list:       l,
		loaded:     false,
		selected:   false,
		cancelled:  false,
		viewingDoc: false,
	}
}

func (m templateViewerModel) Init() tea.Cmd {
	return loadTemplates
}

// Command to load templates
func loadTemplates() tea.Msg {
	// Determine docs folder
	docsFolder := os.Getenv("LUKE_DOCS_FOLDER")
	if docsFolder == "" {
		// Try to locate relative to current directory
		cwd, err := os.Getwd()
		if err != nil {
			return fmt.Errorf("❌ error finding current directory: %w", err)
		}
		
		// Check if we're in the CLI folder or parent directory
		if strings.HasSuffix(cwd, "cli") {
			docsFolder = filepath.Join(cwd, "..", "docs")
		} else {
			docsFolder = filepath.Join(cwd, "docs")
		}
	}
	
	// Get all markdown files
	items := []list.Item{}
	err := filepath.Walk(docsFolder, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		
		if !info.IsDir() && strings.HasSuffix(strings.ToLower(info.Name()), ".md") {
			// Extract relative path
			relPath, err := filepath.Rel(docsFolder, path)
			if err != nil {
				relPath = path
			}
			
			// Create template item
			items = append(items, templateItem{
				title:       info.Name(),
				description: fmt.Sprintf("📄 %s", relPath),
				path:        path,
			})
		}
		
		return nil
	})
	
	if err != nil {
		return fmt.Errorf("❌ error loading templates: %w", err)
	}
	
	if len(items) == 0 {
		return fmt.Errorf("📭 no templates found in %s", docsFolder)
	}
	
	return items
}

// Command to load template content
func loadTemplateContent(path string) tea.Cmd {
	return func() tea.Msg {
		content, err := ioutil.ReadFile(path)
		if err != nil {
			return nil
		}
		
		name := filepath.Base(path)
		return TemplateSelected{
			Name:    name,
			Content: string(content),
		}
	}
}

// Command to render markdown
func renderTemplate(markdown string) tea.Cmd {
	return func() tea.Msg {
		r, _ := glamour.NewTermRenderer(
			glamour.WithAutoStyle(),
			glamour.WithWordWrap(100),
		)

		rendered, err := r.Render(markdown)
		if err != nil {
			rendered = "❌ error rendering markdown: " + err.Error()
		}

		return MarkdownRendered{Content: rendered}
	}
}

func (m templateViewerModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	var cmd tea.Cmd
	var cmds []tea.Cmd

	switch msg := msg.(type) {
	case tea.KeyMsg:
		if m.viewingDoc {
			switch msg.String() {
			case "esc", "q", "backspace":
				m.viewingDoc = false
				return m, nil
			default:
				return m, nil
			}
		} else {
			switch msg.String() {
			case "ctrl+c", "q":
				m.cancelled = true
				return m, tea.Quit

			case "enter":
				if !m.loaded {
					return m, nil
				}

				i, ok := m.list.SelectedItem().(templateItem)
				if ok {
					return m, loadTemplateContent(i.path)
				}
			}
		}

	case []list.Item:
		m.loaded = true
		m.list.SetItems(msg)

	case TemplateSelected:
		m.selected = true
		m.name = msg.Name
		m.content = msg.Content
		m.viewingDoc = true
		return m, renderTemplate(msg.Content)

	case MarkdownRendered:
		m.rendered = msg.Content
		return m, nil

	case tea.WindowSizeMsg:
		h, v := appStyle.GetFrameSize()
		m.list.SetSize(msg.Width-h, msg.Height-v)
	}

	m.list, cmd = m.list.Update(msg)
	cmds = append(cmds, cmd)

	return m, tea.Batch(cmds...)
}

func (m templateViewerModel) View() string {
	if m.cancelled {
		return "📋 documentation viewer closed. goodbye! 👋"
	}

	if m.viewingDoc {
		return lipgloss.NewStyle().
			MaxWidth(100).
			MaxHeight(400).
			Padding(1).
			BorderStyle(lipgloss.RoundedBorder()).
			BorderForeground(lipgloss.Color("#9A348E")).
			Render(fmt.Sprintf("# %s\n\n%s\n\n(press ESC or q to go back)", 
				m.name, 
				m.rendered))
	}

	if !m.loaded {
		return "🔍 loading templates..."
	}

	return appStyle.Render(m.list.View())
}

func runDocViewer() {
	p := tea.NewProgram(initialTemplateViewerModel(), tea.WithAltScreen())
	if _, err := p.Run(); err != nil {
		fmt.Printf("❌ error running doc viewer: %v", err)
		os.Exit(1)
	}
} 