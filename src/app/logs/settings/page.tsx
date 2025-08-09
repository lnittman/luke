import Link from 'next/link';
import { redirect } from 'next/navigation';
import { DefaultLayout } from '@/components/shared/default-layout';
import { FooterNavigation } from '@/components/shared/footer-navigation';
import { BlockLoader } from '@/components/shared/block-loader';
import { ThemeSwitcher } from '@/components/shared/theme-switcher';
import styles from '@/components/shared/root.module.scss';
import { SettingsClient } from './settings-client';
import { getSettings } from './actions';

export default async function LogsSettingsPage() {
  // Redirect to 404 in production
  if (process.env.NODE_ENV === 'production') {
    redirect('/404');
  }

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