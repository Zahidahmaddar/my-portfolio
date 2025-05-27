import Image from "next/image";
import { useRouter } from "next/router";

const projects = [
  {
    title: "Kupos.cl",
    description:
      "Kupos.cl is a modern and responsive web application for booking bus and train tickets across multiple cities in Chile. It allows users to search routes, compare fares, view real-time availability, and make secure bookings—all from a user-friendly interface. Built with performance and scalability in mind, the platform streamlines travel planning for both commuters and long-distance travelers.",
    tech: "HTML, JavaScript, React, Next",
    image: "/images/icons/kupos-logo2.svg",
    liveLink: "https://kupos.cl/",
    codeLink: "https://github.com/your-repo",
  },
  {
    title: "Turbus.cl",
    description:
      "Turbus.cl is a modern and responsive web application for booking bus  tickets across multiple cities in Chile. It allows users to search routes, compare fares, view real-time availability, and make secure bookings—all from a user-friendly interface. Built with performance and scalability in mind, the platform streamlines travel planning for both commuters and long-distance travelers.",
    tech: "HTML, JavaScript, React, Next",
    image: "/images/icons/Turbus-website-home-green-logo.svg",
    liveLink: "https://turbus.cl/",
    codeLink: "https://github.com/your-repo",
  },
  {
    title: "Zipmex",
    description:
      "A responsive cryptocurrency exchange platform where users can securely trade popular assets like Bitcoin, Ethereum, Litecoin, Ripple, and Bitcoin Cash. Developed using Next.js for SSR and Tailwind CSS for rapid UI development, Zipmex ensures fast performance, intuitive UX, and high scalability for real-time trading environments.",
    tech: "Next.js, Tailwind CSS",
    image:
      "/images/icons/zipmex-cryptocurrency-zmt-token-logo-260nw-2213372771.webp",
    liveLink: "#",
    codeLink: "#",
  },
  // {
  //   title: "Kimo",
  //   description:
  //     "KIMO.AI is an AI-powered EdTech company focused on personalized learning at scale. It aims to reinvent online learning by providing automated summaries and personalized learning paths based on user preferences. KIMO.AI also offers features like automated summaries and filters for various content types, difficulty levels, price points, and more.",
  //   tech: "Next.js, Tailwind CSS",
  //   image: "/images/icons/download.jpeg",
  //   liveLink: "#",
  //   codeLink: "#",
  // },
  // {
  //   title: "B-Pharm",
  //   description:
  //     "This is sample project description random things are here in description This is sample project lorem ipsum generator for dummy content",
  //   tech: "Next.js, Tailwind CSS",
  //   image: "/images/project2.png",
  //   liveLink: "#",
  //   codeLink: "#",
  // },
];

const Projects = () => {
  const router = useRouter();
  return (
    <section id="projects" className="py-20 px-6 bg-white dark:bg-black">
      <div className="max-w-[1200px] mx-auto ">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
              Projects
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Things I’ve built so far
            </p>
          </div>
          <div
            onClick={() => router.push("/project")}
            className="cursor-pointer inline-block px-4 py-1 border border-transparent hover:border-blue-500 text-gray-700 dark:text-gray-300 hover:text-blue-500 transition duration-200 rounded"
          >
            <span>See All</span>
          </div>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((proj, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden hover:animate-zoomInOut"
            >
              <div className="relative h-20 w-[200px] m-auto">
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
