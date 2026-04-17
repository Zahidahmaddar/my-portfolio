"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

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
  side: "left" | "right";
}

const ProjectCard = ({ project, index, side }: ProjectCardProps) => {
  const link = project.liveUrl || project.repoUrl;

  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
      whileHover={{ y: -4 }}
      className="group relative flex items-stretch rounded-xl overflow-hidden bg-white/[0.02] border border-white/[0.06] hover:border-indigo-500/20 hover:shadow-[0_0_40px_rgba(129,140,248,0.08)] transition-all duration-300"
    >
      {/* Project Image */}
      <div className="relative w-44 shrink-0 overflow-hidden hidden sm:block">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#050505]/80" />
      </div>

      {/* Project Content */}
      <div className="flex-1 p-5">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-medium text-indigo-400/60">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>

        <h3 className="text-lg font-bold text-zinc-200 mb-1.5 group-hover:text-white transition-colors">
          {project.title}
        </h3>

        <p className="text-sm text-zinc-500 mb-3 line-clamp-2">
          {project.description}
        </p>

        {/* Tech Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.tech.map((tech, techIndex) => (
            <span
              key={techIndex}
              className="px-2 py-0.5 text-[10px] font-medium text-indigo-300/80 bg-indigo-500/[0.08] border border-indigo-500/10 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* View Project Link */}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-violet-400 transition-colors group/link"
          >
            View Project
            <ArrowRight
              size={12}
              className="group-hover/link:translate-x-1 transition-transform"
            />
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectCard;
