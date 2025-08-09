'use client'

import {
  motion,
  useAnimationControls,
  useScroll,
  useTransform,
} from 'framer-motion'
import dynamic from 'next/dynamic'
import React, { Suspense, useEffect, useRef } from 'react'
import { FloatingScene } from '@/components/app/scroll/floating-scene'
import { projectIcons } from '@/components/app/scroll/project-icons'
import { LenisProvider } from '@/components/shared/lenis-provider'
import { BlockLoader } from '@/components/ui/motion'
import { PROJECTS } from '@/constants/projects'

// Dynamically import components with SSR disabled
const FluidCanvas = dynamic(
  () => import('@/components/app/scroll/fluid-canvas'),
  {
    ssr: false,
    loading: () => null,
  }
)

function ProjectIcon({
  project,
  index,
}: {
  project: (typeof PROJECTS)[0]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['20%', '-20%'])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])

  const Icon3D = projectIcons[project.id as keyof typeof projectIcons]

  return (
    <motion.section
      className="flex min-h-[100vh] items-center justify-center px-6"
      ref={ref}
    >
      <motion.div
        className="mx-auto w-full max-w-4xl"
        style={{ y, opacity, scale }}
      >
        <div className="flex flex-col items-center">
          {/* 3D Project Icon */}
          <div className="mb-12 h-[300px] md:h-[400px]">
            <Suspense
              fallback={
                <div className="flex h-full items-center justify-center">
                  <BlockLoader className="text-4xl" mode={index % 11} />
                </div>
              }
            >
              {Icon3D && (
                <FloatingScene
                  cameraPosition={[0, 0, 5]}
                  enableControls={false}
                >
                  <Icon3D />
                </FloatingScene>
              )}
            </Suspense>
          </div>

          {/* Project Name */}
          <motion.h2
            animate={{ opacity: [0, 1] }}
            className="text-center font-mono text-3xl lowercase md:text-5xl"
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {project.name}
          </motion.h2>
        </div>
      </motion.div>
    </motion.section>
  )
}

function ScrollIndicator() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, 100])

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="-translate-x-1/2 fixed bottom-8 left-1/2 z-50 transform"
      initial={{ opacity: 0 }}
      transition={{ delay: 1 }}
    >
      <motion.div
        animate={{ y: [0, 10, 0] }}
        className="flex flex-col items-center gap-2"
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        <motion.div className="h-10 w-6 rounded-full border-2 border-[rgb(var(--accent-1))] p-1">
          <motion.div
            className="h-2 w-2 rounded-full bg-[rgb(var(--accent-1))]"
            style={{ y }}
          />
        </motion.div>
        <span className="font-mono text-[rgb(var(--text-secondary))] text-xs">
          scroll
        </span>
      </motion.div>
    </motion.div>
  )
}

export default function ScrollPage() {
  // Override body overflow for this page
  React.useEffect(() => {
    document.body.style.overflow = 'auto'
    document.body.style.height = 'auto'
    document.documentElement.style.overflow = 'auto'
    document.documentElement.style.height = 'auto'

    return () => {
      document.body.style.overflow = ''
      document.body.style.height = ''
      document.documentElement.style.overflow = ''
      document.documentElement.style.height = ''
    }
  }, [])

  return (
    <LenisProvider>
      <div className="min-h-screen overflow-x-hidden">
        {/* Simple gradient background */}
        <div className="fixed inset-0 bg-gradient-to-br from-[rgb(var(--background-start))] to-[rgb(var(--background-end))]" />

        {/* Content */}
        <div className="relative z-10">
          <ScrollIndicator />

          {PROJECTS.map((project, index) => (
            <ProjectIcon index={index} key={project.id} project={project} />
          ))}
        </div>
      </div>
    </LenisProvider>
  )
}
