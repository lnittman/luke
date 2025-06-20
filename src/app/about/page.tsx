import { DefaultLayout } from '@/components/page/DefaultLayout';
import { FooterNavigation } from '@/components/FooterNavigation';
import { BlockLoader } from '@/components/BlockLoader';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import styles from '@/components/page/root.module.scss';

export default function About() {
  return (
    <DefaultLayout>
      <div className={styles.header}>
        <div className={styles.column}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <BlockLoader mode={1} />
            <h1>ABOUT</h1>
          </div>
          <ThemeSwitcher />
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.innerViewport}>
          <div className={styles.row}>
            <div className={styles.column}>
              <h2>BACKGROUND</h2>
              <p>
                Software engineer with a focus on AI/ML systems and developer tools. 
                I build full-stack applications that solve real problems, from semantic 
                social networks to AI-powered development companions.
              </p>
              <p>
                My work spans web applications, mobile apps, and machine learning 
                systems. I'm particularly interested in how AI can enhance developer 
                productivity and create more intuitive user experiences.
              </p>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.column}>
              <h2>APPROACH</h2>
              <p>
                I believe technology should amplify human creativity and reduce 
                friction in creative processes. The best tools are invisible—they 
                work so seamlessly that users can focus entirely on their goals 
                rather than the mechanics of achievement.
              </p>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.column}>
              <h2>INTERESTS</h2>
              <ul>
                <li>Machine Learning & AI Systems</li>
                <li>Developer Experience & Tooling</li>
                <li>Full-Stack Web Development</li>
                <li>Mobile Application Development</li>
                <li>Audio/Music Technology</li>
                <li>Real-time Data Processing</li>
                <li>Semantic Search & NLP</li>
                <li>UI/UX Design</li>
              </ul>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.column}>
              <h2>CONTACT</h2>
              <p>
                Email: <a href="mailto:luke.nittmann@gmail.com">luke.nittmann@gmail.com</a><br />
                GitHub: <a href="https://github.com/lnittman" target="_blank" rel="noopener noreferrer">@lnittman</a>
              </p>
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