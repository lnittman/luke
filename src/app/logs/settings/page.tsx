import Link from 'next/link'
import { redirect } from 'next/navigation'
import { BlockLoader } from '@/components/shared/block-loader'
import { DefaultLayout } from '@/components/shared/default-layout'
import { FooterNavigation } from '@/components/shared/footer-navigation'
import styles from '@/components/shared/root.module.scss'
import { ThemeSwitcher } from '@/components/shared/theme-switcher'
import { getSettings } from './actions'
import { SettingsClient } from './settings-client'

export default async function LogsSettingsPage() {
  // Redirect to 404 in production
  if (process.env.NODE_ENV === 'production') {
    redirect('/404')
  }

  const settings = await getSettings()

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
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid rgb(var(--border))',
            }}
          >
            <Link
              aria-label="Back to logs"
              className="back-button"
              href="/logs"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2.5rem',
                height: '2.5rem',
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
              title="Back to logs"
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
  )
}
