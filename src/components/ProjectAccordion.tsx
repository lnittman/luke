'use client';

import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './ProjectAccordion.module.scss';
import { Project } from '@/constants/projects';

interface ProjectAccordionProps {
  project: Project;
  defaultOpen?: boolean;
}

export function ProjectAccordion({ project, defaultOpen = false }: ProjectAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  // Determine the primary link
  const primaryLink = project.appUrl || project.demoUrl || project.sourceUrl;
  const linkText = 'VIEW';

  return (
    <div className={styles.accordion}>
      <button
        className={styles.header}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className={styles.titleWrapper}>
          <div className={styles.titleLine}>
            <span className={styles.emoji}>
              {project.id === 'loops' ? (
                <img src="/assets/loops.png" alt="loops logo" />
              ) : (
                project.emoji
              )}
            </span>
            <span className={styles.name}>{project.name}</span>
          </div>
          <div className={styles.description}>{project.description}</div>
        </div>
        <div className={styles.actions}>
          {primaryLink && (
            <a 
              href={primaryLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.link}
              onClick={(e) => e.stopPropagation()}
            >
              {linkText}
            </a>
          )}
          <span className={styles.arrow}>
            {isOpen ? '▾' : '▸'}
          </span>
        </div>
      </button>
      
      {isOpen && (
        <div className={styles.content}>
          {Object.entries(project.content).map(([key, section]) => (
            <div key={key} className={styles.section}>
              <h3>{section.title.toUpperCase()}</h3>
              <ul>
                {section.items.map((item, idx) => (
                  <li key={idx}>
                    {typeof item === 'string' ? item : (
                      <a 
                        href={item.documentationUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {item.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {/* Additional links if available */}
          <div className={styles.additionalLinks}>
            {project.sourceUrl && project.sourceUrl !== primaryLink && (
              <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                SOURCE CODE →
              </a>
            )}
            {project.demoUrl && project.demoUrl !== primaryLink && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                DEMO →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}