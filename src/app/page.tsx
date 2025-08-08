import { DefaultLayout } from '@/components/page/DefaultLayout';
import { FooterNavigation } from '@/components/FooterNavigation';
import { BlockLoader } from '@/components/BlockLoader';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Accordion } from '@/components/Accordion';
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
          <div className="space-y-0" style={{ marginTop: '0' }}>
            <Accordion title="ABOUT" defaultOpen={true}>
              <p>
                i build production-grade software that makes AI feel more human.
              </p>
              <p>
                currently focused on removing the friction between human intent
                and machine capability. each project is an experiment in translating
                complex interaction patterns to more delightful and instinctive-feeling ones.
              </p>
              <p>
                started my career optimizing video transcoding engines at AWS Elemental,
                then architected distributed systems for address intelligence at Amazon.
                left big tech to try startups, where i could ship faster and own the full stack.
              </p>
              <p>
                now i&apos;m enjoying building my own products. each one explores a simple question:
                how do we make AI feel less like an infinite black box and more like
                a useful friend? the answer is always in the implementation details.
              </p>
            </Accordion>

            <Accordion title="PATTERNS" defaultOpen={true}>
              <p>
                after shipping code at Amazon and AWS, leading teams at startups,
                and building my own products, i&apos;ve noticed the same principles
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
                like black box technology and more like a natural extension of users&apos; creative thought processes.
              </p>
            </Accordion>

            <Accordion title="PHILOSOPHY">
              <p>
                good constraints lead to better products. at Teenage Engineering,
                designers use six colors and one typeface. at Braun, Dieter Rams outlined ten
                fundamental principles of &apos;good design&apos;. i look to apply a similar rigor to AI systems—
                strict rules that paradoxically create more freedom for users.
              </p>
              <p>
                every technical decision is a design decision. the best products
                feel inevitable, like they couldn&apos;t exist any other way. this
                requires obsessing over details that most people never notice.
              </p>
            </Accordion>

            <Accordion title="INTERESTS">
              <ul>
                <li>agentic UI/UX patterns</li>
                <li>semantic interfaces for content and knowledge</li>
                <li>vector databases and embedding systems</li>
                <li>making LLMs feel less like chatbots</li>
                <li>MIDI generation/manipulation, audio synthesis, and real-time processing</li>
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
  );
}
