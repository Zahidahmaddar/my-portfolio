import Navbar from "@/components/Navbar";
import Image from "next/image";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";

const projects = [
  {
    title: "Portfolio Website",
    description:
      "This is sample project description random things are here in description This is sample project lorem ipsum generator for dummy content",
    tech: "HTML, JavaScript, SASS, React",
    image: "/images/project1.png",
    liveLink: "https://yourdomain.com",
    codeLink: "https://github.com/your-repo",
  },
  {
    title: "Dashboard UI",
    description:
      "This is sample project description random things are here in description This is sample project lorem ipsum generator for dummy content",
    tech: "Next.js, Tailwind CSS",
    image: "/images/project2.png",
    liveLink: "#",
    codeLink: "#",
  },
  // Add more...
];

const Projects = () => {
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

            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((proj, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: idx * 0.1,
                    ease: "easeOut",
                  }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
                >
                  <div className="relative w-full h-48">
                    <Image
                      src={proj.image}
                      alt={proj.title}
                      fill
                      className="object-cover"
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
                      <strong>Tech stack:</strong> {proj.tech}
                    </p>
                    <div className="mt-4 flex space-x-4">
                      <a
                        href={proj.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm inline-flex items-center gap-1 border px-3 py-1 rounded-full text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <FaExternalLinkAlt /> Live Preview
                      </a>
                      <a
                        href={proj.codeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm inline-flex items-center gap-1 border px-3 py-1 rounded-full text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <FaGithub /> View Code
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Projects;
