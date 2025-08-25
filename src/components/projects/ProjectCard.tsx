'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ExternalLink, Github } from 'lucide-react';

interface ProjectCardProps {
  project: {
    _id: string;
    title: string;
    description: string;
    tech: string[];
    image: string;
    repoUrl?: string;
    liveUrl?: string;
  };
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative rounded-xl overflow-hidden transition-all duration-300
        backdrop-blur-[var(--glass-blur)] bg-[var(--glass-background)]
        border border-[var(--glass-border)] shadow-[var(--glass-shadow)]
        hover:shadow-xl"
    >
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
        
        {/* Overlay Links */}
        <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/90 dark:bg-gray-900/90 rounded-full text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label="View repository"
            >
              <Github size={18} />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/90 dark:bg-gray-900/90 rounded-full text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label="View live demo"
            >
              <ExternalLink size={18} />
            </a>
          )}
        </div>
      </div>

      {/* Project Content */}
      <div className="p-6 bg-transparent transition-colors duration-300">
        <h3 className="text-xl font-bold text-[var(--card-text)] mb-2 group-hover:text-blue-600 transition-colors">
          {project.title}
        </h3>
        
        <p className="text-[var(--card-text-secondary)] mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.map((tech, techIndex) => (
            <span
              key={techIndex}
              className="px-3 py-1 text-xs font-medium backdrop-blur-sm bg-blue-100/70 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-full border border-blue-200/50 dark:border-blue-800/50"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action Links - Neumorphic style */}
        <div className="flex space-x-4">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg
                bg-[var(--neu-background)] text-[var(--card-text-secondary)]
                shadow-[4px_4px_10px_var(--neu-shadow-dark),_-4px_-4px_10px_var(--neu-shadow-light)]
                hover:shadow-[2px_2px_5px_var(--neu-shadow-dark),_-2px_-2px_5px_var(--neu-shadow-light)]
                hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
            >
              <Github size={16} />
              <span className="text-sm font-medium">Code</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg
                bg-[var(--neu-background)] text-[var(--card-text-secondary)]
                shadow-[4px_4px_10px_var(--neu-shadow-dark),_-4px_-4px_10px_var(--neu-shadow-light)]
                hover:shadow-[2px_2px_5px_var(--neu-shadow-dark),_-2px_-2px_5px_var(--neu-shadow-light)]
                hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
            >
              <ExternalLink size={16} />
              <span className="text-sm font-medium">Live Demo</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
