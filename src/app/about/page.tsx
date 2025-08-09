import { BlockLoader } from '@/components/shared/block-loader'
import { DefaultLayout } from '@/components/shared/default-layout'
import { FooterNavigation } from '@/components/shared/footer-navigation'
import styles from '@/components/shared/root.module.scss'
import { ThemeSwitcher } from '@/components/shared/theme-switcher'

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
                started my career optimizing video transcoding engines at AWS
                Elemental, then architected distributed systems for address
                intelligence at Amazon. left big tech to try startups, where i
                could ship faster and own the full stack.
              </p>
              <p>
                now i&apos;m enjoying building my own products. each one
                explores a simple question: how do we make AI feel less like an
                infinite black box and more like a useful friend? the answer is
                always in the implementation details.
              </p>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.column}>
              <h2>ENGINEERING PHILOSOPHY</h2>
              <p>
                good constraints lead to better products. at Teenage
                Engineering, designers use six colors and one typeface. at
                Braun, Dieter Rams outlined ten fundamental principles of
                &apos;good design&apos;. i look to apply a similar rigor to AI
                systems— strict rules that paradoxically create more freedom for
                users.
              </p>
              <p>
                every technical decision is a design decision. the best products
                feel inevitable, like they couldn&apos;t exist any other way.
                this requires obsessing over details that most people never
                notice.
              </p>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.column}>
              <h2>CURRENT INTERESTS</h2>
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
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.column}>
              <h2>CONTACT</h2>
              <p>
                Email:{' '}
                <a href="mailto:luke.nittmann@gmail.com">
                  luke.nittmann@gmail.com
                </a>
                <br />
                GitHub:{' '}
                <a
                  href="https://github.com/lnittman"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  @lnittman
                </a>
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
  )
}
