import { getRandomZenColor } from '@/utils/colors';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface LinkEmbedProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
}

export function LinkEmbed({ url, title, description, image }: LinkEmbedProps) {
  // Get a fresh random color each render
  const color = getRandomZenColor();
  const bgColor = `rgba(${color.bg}, 0.15)`;
  const glowColor = `rgba(${color.glow}, 0.1)`;
  
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full rounded-xl overflow-hidden no-underline"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      style={{
        background: bgColor,
        boxShadow: `0 0 30px ${glowColor}`,
      }}
    >
      <div className="flex items-center gap-4 p-4">
        {image && (
          <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 relative rounded-lg overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-mono text-[rgb(var(--text-primary))] truncate">
            {title}
          </h3>
          {description && (
            <p className="text-xs sm:text-sm font-mono text-[rgb(var(--text-secondary))] line-clamp-2 mt-1">
              {description}
            </p>
          )}
          <div className="text-xs font-mono text-[rgb(var(--text-secondary))] mt-1 truncate">
            {url.replace(/^https?:\/\//, '')}
          </div>
        </div>
      </div>
    </motion.a>
  );
} 