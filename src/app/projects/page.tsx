'use client';

import { motion } from 'framer-motion';

const projects = [
  {
    name: 'Squish',
    description: 'A modern file sharing and collaboration platform',
    link: 'https://squish.nittmann.xyz'
  },
  {
    name: 'Helios',
    description: 'Advanced development tools and utilities',
    link: 'https://helios.nittmann.xyz'
  },
  {
    name: 'Top',
    description: 'Universal context manager for developers',
    link: 'https://top.nittmann.xyz'
  }
];

export default function Projects() {
  return (
    <motion.div
      className="max-w-4xl mx-auto pt-16"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          Projects
        </h1>
        
        <div className="grid gap-6">
          {projects.map((project) => (
            <motion.a
              key={project.name}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
              <p className="text-white/60">{project.description}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>
  );
} 