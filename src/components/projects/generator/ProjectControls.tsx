import React from 'react';
import { motion } from 'framer-motion';
import { Download, Save, X } from 'lucide-react';
import { ProjectControlsProps } from './interfaces';

/**
 * ProjectControls - Button controls for project actions
 */
export const ProjectControls: React.FC<ProjectControlsProps> = ({
  isGenerating,
  isGeneratingDocs,
  hasProject = true,
  projectName,
  onDownloadDocs,
  onSaveProject,
  onCancel
}) => {
  if (!hasProject) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 border-t border-[rgb(var(--border))]"
    >
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onDownloadDocs}
            disabled={isGenerating || isGeneratingDocs}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] hover:bg-[rgb(var(--primary-hover))] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
          
          <button
            onClick={onSaveProject}
            disabled={isGenerating}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-md border border-[rgb(var(--border))] hover:bg-[rgb(var(--muted))] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <Save className="h-4 w-4" />
            <span>Save</span>
          </button>
        </div>
        
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-[rgb(var(--destructive))] hover:bg-[rgb(var(--destructive))] hover:text-[rgb(var(--destructive-foreground))] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          <X className="h-4 w-4" />
          <span>Cancel</span>
        </button>
      </div>
    </motion.div>
  );
}; 