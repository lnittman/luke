import { Accordion } from '@/components/app/home/accordion'
import { BlockLoader } from '@/components/shared/block-loader'
import { DefaultLayout } from '@/components/shared/default-layout'
import { FooterNavigation } from '@/components/shared/footer-navigation'
import styles from '@/components/shared/root.module.scss'
import { ThemeSwitcher } from '@/components/shared/theme-switcher'

export default function Home() {
  return (
    <DefaultLayout>
      <div className={styles.header}>
        <div className={styles.column}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <BlockLoader mode={2} />
            <h1>HOME</h1>
          </div>
          <ThemeSwitcher />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.innerViewport}>
          <div className="space-y-0" style={{ marginTop: '0' }}>
            <Accordion defaultOpen={false} title="ABOUT">
              <p>
                i build production-grade software that makes AI feel more human.
              </p>
              <p>
                currently focused on removing the friction between human intent
                and machine capability. each project is an experiment in
                translating complex interaction patterns to more delightful and
                instinctive-feeling ones.
              </p>
              <p>
                started my career optimizing video transcoding engines at AWS
                Elemental, then architected distributed systems for address
                intelligence at Amazon. left big tech to try startups, where i
                could ship faster and own the full stack. now i&apos;m enjoying building my own products.
              </p>
            </Accordion>

            <Accordion defaultOpen={false} title="PATTERNS">
              <ul>
                <li>good engineering is good design</li>
                <li>constraints breed creativity</li>
                <li>the best interface is no interface</li>
              </ul>
            </Accordion>

            <Accordion defaultOpen={false} title="INTERESTS">
              <ul>
                <li>agentic UI/UX patterns</li>
                <li>semantic interfaces for content and knowledge</li>
                <li>vector databases and embedding systems</li>
                <li>making LLMs feel less like chatbots</li>
                <li>
                  MIDI generation/manipulation, audio synthesis, and real-time
                  processing
                </li>
                <li>cross-platform native experiences (iOS/macOS/Web)</li>
                <li>the intersection of taste and technology</li>
              </ul>
            </Accordion>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.column}>
          <FooterNavigation />
        </div>
      </div>
    </DefaultLayout>
  )
}
