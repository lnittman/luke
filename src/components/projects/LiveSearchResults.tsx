import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Lightbulb, Award, Sparkles } from 'lucide-react';

interface SearchQuery {
  id: string;
  content: string;
  completed: boolean;
  result?: string;
}

interface LiveSearchResultsProps {
  queries: SearchQuery[];
  isGenerating: boolean;
  progress: number;
  ideaGenerating: boolean;
}

export const LiveSearchResults: React.FC<LiveSearchResultsProps> = ({
  queries,
  isGenerating,
  progress,
  ideaGenerating
}) => {
  // Calculate combined progress: search phase and idea generation phase
  const calculatedProgress = ideaGenerating
    ? 50 + (progress / 2) // If idea is generating, we're in the 2nd half of the process
    : progress / 2; // Search is the first half of the process
  
  // Calculate completed queries count
  const completedQueries = queries.filter(q => q.completed).length;
  const totalQueries = queries.length;
  
  // Different sections of idea generation
  const sections = [
    { 
      id: 'trends', 
      title: 'Cultural & Viral Trends',
      icon: <Sparkles size={16} className="text-blue-400" />,
      description: 'Researching current cultural phenomena, social media movements, and viral content formats'
    },
    { 
      id: 'tech', 
      title: 'Technology Landscape',
      icon: <Database size={16} className="text-blue-400" />,
      description: 'Analyzing cutting-edge technologies, frameworks, and development patterns'
    },
    { 
      id: 'market', 
      title: 'Market Opportunities',
      icon: <Award size={16} className="text-blue-400" />,
      description: 'Identifying business trends, user needs, and potential startup opportunities'
    },
    { 
      id: 'idea', 
      title: 'AI Concept Generation',
      icon: <Lightbulb size={16} className="text-purple-400" />,
      description: 'Synthesizing research into a viral-worthy app concept with creative vision and technical feasibility'
    }
  ];
  
  return (
    <div className="w-full mt-4">
      {/* Progress indicator */}
      <div className="mb-3 flex items-center gap-2">
        <div className="text-xs font-mono text-[rgb(var(--text-secondary))]">
          {ideaGenerating ? 'Generating app concept' : 'Researching trends'}: {Math.round(calculatedProgress)}%
        </div>
        <div className="flex-1 h-1.5 bg-[rgb(var(--surface-1)/0.2)] rounded-full overflow-hidden">
          <motion.div 
            className={`h-full ${ideaGenerating ? 'bg-purple-400/50' : 'bg-blue-400/50'}`}
            initial={{ width: "0%" }}
            animate={{ width: `${calculatedProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      
      {/* Research sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sections.map((section, index) => {
          // Calculate if this section is active
          const isActive = ideaGenerating 
            ? section.id === 'idea' 
            : completedQueries > index 
              ? true 
              : completedQueries === index && isGenerating;
          
          // Get the query that corresponds to this section
          const sectionQuery = queries[index] || null;
          
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`
                relative rounded-lg overflow-hidden
                ${isActive 
                  ? section.id === 'idea' 
                    ? 'glass-effect border-2 border-purple-400/30 animate-pulse' 
                    : 'glass-effect border-2 border-blue-400/30' 
                  : 'glass-effect opacity-50'}
              `}
            >
              <div className="p-4">
                <div className="absolute top-2 right-2">
                  {section.icon}
                </div>
                
                <h3 className="font-mono text-sm font-medium mb-1">{section.title}</h3>
                <p className="text-xs text-[rgb(var(--text-secondary))]">{section.description}</p>
                
                {isActive && (
                  <div className="mt-3">
                    {section.id === 'idea' ? (
                      <motion.div 
                        className="text-xs text-purple-400"
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                      >
                        synthesizing insights...
                      </motion.div>
                    ) : sectionQuery?.completed ? (
                      <div className="text-xs text-blue-400">
                        completed
                      </div>
                    ) : (
                      <motion.div 
                        className="text-xs text-blue-400"
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                      >
                        searching...
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}; 