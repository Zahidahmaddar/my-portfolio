"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { FaExternalLinkAlt } from "react-icons/fa";
import { motion } from "framer-motion";

// Project Data
const projects = [
  {
    title: "Kupos.cl",
    description: "A modern booking platform for buses and trains in Chile.",
    tech: ["HTML", "JavaScript", "React", "Next"],
    type: "Web App",
    image: "/images/icons/kupos-logo2.svg",
    liveLink: "https://kupos.cl/",
    codeLink: "https://github.com/your-repo",
  },
  {
    title: "Turbus.cl",
    description: "A responsive booking app for bus travel across Chile.",
    tech: ["HTML", "JavaScript", "React", "Next"],
    type: "Web App",
    image: "/images/icons/Turbus-website-home-green-logo.svg",
    liveLink: "https://turbus.cl/",
    codeLink: "https://github.com/your-repo",
  },
  {
    title: "Zipmex",
    description: "Cryptocurrency exchange platform built with Next.js.",
    tech: ["HTML", "CSS", "Redux", "Next.js", "Tailwind CSS"],
    type: "Web App",
    image: "/images/icons/Zipmex-logo.webp",
    liveLink: "#",
    codeLink: "#",
  },
  {
    title: "Kimo",
    description: "AI-powered EdTech platform for personalized learning.",
    tech: ["HTML", "CSS", "Next.js", "Tailwind CSS"],
    type: "EdTech",
    image: "/images/icons/kimo_logo_small.png",
    liveLink: "#",
    codeLink: "#",
  },
];

// Unique filter values
const allTech = [...new Set(projects.flatMap(p => p.tech))];
const allTypes = [...new Set(projects.map(p => p.type))];

// Animation variants
const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const card = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
};

const Projects = () => {
  const [search, setSearch] = useState("");
  const [selectedTech, setSelectedTech] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const filteredProjects = projects.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tech.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesTech = selectedTech ? p.tech.includes(selectedTech) : true;
    const matchesType = selectedType ? p.type === selectedType : true;
    return matchesSearch && matchesTech && matchesType;
  });

  return (
    <>
      <Navbar />
      <div className="h-full">
        <section id="projects" className="py-20 px-6 bg-white dark:bg-black">
          <div className="max-w-[1200px] mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
              Projects
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Things I’ve built so far
            </p>

            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-4 mt-10 mb-10">
              <input
                type="text"
                placeholder="Search by name or tech..."
                className="border px-4 py-2 rounded w-full sm:w-60"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <select
                className="border px-4 py-2 rounded"
                value={selectedTech}
                onChange={e => setSelectedTech(e.target.value)}
              >
                <option value="">All Tech</option>
                {allTech.map(tech => (
                  <option key={tech} value={tech}>
                    {tech}
                  </option>
                ))}
              </select>
              <select
                className="border px-4 py-2 rounded"
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
              >
                <option value="">All Types</option>
                {allTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Project Cards */}
            <motion.div
              className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={container}
              initial="hidden"
              animate="visible"
            >
              {filteredProjects.length > 0 ? (
                filteredProjects.map((proj, idx) => (
                  <motion.div
                    key={idx}
                    variants={card}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:animate-zoomInOut"
                  >
                    <div className="relative h-20 w-[200px] m-auto mt-4">
                      <Image
                        src={proj.image}
                        alt={proj.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="p-5 text-left">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {proj.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                        {proj.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-3">
                        <strong>Tech stack:</strong> {proj.tech.join(", ")}
                      </p>
                      <div className="mt-4 flex space-x-4 flex-wrap">
                        <a
                          href={proj.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm inline-flex items-center gap-1 border px-3 py-1 rounded-full text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <FaExternalLinkAlt /> Live Preview
                        </a>
                        {/* <a
                          href={proj.codeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm inline-flex items-center gap-1 border px-3 py-1 rounded-full text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <FaGithub /> View Code
                        </a> */}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 col-span-full">
                  No projects found.
                </p>
              )}
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Projects;
