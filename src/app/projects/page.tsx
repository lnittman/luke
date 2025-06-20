import { DefaultLayout } from '@/components/page/DefaultLayout';
import { FooterNavigation } from '@/components/FooterNavigation';
import { BlockLoader } from '@/components/BlockLoader';
import { ProjectAccordion } from '@/components/ProjectAccordion';
import { PROJECTS } from '@/constants/projects';
import styles from '@/components/page/root.module.scss';

export default function Projects() {
  return (
    <DefaultLayout>
      <div className={styles.header}>
        <div className={styles.column}>
          <h1>PROJECTS</h1>
          <BlockLoader mode={3} />
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.innerViewport}>
          <div className={styles.row}>
            <div className={styles.column}>
              <div className="mb-8">
                <p className="text-[rgb(var(--text-secondary))]">
                  A collection of software projects spanning AI/ML, web applications, 
                  mobile apps, and developer tools.
                </p>
              </div>
            </div>
          </div>
          
          {/* Projects list with full-width items */}
          <div className="space-y-0">
            {PROJECTS.map((project) => (
              <ProjectAccordion key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.column}>
          <FooterNavigation />
        </div>
      </div>
    </DefaultLayout>
  );
}