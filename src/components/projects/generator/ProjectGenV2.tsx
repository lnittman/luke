import React from 'react';
import { AnimatePresence } from 'framer-motion';

// Components
import { ProjectLayout, LeftPanel, RightPanel } from './ProjectLayout';
import { TechStackSelector } from './TechStackSelector';
import { ProjectForm } from './ProjectForm';
import { DocumentViewer } from './DocumentViewer';
import { MessageList } from './MessageList';
import { SearchResultsDisplay } from './SearchResultsDisplay';
import { ProjectControls } from './ProjectControls';

// Hooks
import { useProjectGeneration } from './hooks/useProjectGeneration';
import { useIdeaGeneration } from './hooks/useIdeaGeneration';

/**
 * ProjectGenV2 - Enhanced project generator with modular architecture
 * Uses custom hooks and stores for state management
 */
const ProjectGenV2: React.FC = () => {
  // Project generation functionality
  const {
    project,
    projectName,
    inputValue,
    isGenerating,
    isGeneratingDocs,
    selectedTechStack,
    selectedTechs,
    discoveredTechs,
    documents,
    setProjectName,
    setInputValue,
    setSelectedTechStack,
    setSelectedTechs,
    handleSubmit,
    generateAndDownloadDocs
  } = useProjectGeneration();
  
  // Idea generation functionality
  const {
    isGeneratingIdea,
    searchProgress,
    searchResults,
    generateRandomAppIdea,
    handleDiscoveredTechClick
  } = useIdeaGeneration();
  
  return (
    <ProjectLayout>
      <LeftPanel>
        {/* Tech Stack Selection */}
        <TechStackSelector
          selectedTechStack={selectedTechStack}
          setSelectedTechStack={setSelectedTechStack}
          selectedTechs={selectedTechs}
          setSelectedTechs={setSelectedTechs}
        />
        
        {/* Project Details Form */}
        <ProjectForm
          projectName={projectName}
          setProjectName={setProjectName}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSubmit={handleSubmit}
          isGenerating={isGenerating}
          generateRandomAppIdea={generateRandomAppIdea}
          isGeneratingIdea={isGeneratingIdea}
        />
        
        {/* Idea Generation Results */}
        <AnimatePresence>
          {isGeneratingIdea && (
            <SearchResultsDisplay
              searchProgress={searchProgress}
              discoveredTechs={discoveredTechs}
              searchResults={searchResults}
              handleDiscoveredTechClick={handleDiscoveredTechClick}
            />
          )}
        </AnimatePresence>
        
        {/* Project Controls */}
        {project && (
          <ProjectControls
            isGenerating={isGenerating}
            isGeneratingDocs={isGeneratingDocs}
            projectName={projectName}
            onDownloadDocs={() => generateAndDownloadDocs(project)}
            onSaveProject={() => {
              // TODO: Implement save project functionality
              console.log('Saving project:', project);
            }}
            onCancelProject={() => {
              // TODO: Implement cancel project functionality
              console.log('Canceling project');
            }}
          />
        )}
      </LeftPanel>
      
      <RightPanel>
        {/* Document Viewer */}
        <DocumentViewer
          documents={documents}
          isGenerating={isGenerating}
        />
        
        {/* Message List */}
        <MessageList
          messages={[]} // TODO: Implement message functionality
        />
      </RightPanel>
    </ProjectLayout>
  );
};

export default ProjectGenV2; 