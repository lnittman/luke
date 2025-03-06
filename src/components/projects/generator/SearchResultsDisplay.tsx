import React from 'react';
import { motion } from 'framer-motion';
import { SearchResult, SearchResultsDisplayProps } from './interfaces';

/**
 * SearchResultsDisplay - Shows search results during idea generation
 */
export const SearchResultsDisplay: React.FC<SearchResultsDisplayProps> = ({
  searchResults,
  isSearching = false,
  progress,
  discoveredTechs,
  onTechClick
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--background))] p-4 mt-4 overflow-hidden"
    >
      <h3 className="text-base font-semibold mb-3">AI Research Results</h3>
      
      {/* Search Progress Bar */}
      <div className="w-full h-2 bg-[rgb(var(--muted))] rounded-full mb-4">
        <motion.div
          className="h-full bg-[rgb(var(--primary))] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      {/* Discovered Technologies */}
      {discoveredTechs.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Discovered Technologies</h4>
          <div className="flex flex-wrap gap-2">
            {discoveredTechs.map((tech, index) => (
              <button
                key={index}
                onClick={() => onTechClick?.(tech)}
                className="px-3 py-1 rounded-full bg-[rgb(var(--muted))] hover:bg-[rgb(var(--muted-foreground))] hover:text-[rgb(var(--background))] transition-colors text-xs"
              >
                {tech.name}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Search Results */}
      <div className="space-y-3">
        {searchResults.map((result, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-3 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--background))]"
          >
            <div className="flex justify-between items-start mb-1">
              <h5 className="text-sm font-medium">{result.name}</h5>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))]">
                {Math.round(result.relevance * 100)}%
              </span>
            </div>
            <p className="text-xs text-[rgb(var(--muted-foreground))] mb-2">
              {result.description}
            </p>
            {result.links && result.links.length > 0 && (
              <div className="text-xs">
                <span className="font-medium">Source: </span>
                <a 
                  href={result.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[rgb(var(--primary))] hover:underline"
                >
                  {result.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                </a>
              </div>
            )}
          </motion.div>
        ))}
        
        {isSearching && searchResults.length === 0 && (
          <div className="text-center py-4 text-sm text-[rgb(var(--muted-foreground))]">
            Searching for relevant technologies...
          </div>
        )}
      </div>
    </motion.div>
  );
}; 