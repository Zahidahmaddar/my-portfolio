import Navbar from "@/components/Navbar";
import React from "react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <>
      <Navbar />
      <div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-[1200px] mx-auto mt-20 px-6 text-gray-800 dark:text-white"
        >
          <section className="mb-12">
            <h1 className="text-3xl font-bold mb-4 text-[#2D2D2D] dark:text-white">
              About Me
            </h1>

            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed w-full md:w-10/12 lg:w-8/12">
              I&apos;m Zahid Farooq — a passionate Frontend Developer with a
              strong focus on building responsive, user-friendly, and visually
              appealing web applications. I specialize in modern JavaScript
              frameworks like React, along with tools such as Tailwind CSS,
              TypeScript, and Git.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mt-4 w-full md:w-10/12 lg:w-8/12">
              I enjoy turning ideas into reality through clean, scalable code.
              Whether it’s crafting a smooth user interface or solving tricky UI
              challenges, I love the balance between design and development.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mt-4 w-full md:w-10/12 lg:w-8/12">
              When I’m not coding, you’ll find me exploring new tech,
              contributing to open source, or leveling up my skills through side
              projects and tutorials.
            </p>
          </section>

          <section className="mb-12 w-full md:w-10/12 lg:w-8/12">
            <h2 className="text-2xl font-bold mb-6 text-[#2D2D2D] dark:text-white">
              Work Experience
            </h2>

            {/* Experience Card */}
            <ExperienceCard
              title="Web Developer Intern"
              company="Accubits"
              location="Kerala"
              date="Aug 2022 - Dec 2023"
              type="Internship"
            />
            <ExperienceCard
              title="Web Developer"
              company="Accubits"
              location="Kerala"
              date="Sep 2022 - Dec 2023"
              type="Full Time"
            />
            <ExperienceCard
              title="Web Developer"
              company="Kupos.cl"
              location="Chile"
              date="March 2024 - Present"
              type="Full Time"
            />
          </section>

          <section className="mb-12 w-full md:w-10/12 lg:w-8/12">
            <h2 className="text-2xl font-bold mb-6 text-[#2D2D2D] dark:text-white">
              Education
            </h2>
            <ExperienceCard
              title="Bachelor in Computer Application"
              company="Amar Singh college"
              location=""
              date="Aug 2015 - Dec 2020"
              type="Full Time"
            />
          </section>
        </motion.div>
      </div>
    </>
  );
};

const ExperienceCard = ({ title, company, location, date, type }) => (
  <div className="border-b py-4">
    <h3 className="text-lg font-semibold text-[#2D2D2D] dark:text-white">
      {title}
    </h3>
    <div className="flex justify-between items-center flex-wrap text-sm text-gray-500 dark:text-gray-400 mt-1">
      <div className="flex space-x-2 items-center">
        <span>{company}</span>
        {location && (
          <>
            <span>•</span>
            <span>{location}</span>
          </>
        )}
      </div>
      <div className="flex items-center space-x-3">
        <span>{date}</span>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            type === "Full Time"
              ? "bg-green-100 text-green-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {type}
        </span>
      </div>
    </div>
  </div>
);

export default About;
