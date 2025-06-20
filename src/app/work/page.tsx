import { DefaultLayout } from '@/components/page/DefaultLayout';
import { FooterNavigation } from '@/components/FooterNavigation';
import { BlockLoader } from '@/components/BlockLoader';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { WorkExperience } from '@/components/work/WorkExperience';
import { WORK_EXPERIENCES } from '@/constants/work';
import styles from '@/components/page/root.module.scss';

export default function Work() {
  return (
    <DefaultLayout>
      <div className={styles.header}>
        <div className={styles.column}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <BlockLoader mode={4} />
            <h1>WORK</h1>
          </div>
          <ThemeSwitcher />
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.innerViewport}>
        <div className={styles.row} style={{ paddingBottom: '0', borderBottom: '1px solid rgb(var(--border))' }}>
          <div className={styles.column}>
            <h2 style={{ marginBottom: '0' }}>EXPERIENCE</h2>
          </div>
        </div>
        
        <div className="space-y-0" style={{ marginTop: '0' }}>
          {WORK_EXPERIENCES.map((experience) => (
            <WorkExperience key={experience.id} experience={experience} />
          ))}
        </div>

        <div className={styles.row} style={{ paddingBottom: '0', borderBottom: '1px solid rgb(var(--border))' }}>
          <div className={styles.column}>
            <h2 style={{ marginBottom: '0' }}>SKILLS</h2>
          </div>
        </div>
        
        <div className={styles.row}>
          <div className={styles.column}>
            <h3>Languages</h3>
            <p>TypeScript, Python, Swift, Rust, JavaScript, SQL</p>
            
            <h3>Frontend</h3>
            <p>React, Next.js, SwiftUI, TailwindCSS, Framer Motion, WebGL</p>
            
            <h3>Backend</h3>
            <p>FastAPI, Node.js, PostgreSQL, Redis, Vector DBs, WebSockets</p>
            
            <h3>AI/ML</h3>
            <p>OpenAI API, Vertex AI, Embeddings, LLM Integration, Semantic Search</p>
            
            <h3>Tools</h3>
            <p>Docker, Vercel, Railway, Prisma, Turborepo, Git</p>
            
            <h3>Mobile</h3>
            <p>iOS Development, React Native, Audio Processing, Core Data</p>
          </div>
        </div>

        <div className={styles.row} style={{ paddingBottom: '0', borderBottom: '1px solid rgb(var(--border))' }}>
          <div className={styles.column}>
            <h2 style={{ marginBottom: '0' }}>EDUCATION</h2>
          </div>
        </div>
        
        <div className={styles.row}>
          <div className={styles.column}>
            <h3>University of Michigan, Ann Arbor</h3>
            <p>BSc in Computer Science and German Studies (2017)</p>
          </div>
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