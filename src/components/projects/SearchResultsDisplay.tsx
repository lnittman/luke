import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Database } from 'lucide-react';

interface SearchResult {
  content: string;
  url: string;
  title?: string;
}

interface DiscoveredTech {
  name: string;
  documentationUrl: string;
  category?: string;
}

interface SearchResultsDisplayProps {
  results: SearchResult[];
  isSearching: boolean;
  progress: number;
  discoveredTechs: DiscoveredTech[];
  onTechClick: (tech: DiscoveredTech) => void;
}

export const SearchResultsDisplay: React.FC<SearchResultsDisplayProps> = ({
  results,
  isSearching,
  progress,
  discoveredTechs,
  onTechClick,
}) => {
  const renderProgress = () => {
    if (!isSearching && progress === 0) return null;
    
    return (
      <div className="my-3 w-full flex items-center gap-2">
        <div className="text-xs font-mono text-[rgb(var(--text-secondary))]">
          Researching trends with Perplexity: {progress}%
        </div>
        <div className="flex-1 h-1.5 bg-[rgb(var(--surface-1)/0.2)] rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-blue-400/50"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    );
  };

  // No results to display
  if (!isSearching && results.length === 0 && discoveredTechs.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 w-full">
      {renderProgress()}
      
      {/* Search Results */}
      {results.length > 0 && (
        <div className="mt-2">
          <h3 className="text-sm font-mono mb-2 text-[rgb(var(--text-secondary))]">
            {isSearching ? 'Live Search Results:' : 'Search Results:'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <AnimatePresence mode="popLayout">
              {results.map((result, index) => (
                <motion.div
                  key={`result-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="glass-effect border-2 border-blue-400/20 p-3 rounded-md text-sm relative overflow-hidden"
                >
                  <div className="absolute top-2 right-2">
                    <Database size={14} className="text-blue-400" />
                  </div>
                  <div className="font-medium mb-1 pr-6">
                    {result.title || 'Search Result'}
                  </div>
                  <p className="text-xs line-clamp-2 text-[rgb(var(--text-secondary))]">
                    {result.content}
                  </p>
                  {result.url && (
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 flex items-center mt-2 hover:underline"
                    >
                      <ExternalLink size={12} className="mr-1" />
                      {result.url.length > 40 ? `${result.url.substring(0, 40)}...` : result.url}
                    </a>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
      
      {/* Discovered Technologies */}
      {discoveredTechs.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-mono mb-2 text-[rgb(var(--text-secondary))]">
            Discovered Technologies:
          </h3>
          
          <div className="flex flex-wrap gap-2">
            <AnimatePresence mode="popLayout">
              {discoveredTechs.map((tech, index) => (
                <motion.div
                  key={`tech-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className="bg-blue-400/10 border border-blue-400/30 hover:bg-blue-400/20 
                           px-2 py-1 rounded-full text-xs cursor-pointer flex items-center"
                  onClick={() => onTechClick(tech)}
                >
                  <Database size={12} className="mr-1 text-blue-400" />
                  {tech.name}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}; 