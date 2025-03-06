import React from 'react';
import { render, screen } from '@testing-library/react';
import { SearchResultsDisplay } from '../SearchResultsDisplay';
import { SearchResult } from '../interfaces';

// Mock data for testing
const mockSearchResults: SearchResult[] = [
  {
    name: 'React',
    relevance: 0.95,
    description: 'A JavaScript library for building user interfaces',
    url: 'https://reactjs.org'
  },
  {
    name: 'Next.js',
    relevance: 0.85,
    description: 'The React framework for production',
    url: 'https://nextjs.org'
  }
];

const mockDiscoveredTechs = [
  { name: 'React', documentationUrl: 'https://reactjs.org' },
  { name: 'Next.js', documentationUrl: 'https://nextjs.org' }
];

describe('SearchResultsDisplay', () => {
  it('renders search results correctly', () => {
    render(
      <SearchResultsDisplay
        searchResults={mockSearchResults}
        progress={75}
        discoveredTechs={mockDiscoveredTechs}
      />
    );
    
    // Check if component renders the title
    expect(screen.getByText('AI Research Results')).toBeInTheDocument();
    
    // Check if results are displayed
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();
    
    // Check if descriptions are displayed
    expect(screen.getByText('A JavaScript library for building user interfaces')).toBeInTheDocument();
    expect(screen.getByText('The React framework for production')).toBeInTheDocument();
    
    // Check if relevance percentages are displayed
    expect(screen.getByText('95%')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });
  
  it('displays discovered technologies section', () => {
    render(
      <SearchResultsDisplay
        searchResults={[]}
        progress={50}
        discoveredTechs={mockDiscoveredTechs}
      />
    );
    
    // Check if discovered technologies title is displayed
    expect(screen.getByText('Discovered Technologies')).toBeInTheDocument();
    
    // Check if tech buttons are displayed
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();
  });
  
  it('shows searching message when no results are available', () => {
    render(
      <SearchResultsDisplay
        searchResults={[]}
        progress={25}
        discoveredTechs={[]}
        isSearching={true}
      />
    );
    
    // Check if searching message is displayed
    expect(screen.getByText('Searching for relevant technologies...')).toBeInTheDocument();
  });
}); 