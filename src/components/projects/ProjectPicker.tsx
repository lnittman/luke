import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import clsx from 'clsx';
import { Project } from '@/utils/constants/projects';

interface ProjectPickerProps {
  currentProject: Project;
  onProjectChange: (project: Project) => void;
  projects: Project[];
}

export const ProjectPicker = ({ 
  currentProject, 
  onProjectChange,
  projects
}: ProjectPickerProps) => {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  return (
    <div className="px-4">
      <motion.div 
        className="flex justify-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="relative p-2 rounded-xl glass-effect">
          <div className="relative z-10 flex gap-2">
            {projects.map((project) => (
              <div key={project.id} className="relative group">
                <button
                  onClick={() => onProjectChange(project)}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                  onTouchStart={() => setHoveredProject(project.id)}
                  onTouchEnd={() => setHoveredProject(null)}
                  className={clsx(
                    "relative p-3 rounded-lg transition-all duration-300 select-none touch-none",
                    "hover:bg-white/5 focus:outline-none active:scale-95",
                    currentProject.id === project.id 
                      ? "[text-shadow:0_0_10px_rgba(255,255,255,0.5)]" 
                      : "opacity-40 hover:opacity-60 transition-opacity duration-300"
                  )}
                >
                  <span className="text-[26px] relative select-none touch-none pointer-events-none">
                    {project.emoji}
                    {currentProject.id === project.id && (
                      <motion.div
                        className="absolute inset-0 bg-white/20 blur-xl rounded-full pointer-events-none"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </span>
                </button>

                {/* Tooltip */}
                <AnimatePresence>
                  {hoveredProject === project.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 -translate-x-1/2 top-16 hidden sm:block w-full"
                    >
                      <div className="relative flex flex-col items-center">
                        <div className="px-2.5 py-1.5 rounded-md bg-[rgb(var(--surface-1)/0.9)] backdrop-blur-sm font-mono text-sm lowercase whitespace-nowrap">
                          {project.name.toLowerCase()}
                        </div>
                        <div 
                          className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-[rgb(var(--surface-1)/0.9)]"
                          style={{ backdropFilter: 'blur(8px)' }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}; 