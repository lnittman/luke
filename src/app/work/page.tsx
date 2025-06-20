import { DefaultLayout } from '@/components/page/DefaultLayout';
import { FooterNavigation } from '@/components/FooterNavigation';
import { BlockLoader } from '@/components/BlockLoader';
import styles from '@/components/page/root.module.scss';

export default function Work() {
  return (
    <DefaultLayout>
      <div className={styles.header}>
        <div className={styles.column}>
          <h1>WORK</h1>
          <BlockLoader mode={4} />
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.innerViewport}>
        <div className={styles.row}>
          <div className={styles.column}>
            <h2>EXPERIENCE</h2>
            
            <h3>Independent Developer — 2023 to Present</h3>
            <p>
              Building AI-powered developer tools and applications. Focus on full-stack 
              web development, mobile applications, and machine learning systems.
            </p>
            <ul>
              <li>Developed 8+ production applications across web, mobile, and AI domains</li>
              <li>Built semantic social networks and AI development companions</li>
              <li>Created audio processing applications and developer productivity tools</li>
              <li>Implemented machine learning pipelines for content analysis and search</li>
            </ul>

            <h3>Titles, Inc. — Senior Software Engineer</h3>
            <p className="text-secondary">Remote | May 2024 - November 2024</p>
            <ul>
              <li>Led development of cross-platform notification system for web3 image generation platform</li>
              <li>Built semantic image search system with Gemini multimodal embeddings and agentic asset organization</li>
              <li>Architected full-stack features across iOS, web, and backend systems</li>
            </ul>

            <h3>Stems Labs — Senior Software Engineer</h3>
            <p className="text-secondary">Remote | November 2022 - February 2024</p>
            <ul>
              <li>Led creation and development of Stem Studio, a mobile audio remixing platform</li>
              <li>Architected full-stack system for professional audio processing with intelligent agents for effects recommendation</li>
              <li>Integrated Python audio models and CoreML for on-device audio processing</li>
              <li>Optimized processing costs through AI-powered effects generation</li>
              <li>Built integration layer supporting major streaming platforms (Spotify, Apple Music)</li>
            </ul>

            <h3>Amazon, Inc. — Software Engineer, Address Intelligence</h3>
            <p className="text-secondary">Portland, OR | June 2019 - December 2021</p>
            <ul>
              <li>Promoted to SDE II within 18 months</li>
              <li>Architected address management system for delivery route optimization</li>
              <li>Improved cross-region performance through stack regionalization</li>
              <li>Built self-service permission system automating internal workflows</li>
              <li>Maintained high service reliability across multiple regions</li>
              <li>Led migration from monolith to microservices architecture</li>
            </ul>

            <h3>AWS Elemental — Software Engineer, AWS MediaConvert</h3>
            <p className="text-secondary">Portland, OR | January 2018 - June 2019</p>
            <ul>
              <li>Optimized video transcoding engine for improved performance</li>
              <li>Rewrote Quicktime decoder enhancing metadata parsing accuracy</li>
              <li>Developed automated testing framework for validation components</li>
              <li>Resolved customer issues through direct support and code changes</li>
            </ul>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.column}>
            <h2>SKILLS</h2>
            
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

        <div className={styles.row}>
          <div className={styles.column}>
            <h2>EDUCATION</h2>
            <h3>University of Michigan, Ann Arbor</h3>
            <p>BSc in Computer Science and German Studies (2017)</p>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.column}>
            <h2>RESUME</h2>
            <p>
              <a href="https://github.com/lnittman/resume" target="_blank" rel="noopener noreferrer">
                View Resume Repository →
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
  );
}