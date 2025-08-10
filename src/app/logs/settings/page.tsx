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
        <div className={styles.innerViewport} style={{ position: 'relative' }}>
          {/* Back button - sticky under main header */}
          <div
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 80,
              marginBottom: '1.5rem',
              padding: '0.75rem 24px',
              borderBottom: '1px solid rgb(var(--border))',
              backgroundColor: 'rgb(var(--background-start))',
            }}
          >
            <Link
              aria-label="Back to logs"
              href="/logs"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgb(var(--surface-1))'
                e.currentTarget.style.borderColor = 'rgb(var(--accent-1))'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none'
                e.currentTarget.style.borderColor = 'rgb(var(--border))'
              }}
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

          <div className={styles.row}>
            <div className={styles.column}>
              <SettingsClient initialSettings={settings} />
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
