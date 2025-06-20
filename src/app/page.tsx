import { DefaultLayout } from '@/components/page/DefaultLayout';
import { FooterNavigation } from '@/components/FooterNavigation';
import { BlockLoader } from '@/components/BlockLoader';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import styles from '@/components/page/root.module.scss';

export default function Home() {
  return (
    <DefaultLayout>
      <div className={styles.header}>
        <div className={styles.column}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <BlockLoader mode={2} />
            <h1>LUKE NITTMANN</h1>
          </div>
          <ThemeSwitcher />
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.innerViewport}>
          <div className={styles.row}>
            <div className={styles.column}>
              <h2>AI ENGINEER</h2>
              <p>
                I build production software that makes AI accessible and useful. 
                Not theoretical—actual tools people use every day.
              </p>
              <p>
                Currently focused on removing the friction between human intent 
                and machine capability. Each project is an experiment in making 
                complex technology feel simple.
              </p>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.column}>
              <h2>PATTERN RECOGNITION</h2>
              <p>
                After shipping code at Amazon and AWS, leading teams at startups, 
                and building my own products, I've noticed the same principles 
                appear across disciplines. Good engineering is good design. 
                Constraints breed creativity. The best interface is no interface.
              </p>
              <p>
                Now I apply these patterns to AI systems—making them feel less 
                like alien technology and more like natural extensions of thought.
              </p>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.column}>
              <h2>CURRENT FOCUS</h2>
              <p>
                Building tools that democratize AI development. From browser-native 
                coding assistants to semantic content networks, each project explores 
                how to make powerful technology accessible without dumbing it down.
              </p>
              <p>
                The goal isn't to build AI for AI's sake, but to create products 
                where the technology disappears into the experience.
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
