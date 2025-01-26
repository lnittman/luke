import { motion } from 'framer-motion';
import { Project } from '@/utils/constants/projects';
import { ProjectSection } from './ProjectSection';

interface ProjectContentProps {
  project: Project;
  onShowDemo: () => void;
}

export const ProjectContent = ({ project, onShowDemo }: ProjectContentProps) => {
  return (
    <div className="min-h-[calc(100vh-10rem)] sm:min-h-0 flex flex-col px-4 py-4 mt-16 sm:mt-24">
      <div className="w-full max-w-4xl mx-auto space-y-6 overflow-y-auto sm:overflow-visible">
        <div className="px-4 sm:px-6 md:px-8 space-y-2">
          <h1 className="text-xl sm:text-2xl font-mono">{project.name}</h1>
          <p className="text-sm sm:text-base font-mono text-[rgb(var(--text-primary))]">
            {project.description}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-8 pt-4">
            {project.id === 'squish' && (
              <>
                <a 
                  href="https://squish-web.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm font-mono text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors"
                >
                  app →
                </a>
                <a 
                  href="https://squish-docs.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm font-mono text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors"
                >
                  docs →
                </a>
              </>
            )}
            {project.id === 'drib' && (
              <a 
                href="https://drib-web.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm font-mono text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors"
              >
                app →
              </a>
            )}
            {project.id === 'sine' && (
              <a 
                href="https://www.sine-labs.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm font-mono text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors"
              >
                app →
              </a>
            )}
            {project.videos && project.videos.length > 0 && (
              <button 
                onClick={onShowDemo}
                className="text-xs sm:text-sm font-mono text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors"
              >
                demo →
              </button>
            )}
            {(project.id === 'sine' || project.id === 'helios') && (
              <a 
                href={project.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm font-mono text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors"
              >
                source →
              </a>
            )}
          </div>
        </div>

        <motion.div
          className="relative p-4 sm:p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative z-10 space-y-8">
            {/* Content Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-6">
                <ProjectSection 
                  title={project.content.overview.title} 
                  items={project.content.overview.items}
                />
                <ProjectSection 
                  title={project.content.core.title} 
                  items={project.content.core.items}
                />
              </div>
              <div className="space-y-6">
                <ProjectSection 
                  title={project.content.architecture.title} 
                  items={project.content.architecture.items}
                />
                <ProjectSection 
                  title={project.content.tech.title} 
                  items={project.content.tech.items}
                  isTechSection={true}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}; 