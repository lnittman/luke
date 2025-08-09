'use client'

import { motion, type Variants } from 'framer-motion'
import React from 'react'

interface AnimatedGroupProps {
  children: React.ReactNode
  preset?: 'fade' | 'slide' | 'scale' | 'stagger'
  className?: string
  staggerDelay?: number
}

const presets: { [key: string]: { container: Variants; item: Variants } } = {
  fade: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    },
    item: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.5 },
      },
    },
  },
  slide: {
    container: {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: 0.1,
        },
      },
    },
    item: {
      hidden: { opacity: 0, x: -20 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { type: 'spring', stiffness: 100 },
      },
    },
  },
  scale: {
    container: {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: 0.05,
        },
      },
    },
    item: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { type: 'spring', stiffness: 200 },
      },
    },
  },
  stagger: {
    container: {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: 0.15,
        },
      },
    },
    item: {
      hidden: { opacity: 0, y: 50, scale: 0.9 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          type: 'spring',
          damping: 20,
          stiffness: 100,
        },
      },
    },
  },
}

export function AnimatedGroup({
  children,
  preset = 'fade',
  className = '',
  staggerDelay = 0.1,
}: AnimatedGroupProps) {
  const { container, item } = presets[preset]
  const childrenArray = React.Children.toArray(children)

  return (
    <motion.div
      className={className}
      initial="hidden"
      variants={container}
      viewport={{ once: true, amount: 0.3 }}
      whileInView="visible"
    >
      {childrenArray.map((child, index) => (
        <motion.div key={index} variants={item}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
