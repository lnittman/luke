'use client';

import { useState } from 'react';
import styles from './WorkExperience.module.scss';

interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  period: string;
  description?: string;
  highlights: string[];
}

interface WorkExperienceProps {
  experience: Experience;
}

export function WorkExperience({ experience }: WorkExperienceProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.experience}>
      <button
        className={styles.header}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className={styles.titleWrapper}>
          <div className={styles.titleLine}>
            <span className={styles.company}>{experience.company}</span>
            <span className={styles.divider}>—</span>
            <span className={styles.title}>{experience.title}</span>
          </div>
          <div className={styles.metadata}>
            <span className={styles.period}>{experience.period}</span>
            {experience.location && (
              <>
                <span className={styles.separator}>•</span>
                <span className={styles.location}>{experience.location}</span>
              </>
            )}
          </div>
        </div>
        <span className={styles.arrow}>{isOpen ? '↑' : '↓'}</span>
      </button>
      
      {isOpen && (
        <div className={styles.content}>
          {experience.description && (
            <p className={styles.description}>{experience.description}</p>
          )}
          <ul className={styles.highlights}>
            {experience.highlights.map((highlight, index) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}