package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
)

// APIClient provides access to Luke's web API endpoints
type APIClient struct {
	baseURL    string
	apiKey     string
	httpClient *http.Client
}

// NewAPIClient creates a new API client
func NewAPIClient(baseURL, apiKey string) *APIClient {
	return &APIClient{
		baseURL: baseURL,
		apiKey:  apiKey,
		httpClient: &http.Client{
			Timeout: 2 * time.Minute,
		},
	}
}

// LLMRequest represents a request to the LLM API
type LLMRequest struct {
	Prompt       string   `json:"prompt"`
	Model        string   `json:"model,omitempty"`
	Temperature  float64  `json:"temperature,omitempty"`
	MaxTokens    int      `json:"maxTokens,omitempty"`
}

// LLMResponse represents a response from the LLM API
type LLMResponse struct {
	Content string `json:"content"`
	Error   string `json:"error,omitempty"`
}

// GenerateLLMResponse calls the web app's LLM endpoint
func (c *APIClient) GenerateLLMResponse(req LLMRequest) (*LLMResponse, error) {
	data, err := json.Marshal(req)
	if err != nil {
		return nil, err
	}

	httpReq, err := http.NewRequest("POST", c.baseURL+"/api/llm", bytes.NewBuffer(data))
	if err != nil {
		return nil, err
	}

	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Authorization", "Bearer "+c.apiKey)

	resp, err := c.httpClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API error: %s (status %d)", body, resp.StatusCode)
	}

	var llmResp LLMResponse
	if err := json.Unmarshal(body, &llmResp); err != nil {
		return nil, err
	}

	return &llmResp, nil
}

// FetchTechDocumentation gets documentation for a specific technology
func (c *APIClient) FetchTechDocumentation(techName string) (string, error) {
	httpReq, err := http.NewRequest("GET", fmt.Sprintf("%s/api/tech/docs/%s", c.baseURL, techName), nil)
	if err != nil {
		return "", err
	}

	httpReq.Header.Set("Authorization", "Bearer "+c.apiKey)

	resp, err := c.httpClient.Do(httpReq)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("API error: %s (status %d)", body, resp.StatusCode)
	}

	var docResp struct {
		Content string `json:"content"`
		Error   string `json:"error,omitempty"`
	}
	if err := json.Unmarshal(body, &docResp); err != nil {
		return "", err
	}

	if docResp.Error != "" {
		return "", fmt.Errorf("API error: %s", docResp.Error)
	}

	return docResp.Content, nil
}

// ProjectRequest represents a request to the project generation API
type ProjectRequest struct {
	Prompt       string   `json:"prompt"`
	TechStack    string   `json:"techStack,omitempty"`
	SelectedTechs []string  `json:"selectedTechs,omitempty"`
}

// ProjectResponse represents a response from the project generation API
type ProjectResponse struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Content     struct {
		Overview     Section `json:"overview"`
		Core         Section `json:"core"`
		Architecture Section `json:"architecture"`
		Tech         Section `json:"tech"`
	} `json:"content"`
	Documents   map[string]string `json:"documents"`
}

type Section struct {
	Title string   `json:"title"`
	Items []string `json:"items"`
}

// GenerateProject calls the project generation API
func (c *APIClient) GenerateProject(req ProjectRequest) (*ProjectResponse, error) {
	data, err := json.Marshal(req)
	if err != nil {
		return nil, err
	}

	httpReq, err := http.NewRequest("POST", c.baseURL+"/api/projects/generate", bytes.NewBuffer(data))
	if err != nil {
		return nil, err
	}

	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Authorization", "Bearer "+c.apiKey)

	// Increase timeout for this operation as it can take a while
	client := &http.Client{
		Timeout: 5 * time.Minute,
	}

	resp, err := client.Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API error: %s (status %d)", body, resp.StatusCode)
	}

	var projectResp ProjectResponse
	if err := json.Unmarshal(body, &projectResp); err != nil {
		return nil, err
	}

	return &projectResp, nil
}

// GetProject retrieves a specific project by ID
func (c *APIClient) GetProject(id string) (*ProjectResponse, error) {
	httpReq, err := http.NewRequest("GET", fmt.Sprintf("%s/api/projects/%s", c.baseURL, id), nil)
	if err != nil {
		return nil, err
	}

	httpReq.Header.Set("Authorization", "Bearer "+c.apiKey)

	resp, err := c.httpClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API error: %s (status %d)", body, resp.StatusCode)
	}

	var projectResp ProjectResponse
	if err := json.Unmarshal(body, &projectResp); err != nil {
		return nil, err
	}

	return &projectResp, nil
}

// GetProjectDocuments retrieves the documents for a project
func (c *APIClient) GetProjectDocuments(id string) (map[string]string, error) {
	httpReq, err := http.NewRequest("GET", fmt.Sprintf("%s/api/projects/%s/documents", c.baseURL, id), nil)
	if err != nil {
		return nil, err
	}

	httpReq.Header.Set("Authorization", "Bearer "+c.apiKey)

	resp, err := c.httpClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API error: %s (status %d)", body, resp.StatusCode)
	}

	var docsResp struct {
		Documents map[string]string `json:"documents"`
		Error     string            `json:"error,omitempty"`
	}
	if err := json.Unmarshal(body, &docsResp); err != nil {
		return nil, err
	}

	if docsResp.Error != "" {
		return nil, fmt.Errorf("API error: %s", docsResp.Error)
	}

	return docsResp.Documents, nil
} 