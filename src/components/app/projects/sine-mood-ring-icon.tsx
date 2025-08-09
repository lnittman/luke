'use client'

import styles from './sine-mood-ring-icon.module.scss'

export function SineMoodRingIcon() {
  return (
    <div className={styles.iconWrapper}>
      <svg
        height="24"
        viewBox="0 0 838.79 829.35"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className={styles.moodRing}
          d="m669.44,81.37C530.18-24.38,119.73-93.49,13.97,312.77c-31.13,119.59-6.55,222.7,37.34,302.18,130.76,236.82,449.54,286.24,649.53,104.08,224.46-204.44,146.6-502.48-31.41-637.66Zm-254.44,654.42C-48.99,628.6,274.38-9.99,586.72,108.6c308.89,117.27,145.54,700.49-171.72,627.19Z"
        />
      </svg>
    </div>
  )
}
