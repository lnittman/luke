package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/charmbracelet/bubbles/spinner"
	"github.com/charmbracelet/bubbles/textinput"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
)

// Project generation types
type TechStack struct {
	Frameworks        []string            `json:"frameworks"`
	Libraries         []string            `json:"libraries"`
	APIs              []string            `json:"apis"`
	Tools             []string            `json:"tools"`
	DocumentationLinks map[string]string  `json:"documentationLinks"`
}

type GenerationRequest struct {
	Prompt       string    `json:"prompt"`
	TechStack    *TechStack `json:"techStack,omitempty"`
	ProjectName  string    `json:"projectName,omitempty"`
	SelectedTechs []string  `json:"selectedTechs,omitempty"`
}

type Project struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Emoji       string    `json:"emoji"`
	TechItems   []string  `json:"techItems"`
	CreatedAt   time.Time `json:"createdAt"`
}

// Messages
type ProjectGenerated struct {
	Project Project
}

type GenerationFailed struct {
	Error string
}

// Generator model
type generatorModel struct {
	nameInput     textinput.Model
	descInput     textinput.Model
	techStack     string
	selectedTechs []string
	spinner       spinner.Model
	generating    bool
	generated     bool
	project       Project
	err           error
}

func initialGeneratorModel() generatorModel {
	// Setup inputs
	nameInput := textinput.New()
	nameInput.Placeholder = "Project name (optional)"
	nameInput.Focus()
	nameInput.Width = 40
	nameInput.CharLimit = 50

	descInput := textinput.New()
	descInput.Placeholder = "Project description"
	descInput.Width = 40
	descInput.CharLimit = 200

	// Setup spinner
	s := spinner.New()
	s.Spinner = spinner.Dot
	s.Style = lipgloss.NewStyle().Foreground(lipgloss.Color("#9A348E"))

	return generatorModel{
		nameInput:  nameInput,
		descInput:  descInput,
		spinner:    s,
		generating: false,
		generated:  false,
	}
}

func (m generatorModel) Init() tea.Cmd {
	return tea.Batch(
		textinput.Blink,
		m.spinner.Tick,
	)
}

// Command to generate a project
func generateProject(request GenerationRequest) tea.Cmd {
	return func() tea.Msg {
		// Prepare the request
		jsonData, err := json.Marshal(request)
		if err != nil {
			return GenerationFailed{Error: err.Error()}
		}

		// Determine base URL
		baseURL := os.Getenv("LUKE_API_URL")
		if baseURL == "" {
			baseURL = "http://localhost:3000"
		}

		// Make HTTP request
		resp, err := http.Post(
			baseURL+"/api/projects/generate",
			"application/json",
			bytes.NewBuffer(jsonData),
		)
		if err != nil {
			return GenerationFailed{Error: err.Error()}
		}
		defer resp.Body.Close()

		// Check status code
		if resp.StatusCode != http.StatusOK {
			return GenerationFailed{Error: fmt.Sprintf("API returned status code %d", resp.StatusCode)}
		}

		// Parse response
		var result struct {
			Project  Project `json:"project"`
			Documents struct {
				Init   string `json:"init"`
				Index  string `json:"index"`
				Design string `json:"design"`
				Code   string `json:"code"`
			} `json:"documents"`
		}

		err = json.NewDecoder(resp.Body).Decode(&result)
		if err != nil {
			return GenerationFailed{Error: err.Error()}
		}

		return ProjectGenerated{Project: result.Project}
	}
}

func (m generatorModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	var cmd tea.Cmd
	var cmds []tea.Cmd

	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch msg.String() {
		case "ctrl+c", "esc":
			return m, tea.Quit

		case "enter":
			if m.generating || m.generated {
				return m, tea.Quit
			}

			if m.nameInput.Focused() {
				m.nameInput.Blur()
				m.descInput.Focus()
				return m, textinput.Blink
			}

			if m.descInput.Focused() {
				m.descInput.Blur()
				m.generating = true

				// Prepare the request
				request := GenerationRequest{
					Prompt:      m.descInput.Value(),
					ProjectName: m.nameInput.Value(),
				}

				// TODO: Add tech stack and selected techs

				return m, tea.Batch(
					m.spinner.Tick,
					generateProject(request),
				)
			}
		}

	case ProjectGenerated:
		m.generating = false
		m.generated = true
		m.project = msg.Project
		return m, nil

	case GenerationFailed:
		m.generating = false
		m.err = fmt.Errorf(msg.Error)
		return m, nil

	case spinner.TickMsg:
		if m.generating {
			m.spinner, cmd = m.spinner.Update(msg)
			cmds = append(cmds, cmd)
		}

	default:
		// Handle input updates
		if !m.generating && !m.generated {
			if m.nameInput.Focused() {
				m.nameInput, cmd = m.nameInput.Update(msg)
				cmds = append(cmds, cmd)
			} else if m.descInput.Focused() {
				m.descInput, cmd = m.descInput.Update(msg)
				cmds = append(cmds, cmd)
			}
		}
	}

	return m, tea.Batch(cmds...)
}

func (m generatorModel) View() string {
	if m.err != nil {
		return fmt.Sprintf("Error: %s\n\nPress any key to exit.", m.err.Error())
	}

	if m.generated {
		return fmt.Sprintf(
			"✨ Project Generated Successfully!\n\n"+
				"Name: %s\n"+
				"Emoji: %s\n"+
				"Description: %s\n\n"+
				"Access at: #%s\n\n"+
				"Press any key to exit.",
			m.project.Name,
			m.project.Emoji,
			m.project.Description,
			m.project.ID,
		)
	}

	if m.generating {
		return fmt.Sprintf(
			"Generating project...\n\n%s",
			m.spinner.View(),
		)
	}

	namePrompt := "Project Name:"
	if m.nameInput.Focused() {
		namePrompt = "> " + namePrompt
	}

	descPrompt := "Project Description:"
	if m.descInput.Focused() {
		descPrompt = "> " + descPrompt
	}

	return fmt.Sprintf(
		"Project Generator\n\n"+
			"%s\n%s\n\n"+
			"%s\n%s\n\n"+
			"Press Enter to continue, ESC to exit",
		namePrompt,
		m.nameInput.View(),
		descPrompt,
		m.descInput.View(),
	)
}

func runProjectGenerator() {
	p := tea.NewProgram(initialGeneratorModel())
	if _, err := p.Run(); err != nil {
		fmt.Printf("Error running project generator: %v", err)
		os.Exit(1)
	}
} 