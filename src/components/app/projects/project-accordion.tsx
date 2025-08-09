'use client';

import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './project-accordion.module.scss';
import { Project } from '@/constants/projects';
import { SineMoodRingIcon } from './sine-mood-ring-icon';

interface ProjectAccordionProps {
  project: Project;
  defaultOpen?: boolean;
}

export function ProjectAccordion({ project, defaultOpen = false }: ProjectAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  // Determine the primary link
  const primaryLink = project.appUrl || project.demoUrl || project.sourceUrl;
  const linkText = 'VIEW';

  const renderTechByCategory = (items: (string | { name: string; documentationUrl: string })[]) => {
    const categories = {
      frontend: [] as typeof items,
      backend: [] as typeof items,
      database: [] as typeof items,
      services: [] as typeof items,
      tools: [] as typeof items
    };

    items.forEach(item => {
      const name = typeof item === 'string' ? item : item.name;
      const lowerName = name.toLowerCase();
      
      if (lowerName.includes('react') || lowerName.includes('next') || lowerName.includes('vue') || 
          lowerName.includes('svelte') || lowerName.includes('angular') || lowerName.includes('tailwind') ||
          lowerName.includes('css') || lowerName.includes('html') || lowerName.includes('sass') ||
          lowerName.includes('framer') || lowerName.includes('motion') || lowerName.includes('ui') ||
          lowerName.includes('preact') || lowerName.includes('swiftui') || lowerName.includes('tone.js') ||
          lowerName.includes('web audio') || lowerName.includes('canvas') || lowerName.includes('webgl')) {
        categories.frontend.push(item);
      } else if (lowerName.includes('fastapi') || lowerName.includes('express') || lowerName.includes('node') ||
                 lowerName.includes('python') || lowerName.includes('rust') || lowerName.includes('swift') ||
                 lowerName.includes('go') || lowerName.includes('java') || lowerName.includes('api') ||
                 lowerName.includes('server') || lowerName.includes('mastra') || lowerName.includes('websocket') ||
                 lowerName.includes('sse') || lowerName.includes('avfoundation') || lowerName.includes('midikit')) {
        categories.backend.push(item);
      } else if (lowerName.includes('postgres') || lowerName.includes('mysql') || lowerName.includes('sqlite') ||
                 lowerName.includes('redis') || lowerName.includes('prisma') || lowerName.includes('database') ||
                 lowerName.includes('neon') || lowerName.includes('supabase') || lowerName.includes('firebase') ||
                 lowerName.includes('pgvector') || lowerName.includes('sqlmodel') || lowerName.includes('swiftdata')) {
        categories.database.push(item);
      } else if (lowerName.includes('vercel') || lowerName.includes('railway') || lowerName.includes('docker') ||
                 lowerName.includes('aws') || lowerName.includes('gcp') || lowerName.includes('azure') ||
                 lowerName.includes('clerk') || lowerName.includes('auth') || lowerName.includes('stripe') ||
                 lowerName.includes('openai') || lowerName.includes('anthropic') || lowerName.includes('gemini') ||
                 lowerName.includes('vertex') || lowerName.includes('openrouter') || lowerName.includes('liveblocks') ||
                 lowerName.includes('posthog') || lowerName.includes('sentry') || lowerName.includes('cloud')) {
        categories.services.push(item);
      } else {
        categories.tools.push(item);
      }
    });

    return (
      <>
        {Object.entries(categories).map(([category, items]) => 
          items.length > 0 && (
            <div key={category} className={styles.techCategory}>
              <em>{category}:</em> {items.map((item, idx) => (
                <span key={idx}>
                  {typeof item === 'string' ? item : (
                    <a 
                      href={item.documentationUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {item.name}
                    </a>
                  )}
                  {idx < items.length - 1 && ', '}
                </span>
              ))}
            </div>
          )
        )}
      </>
    );
  };

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
              {project.id === 'sine' ? (
                <SineMoodRingIcon />
              ) : ['loops', 'arbor', 'voet', 'ther', 'webs-xyz', 'react-llm'].includes(project.id) ? (
                <img src={`/assets/${project.id === 'webs-xyz' ? 'webs' : project.id}.png`} alt={`${project.name} logo`} />
              ) : (
                project.emoji
              )}
            </span>
            {primaryLink ? (
              <a 
                href={primaryLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.name}
                onClick={(e) => e.stopPropagation()}
              >
                {project.name}
              </a>
            ) : (
              <span className={styles.name}>{project.name}</span>
            )}
          </div>
          <div className={styles.description}>{project.description}</div>
        </div>
        <div className={styles.actions}>
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
              {key === 'tech' ? (
                <div className={styles.techGrid}>
                  {renderTechByCategory(section.items)}
                </div>
              ) : (
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
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}