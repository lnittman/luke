import { DefaultLayout } from '@/components/page/DefaultLayout';
import { FooterNavigation } from '@/components/FooterNavigation';
import { BlockLoader } from '@/components/BlockLoader';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { ProjectAccordion } from '@/components/ProjectAccordion';
import { PROJECTS } from '@/constants/projects';
import styles from '@/components/page/root.module.scss';

export default function Projects() {
  return (
    <DefaultLayout>
      <div className={styles.header}>
        <div className={styles.column}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <BlockLoader mode={3} />
            <h1>PROJECTS</h1>
          </div>
          <ThemeSwitcher />
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.innerViewport}>
          {/* intro removed per spec */}
          
          {/* Projects list with full-width items */}
          <div className="space-y-0" style={{ marginTop: '0' }}>
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