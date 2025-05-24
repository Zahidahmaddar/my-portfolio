import Navbar from "@/components/Navbar";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const techIcons = [
  { src: "/images/icons/icons8-html.svg", alt: "HTML" },
  { src: "/images/icons/icons8-css.svg", alt: "CSS" },
  { src: "/images/icons/icons8-javascript.svg", alt: "JavaScript" },
  { src: "/images/icons/react-2.svg", alt: "React" },
  { src: "/images/icons/redux-logo-svgrepo-com.svg", alt: "Redux" },
  { src: "/images/icons/bootstrap-4.svg", alt: "Bootstrap" },
  { src: "/images/icons/tailwind-css-icon.svg", alt: "Tailwind CSS" },
  { src: "/images/icons/git-icon-logo-svgrepo-com.svg", alt: "Git" },
  { src: "/images/icons/icons8-visual-studio-code.svg", alt: "VS Code" },
  { src: "/images/icons/github-icon-1-logo-svgrepo-com.svg", alt: "GitHub" },
  { src: "/images/icons/react-2.svg", alt: "React Native" },
  { src: "/images/icons/typescript.svg", alt: "TypeScript" },
];

const TechStack = () => {
  return (
    <>
      <Navbar />
      <section className="h-screen py-16  bg-white dark:bg-black ">
        <div className="max-w-[1200px] mx-auto text-center px-4 mt-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
            My Tech Stack
          </h2>
          <p className="text-lg text-gray-600 dark:text-white mt-2">
            Technologies I’ve been working with recently
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-8 mt-12 place-items-center">
            {techIcons.map((icon, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="group flex flex-col items-center space-y-2"
              >
                <Image
                  src={icon.src}
                  alt={icon.alt}
                  width={60}
                  height={60}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-2 py-1 text-sm rounded bg-black text-white dark:bg-white dark:text-black">
                  {icon.alt}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default TechStack;
