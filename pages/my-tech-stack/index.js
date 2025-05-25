import Navbar from "@/components/Navbar";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const techIcons = [
  {
    src: "/images/icons/icons8-html.svg",
    alt: "HTML",
    level: "Advanced",
    description: "Markup language for structuring web pages.",
    category: "frontend",
  },
  {
    src: "/images/icons/icons8-css.svg",
    alt: "CSS",
    level: "Advanced",
    description: "Stylesheet language for designing layouts.",
    category: "frontend",
  },
  {
    src: "/images/icons/icons8-javascript.svg",
    alt: "JavaScript",
    level: "Advanced",
    description: "Scripting language for dynamic web apps.",
    category: "frontend",
  },
  {
    src: "/images/icons/typescript.svg",
    alt: "TypeScript",
    level: "Intermediate",
    description: "Typed superset of JavaScript.",
    category: "frontend",
  },
  {
    src: "/images/icons/react-2.svg",
    alt: "React",
    level: "Advanced",
    description: "JavaScript library for building UIs.",
    category: "frontend",
  },
  {
    src: "/images/icons/redux-logo-svgrepo-com.svg",
    alt: "Redux",
    level: "Intermediate",
    description: "State management for React.",
    category: "frontend",
  },
  {
    src: "/images/icons/bootstrap-4.svg",
    alt: "Bootstrap",
    level: "Intermediate",
    description: "CSS framework for responsive design.",
    category: "frontend",
  },
  {
    src: "/images/icons/tailwind-css-icon.svg",
    alt: "Tailwind CSS",
    level: "Advanced",
    description: "Utility-first CSS framework.",
    category: "frontend",
  },
  {
    src: "/images/icons/git-icon-logo-svgrepo-com.svg",
    alt: "Git",
    level: "Advanced",
    description: "Version control system.",
    category: "tools",
  },
  {
    src: "/images/icons/icons8-visual-studio-code.svg",
    alt: "VS Code",
    level: "Advanced",
    description: "Popular code editor.",
    category: "tools",
  },
  {
    src: "/images/icons/github-icon-1-logo-svgrepo-com.svg",
    alt: "GitHub",
    level: "Advanced",
    description: "Code hosting platform.",
    category: "tools",
  },
  {
    src: "/images/icons/react-2.svg",
    alt: "React Native",
    level: "Intermediate",
    description: "Mobile development framework.",
    category: "frontend",
  },
];

const getCategoryShadow = category => {
  switch (category) {
    case "frontend":
      return "hover:shadow-[0_0_15px_#3b82f6]";
    case "backend":
      return "hover:shadow-[0_0_15px_#10b981]";
    case "tools":
      return "hover:shadow-[0_0_15px_#a855f7]";
    default:
      return "hover:shadow-[0_0_15px_#9ca3af]";
  }
};

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1 },
};

const categories = ["all", "frontend", "tools"];

const TechStack = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredIcons =
    selectedCategory === "all"
      ? techIcons
      : techIcons.filter(icon => icon.category === selectedCategory);

  return (
    <>
      <Navbar />
      <section className="min-h-screen py-16 bg-white dark:bg-black">
        <div className="max-w-[1200px] mx-auto text-center px-4 mt-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
            My Tech Stack
          </h2>
          <p className="text-lg text-gray-600 dark:text-white mt-2">
            Technologies I’ve been working with recently
          </p>

          {/* Filter Buttons */}
          <div className="flex justify-center gap-4 mt-8 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-transparent text-gray-600 dark:text-white border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Tech Grid */}
          <motion.div
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-8 mt-12 place-items-center"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {filteredIcons.map((icon, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className={`group flex flex-col items-center space-y-2 p-4 rounded-xl transition-all hover:scale-105 ${getCategoryShadow(
                  icon.category,
                )}`}
              >
                <Image
                  src={icon.src}
                  alt={icon.alt}
                  width={60}
                  height={60}
                  className="animate-zoomInOut"
                />
                <div className="text-sm font-semibold dark:text-white">
                  {icon.alt}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-300">
                  {icon.level}
                </span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs text-center bg-black text-white dark:bg-white dark:text-black p-1 rounded">
                  {icon.description}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default TechStack;
