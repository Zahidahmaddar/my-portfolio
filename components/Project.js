import Image from "next/image";

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
  {
    title: "Dashboard UI",
    description:
      "This is sample project description random things are here in description This is sample project lorem ipsum generator for dummy content",
    tech: "Next.js, Tailwind CSS",
    image: "/images/project2.png",
    liveLink: "#",
    codeLink: "#",
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
  {
    title: "Dashboard UI",
    description:
      "This is sample project description random things are here in description This is sample project lorem ipsum generator for dummy content",
    tech: "Next.js, Tailwind CSS",
    image: "/images/project2.png",
    liveLink: "#",
    codeLink: "#",
  },
];

const Projects = () => {
  return (
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
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:animate-zoomInOut"
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
