"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  Download,
  Send,
  Code,
  Palette,
  Database,
  Globe,
  Smartphone,
} from "lucide-react";
import ProjectCard from "@/components/projects/ProjectCard";

interface Project {
  _id: string;
  title: string;
  description: string;
  tech: string[];
  image: string;
  repoUrl?: string;
  liveUrl?: string;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        const data = await response.json();
        if (data.success) {
          setProjects(data.data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Handle contact form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      });

      const data = await response.json();
      if (data.success) {
        setSubmitMessage(data.message);
        setContactForm({ name: "", email: "", message: "" });
      } else {
        setSubmitMessage(data.error || "Something went wrong");
      }
    } catch {
      setSubmitMessage("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const skills = [
    {
      name: "Frontend Development",
      icon: Code,
      description: "React, Next.js, TypeScript, Tailwind CSS",
      illustrationType: "frontend",
    },
    {
      name: "UI/UX Design",
      icon: Palette,
      description: "Figma, Adobe Creative Suite, Responsive Design",
      illustrationType: "design",
    },
    {
      name: "Native Development",
      icon: Smartphone,
      description: "React Native, Expo, Cross-platform Mobile Apps",
      illustrationType: "mobile",
    },
    // {
    //   name: "Backend Development",
    //   icon: Database,
    //   description: "Node.js, MongoDB, PostgreSQL, REST APIs",
    //   illustrationType: "backend",
    // },
    // { name: 'Full-Stack Solutions', icon: Globe, description: 'End-to-end web applications, DevOps, Deployment', illustrationType: 'mobile' },
  ];

  return (
    <div className="pt-16 bg-[var(--background)] transition-colors duration-300">
      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{
          background: `linear-gradient(to bottom right, var(--hero-bg-from), var(--hero-bg-to))`,
        }}
      >
        {/* Animated background elements */}
        <motion.div
          className="absolute inset-0 opacity-10"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        </motion.div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <motion.span
                className="gradient-text inline-block"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Software
              </motion.span>
              <br />
              <motion.span
                className="inline-block"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Engineer
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-[var(--text-primary)] dark:text-gray-300 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              style={{ color: "var(--text-primary)" }}
            >
              Software Engineer specializing in modern, responsive web
              applications and engaging user experiences.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <motion.a
                href="#projects"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <span>View My Work</span>
                <motion.div
                  animate={{ y: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowDown size={20} />
                </motion.div>
              </motion.a>

              <motion.a
                // href="https://res.cloudinary.com/dfauck6hu/image/upload/v1754738464/Adnan_resume_1_unclg2.pdf"
                download
                className="px-8 py-4 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-300
                  bg-[var(--neu-background)] text-[var(--card-text)]
                  hover:text-blue-600 dark:hover:text-blue-400
                  shadow-[4px_4px_12px_var(--neu-shadow-dark),_-4px_-4px_12px_var(--neu-shadow-light)]
                  hover:shadow-[2px_2px_6px_var(--neu-shadow-dark),_-2px_-2px_6px_var(--neu-shadow-light)]
                  active:shadow-[inset_4px_4px_8px_var(--neu-shadow-dark),_inset_-4px_-4px_8px_var(--neu-shadow-light)]
                  border border-[var(--card-border)]
                  backdrop-filter backdrop-blur-sm"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                <Download size={20} />
                <span>Download Resume</span>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              About Me
            </h2>
            <p
              className="text-xl text-gray-900 dark:text-gray-300 max-w-3xl mx-auto"
              style={{ color: "var(--text-primary)" }}
            >
              Passionate full-stack developer with expertise in modern web
              technologies. I love turning complex problems into simple,
              beautiful solutions.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
          >
            {skills.map((skill) => {
              const Icon = skill.icon;
              return (
                <motion.div
                  key={skill.name}
                  variants={{
                    hidden: { opacity: 0, y: 50, scale: 0.8 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        duration: 0.6,
                        ease: "easeOut",
                      },
                    },
                  }}
                  whileHover={{
                    scale: 1.05,
                    y: -5,
                    transition: { duration: 0.2 },
                  }}
                  className="text-center p-6 rounded-xl cursor-pointer group transition-all duration-300
                    backdrop-blur-[var(--glass-blur)] bg-[var(--glass-background)]
                    border border-[var(--glass-border)] shadow-[var(--glass-shadow)]
                    hover:shadow-xl"
                >
                  <motion.div
                    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center
                      bg-[var(--neu-background)]
                      shadow-[4px_4px_10px_var(--neu-shadow-dark),_-4px_-4px_10px_var(--neu-shadow-light)]
                      group-hover:shadow-[2px_2px_5px_var(--neu-shadow-dark),_-2px_-2px_5px_var(--neu-shadow-light)]
                      transition-all duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2 text-[var(--card-text)] group-hover:text-blue-600 transition-colors duration-300">
                    {skill.name}
                  </h3>
                  <p className="text-[var(--card-text-secondary)] group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                    {skill.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              Featured Projects
            </h2>
            <p
              className="text-xl text-gray-900 dark:text-gray-300 max-w-3xl mx-auto"
              style={{ color: "var(--text-primary)" }}
            >
              Here are some of my recent projects that demonstrate my skills in
              software engineering and developing engaging digital experiences.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse"
                >
                  <div className="h-48 bg-gray-300 dark:bg-gray-600 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                  <div className="flex space-x-2">
                    <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <div className="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-700 dark:text-gray-400 text-lg">
                No projects found. Check back soon for updates!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              Get In Touch
            </h2>
            <p
              className="text-xl text-gray-900 dark:text-gray-300 max-w-3xl mx-auto"
              style={{ color: "var(--text-primary)" }}
            >
              Have a project in mind? Let&apos;s discuss how we can work
              together to bring your ideas to life.
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <motion.form
              onSubmit={handleContactSubmit}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-[var(--form-label)] mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-[var(--form-border)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[var(--form-background)] text-[var(--form-text)]"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[var(--form-label)] mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-[var(--form-border)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[var(--form-background)] text-[var(--form-text)]"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-[var(--form-label)] mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, message: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-[var(--form-border)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[var(--form-background)] text-[var(--form-text)]"
                  placeholder="Tell me about your project..."
                />
              </div>
              <div className="text-center">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 rounded-lg font-semibold flex items-center space-x-2 mx-auto
                    bg-[var(--neu-background)] text-[var(--card-text)]
                    hover:text-blue-600 dark:hover:text-blue-400
                    shadow-[4px_4px_10px_var(--neu-shadow-dark),_-4px_-4px_10px_var(--neu-shadow-light)]
                    hover:shadow-[2px_2px_5px_var(--neu-shadow-dark),_-2px_-2px_5px_var(--neu-shadow-light)]
                    active:shadow-[inset_4px_4px_8px_var(--neu-shadow-dark),_inset_-4px_-4px_8px_var(--neu-shadow-light)]
                    disabled:opacity-70 disabled:cursor-not-allowed
                    transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send size={20} />
                  <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                </motion.button>
              </div>
              {submitMessage && (
                <div
                  className={`text-center p-4 rounded-lg ${
                    submitMessage.includes("Thank you")
                      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                      : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                  }`}
                >
                  {submitMessage}
                </div>
              )}
            </motion.form>
          </div>
        </div>
      </section>
    </div>
  );
}
