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
                Started my career optimizing video transcoding engines at AWS Elemental,
                then architected distributed systems for address intelligence at Amazon.
                Left big tech to try startups, where I could ship faster and own the full stack.
              </p>
              <p>
                Now I'm enjoying building my own products. Each one explores a simple question:
                how do we make AI feel less like an infinite black box and more like
                a useful friend? The answer is always in the implementation details.
              </p>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.column}>
              <h2>ENGINEERING PHILOSOPHY</h2>
              <p>
                Good constraints lead to better products. At Teenage Engineering,
                designers use six colors and one typeface. At Braun, Dieter Rams outlined ten
                fundamental principles of 'good design'. I look to apply a similar rigor to AI systems—
                strict rules that paradoxically create more freedom for users.
              </p>
              <p>
                Every technical decision is a design decision. The best products
                feel inevitable, like they couldn't exist any other way. This
                requires obsessing over details that most people never notice.
              </p>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.column}>
              <h2>CURRENT INTERESTS</h2>
              <ul>
                <li>Agentic UI/UX patterns</li>
                <li>Semantic interfaces for content and knowledge</li>
                <li>Vector databases and embedding systems</li>
                <li>Making LLMs feel less like chatbots</li>
                <li>MIDI generation/manipulation, audio synthesis, and real-time processing</li>
                <li>Cross-platform native experiences (iOS/macOS/Web)</li>
                <li>The intersection of taste and technology</li>
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
