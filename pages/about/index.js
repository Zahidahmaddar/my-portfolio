import Navbar from "@/components/Navbar";
import React from "react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <>
      <Navbar />
      <div className="mt-24">
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
            <p className="text-base text-gray-600 dark:text-gray-300 w-7/12">
              The Generator App is an online tool that helps you to export
              ready-made templates ready to work as your future website. It
              helps you to combine slides, panels and other components and
              export it as a set of static files: HTML/CSS/JS.
            </p>
          </section>

          <section className="mb-12 w-7/12">
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

          <section className="mb-12 w-7/12">
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
