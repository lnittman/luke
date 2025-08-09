import classNames from 'classnames'
import type React from 'react'
import styles from './root.module.scss'

interface DefaultLayoutProps {
  children: React.ReactNode
  className?: string
}

export function DefaultLayout({ children, className }: DefaultLayoutProps) {
  return <div className={classNames(styles.root, className)}>{children}</div>
}
