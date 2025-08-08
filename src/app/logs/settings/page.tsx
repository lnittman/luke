import Link from 'next/link';
import { DefaultLayout } from '@/components/page/DefaultLayout';
import { FooterNavigation } from '@/components/FooterNavigation';
import { BlockLoader } from '@/components/BlockLoader';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import styles from '@/components/page/root.module.scss';
import { SettingsClient } from './settings-client';
import { getSettings } from './actions';

export default async function LogsSettingsPage() {
  const settings = await getSettings();

  return (
    <DefaultLayout>
      <div className={styles.header}>
        <div className={styles.column}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <BlockLoader mode={2} />
            <h1>LOGS SETTINGS</h1>
          </div>
          <ThemeSwitcher />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.innerViewport}>
          {/* Page header with back button */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid rgb(var(--border))'
          }}>
            <Link 
              href="/logs" 
              title="Back to logs"
              aria-label="Back to logs"
              className="back-button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2rem',
                height: '2rem',
                background: 'none',
                border: '1px solid rgb(var(--border))',
                color: 'rgb(var(--text-primary))',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'monospace',
                padding: 0,
                fontSize: '1rem',
                textDecoration: 'none',
              }}
            >
              ←
            </Link>
          </div>

          <SettingsClient initialSettings={settings} />
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