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
                i build production-grade software that makes AI feel more human.
              </p>
              <p>
                currently focused on removing the friction between human intent
                and machine capability. each project is an experiment in translating
                complex interaction patterns to more delightful and instinctive-feeling ones.
              </p>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.column}>
              <h2>PATTERN RECOGNITION</h2>
              <p>
                after shipping code at Amazon and AWS, leading teams at startups,
                and building my own products, i've noticed the same principles
                appear across disciplines:
              </p>

              <p>
                good engineering is good design.
              </p>

              <p>
                constraints breed creativity.
              </p>

              <p>
                the best interface is no interface.
              </p>

              <p>
                i enjoy applying these patterns in building LLM integrations into my products — making it feel less
                like black box technology and more like a natural extension of users' creative thought processes.
              </p>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.column}>
              <h2>CURRENT FOCUS</h2>
              <p>
                how to make powerful technology accessible, without dumbing it down?
              </p>
              <p>
                the goal isn't to build for AI's sake, but to create products
                that disappear into the experience.
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
