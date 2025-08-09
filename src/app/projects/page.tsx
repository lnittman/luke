import { DefaultLayout } from '@/components/shared/default-layout';
import { FooterNavigation } from '@/components/shared/footer-navigation';
import { BlockLoader } from '@/components/shared/block-loader';
import { ThemeSwitcher } from '@/components/shared/theme-switcher';
import { ProjectAccordion } from '@/components/app/projects/project-accordion';
import { PROJECTS } from '@/constants/projects';
import styles from '@/components/shared/root.module.scss';

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
            {PROJECTS.filter(p => !['voet','helios','cards'].includes(p.id)).map((project) => (
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