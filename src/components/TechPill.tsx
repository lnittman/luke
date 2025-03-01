import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { getZenColor } from '@/utils/colors';
import clsx from 'clsx';

export interface TechPillProps {
  text: string;
  index?: number;
  onClick?: () => void;
  isActive?: boolean;
  containerWidth?: number;
}

// Function to map tech names to official websites
function getTechUrl(tech: string): string {
  const techMap: Record<string, string> = {
    // General technologies
    'react': 'https://react.dev',
    'next.js': 'https://nextjs.org',
    'typescript': 'https://www.typescriptlang.org',
    'javascript': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    'python': 'https://www.python.org',
    'tailwind': 'https://tailwindcss.com',
    'rust': 'https://www.rust-lang.org',
    'postgresql': 'https://www.postgresql.org',
    'prisma': 'https://www.prisma.io',
    'redis': 'https://redis.io',
    'upstash': 'https://upstash.com',
    'framer motion': 'https://www.framer.com/motion',
    'motion': 'https://www.framer.com/motion',
    'zustand': 'https://github.com/pmndrs/zustand',
    'swr': 'https://swr.vercel.app',
    'cheerio': 'https://cheerio.js.org',
    'vercel': 'https://vercel.com',
    'docker': 'https://www.docker.com',
    'jina': 'https://jina.ai',
    'swift': 'https://developer.apple.com/swift',
    'turbo': 'https://turbo.build',
    'turborepo': 'https://turbo.build',
    'fastapi': 'https://fastapi.tiangolo.com',
    'alembic': 'https://alembic.sqlalchemy.org',
    'sqlmodel': 'https://sqlmodel.tiangolo.com',
    'pgvector': 'https://github.com/pgvector/pgvector',
    'railway': 'https://railway.app',
    'neon': 'https://neon.tech',
    'clerk': 'https://clerk.com',
    'liveblocks': 'https://liveblocks.io',
    'gemini api': 'https://ai.google.dev/gemini-api',
    'openai': 'https://openai.com',
    'vertexai': 'https://cloud.google.com/vertex-ai',
    'ast': 'https://en.wikipedia.org/wiki/Abstract_syntax_tree',
    'markdown': 'https://www.markdownguide.org',
    'vapor': 'https://vapor.codes',
    's3': 'https://aws.amazon.com/s3',
    'worker': 'https://workers.cloudflare.com',
    'streams': 'https://developer.mozilla.org/en-US/docs/Web/API/Streams_API',
    'audio tools': 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API',
    'video server': 'https://github.com/topics/video-server',
    'webkit': 'https://webkit.org',
    
    // Interests from the home page
    'books': 'https://www.goodreads.com',
    'product': 'https://www.productboard.com',
    'engineering': 'https://github.com',
    'design': 'https://www.figma.com',
    'ux': 'https://www.nngroup.com',
    'ai': 'https://ai.google.dev',
    'audio': 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API',
    'vim': 'https://www.vim.org',

    // Loops technologies
    'tone.js': 'https://tonejs.github.io/',
    'web audio api': 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API',
    'spleeter': 'https://github.com/deezer/spleeter',
    'vercel kv': 'https://vercel.com/docs/storage/vercel-kv',
    'vercel blob storage': 'https://vercel.com/docs/storage/vercel-blob',
  };

  return techMap[tech.toLowerCase()] || 'https://www.google.com/search?q=' + encodeURIComponent(tech);
}

export function TechPill({ text, index = 0, onClick, isActive = false, containerWidth = 0 }: TechPillProps) {
  const randomRotation = useMemo(() => 
    (Math.random() * 6 - 3) * (Math.random() > 0.5 ? 1 : -1), 
    []
  );

  const color = useMemo(() => 
    getZenColor(text, index),
    [text, index]
  );

  // Spring configuration for smooth transitions
  const springConfig = {
    type: "spring" as const,
    stiffness: 500,
    damping: 30, // Increased damping for less bouncy motion
    mass: 0.7,    // Reduced mass for quicker settling
    restDelta: 0.001, // Ensures animation completes fully
    restSpeed: 0.001  // Ensures animation settles completely
  };

  // Enhanced animation states with improved transitions
  const variants = {
    initial: {
      backgroundColor: `rgb(${color.bg} / 0)`,
      color: `rgb(${color.text} / 0.5)`,
      boxShadow: `0 0 0 0 rgb(${color.glow} / 0)`,
      textShadow: `0 0 0 rgb(${color.glow} / 0)`,
      scale: 0.97, // Slightly larger initial scale to reduce appearance of scaling
      rotate: 0
    },
    animate: {
      backgroundColor: `rgb(${color.bg} / ${isActive ? 0.5 : 0.2})`,
      color: `rgb(${color.text} / ${isActive ? 1 : 0.85})`,
      boxShadow: `0 0 ${isActive ? '35px' : '15px'} 0 rgb(${color.glow} / ${isActive ? 0.35 : 0.1})`,
      textShadow: `0 0 ${isActive ? '25px' : '10px'} rgb(${color.glow} / ${isActive ? 0.8 : 0.4})`,
      scale: isActive ? 1.05 : 1, // Reduced from 1.1 to 1.05
      rotate: isActive ? randomRotation * 0.3 : 0, // Reduced rotation
      transition: {
        duration: 0.3, // Slightly faster
        delay: index * 0.05,
        ease: [0.23, 1, 0.32, 1],
        scale: springConfig,
        rotate: springConfig,
        backgroundColor: { duration: 0.3 },
        boxShadow: { duration: 0.5 },
        textShadow: { duration: 0.5 }
      }
    },
    hover: {
      backgroundColor: `rgb(${color.bg} / ${isActive ? 0.7 : 0.35})`,
      color: `rgb(${color.text})`,
      boxShadow: `0 0 ${isActive ? '45px' : '20px'} 0 rgb(${color.glow} / ${isActive ? 0.5 : 0.2})`,
      textShadow: `0 0 ${isActive ? '30px' : '12px'} rgb(${color.glow} / ${isActive ? 1 : 0.6})`,
      rotate: isActive ? randomRotation * 0.4 : randomRotation * 0.6, // Less rotation
      scale: isActive ? 1.07 : 1.08, // Reduced from 1.12/1.15 to 1.07/1.08
      transition: {
        ...springConfig,
        damping: 25, // Slightly different damping for hover
      }
    },
    tap: {
      scale: 0.96, // Less scale down on tap (was 0.95)
      rotate: randomRotation * 0.2, // Less rotation
      transition: {
        ...springConfig,
        damping: 15, // Still bouncy for tap response
      }
    }
  };

  // Get the URL for the tech
  const techUrl = useMemo(() => getTechUrl(text), [text]);

  // Create a component that handles both onClick and external link
  const MotionLink = useMemo(() => {
    return ({ children, ...props }: any) => (
      <motion.a
        href={techUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          // Prevent the default link behavior if we have an onClick handler
          if (onClick) {
            e.preventDefault();
            onClick();
          }
        }}
        {...props}
      >
        {children}
      </motion.a>
    );
  }, [techUrl, onClick]);

  // Calculate fluid font and padding sizes based on container width
  const getFontSize = () => {
    if (containerWidth <= 0) return 'text-[0.6rem]';
    
    if (containerWidth < 200) return 'text-[0.5rem]';
    if (containerWidth < 300) return 'text-[0.55rem]';
    if (containerWidth < 400) return 'text-[0.6rem]';
    return 'text-xs';
  };

  const getPadding = () => {
    if (containerWidth <= 0) return 'px-1 py-0.5';
    
    if (containerWidth < 200) return 'px-0.5 py-[0.125rem]';
    if (containerWidth < 300) return 'px-1 py-0.5';
    if (containerWidth < 400) return 'px-1.5 py-0.5';
    return 'px-2 py-1';
  };

  return (
    <MotionLink
      className={clsx(
        "rounded-full cursor-pointer select-none font-mono tracking-tight",
        getFontSize(),
        getPadding()
      )}
      variants={variants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      style={{
        transform: 'translateZ(0)', // Hardware acceleration
        willChange: 'transform, opacity, background-color, box-shadow', // Optimize animations
        transformOrigin: 'center', // Ensures scaling from center
        backfaceVisibility: 'hidden', // Prevents flickering in some browsers
        textDecoration: 'none', // Remove default link underline
      }}
    >
      {text}
    </MotionLink>
  );
}
