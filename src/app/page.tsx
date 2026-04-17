"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  Download,
  Send,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";
import Image from "next/image";
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

interface Skill {
  _id: string;
  name: string;
  level: number;
}

interface SiteSettings {
  heroSubtitle: string;
  heroImage: string;
  titleLine1: string;
  titleLine2: string;
  heroDescription: string;
  aboutImage: string;
  aboutParagraphs: string[];
  resumeUrl: string;
  stats: { value: string; label: string }[];
}

/* ─── Typing Text Component ─── */
function TypingText({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  const tick = useCallback(() => {
    const current = words[index];
    if (!deleting) {
      setDisplayed(current.slice(0, displayed.length + 1));
      if (displayed.length + 1 === current.length) {
        setTimeout(() => setDeleting(true), 2000);
        return;
      }
    } else {
      setDisplayed(current.slice(0, displayed.length - 1));
      if (displayed.length - 1 === 0) {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
        return;
      }
    }
  }, [words, index, displayed, deleting]);

  useEffect(() => {
    const speed = deleting ? 40 : 80;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, deleting]);

  return (
    <span className="text-indigo-400 text-sm font-semibold tracking-[0.3em] uppercase">
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
}

/* ─── Fallback data ─── */
const defaultSkills = [
  { name: "React / Next.js", level: 92 },
  { name: "TypeScript", level: 88 },
  { name: "Tailwind CSS", level: 95 },
  { name: "Node.js", level: 82 },
  { name: "React Native", level: 78 },
  { name: "MongoDB", level: 80 },
  { name: "Figma / UI Design", level: 75 },
  { name: "Git / DevOps", level: 85 },
];

const defaultStats = [
  { value: "3+", label: "Years Experience" },
  { value: "20+", label: "Projects Completed" },
  { value: "10+", label: "Happy Clients" },
  { value: "5+", label: "Technologies" },
];

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] =
    useState<{ name: string; level: number }[]>(defaultSkills);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  // Fetch projects, skills, and site settings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, skillRes, settingsRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/skills"),
          fetch("/api/site-settings"),
        ]);
        const [projData, skillData, settingsData] = await Promise.all([
          projRes.json(),
          skillRes.json(),
          settingsRes.json(),
        ]);
        if (projData.success) setProjects(projData.data);
        if (skillData.success && skillData.data.length > 0) {
          setSkills(
            skillData.data.map((s: Skill) => ({
              name: s.name,
              level: s.level,
            })),
          );
        }
        if (settingsData.success) setSiteSettings(settingsData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Derived values from settings (with fallbacks)
  const titleLine1 = siteSettings?.titleLine1 || "Zahid";
  const titleLine2 = siteSettings?.titleLine2 || "Farooq";
  const heroDescription =
    siteSettings?.heroDescription ||
    "Software Engineer specializing in modern, responsive web applications and engaging user experiences.";
  const aboutImage =
    siteSettings?.aboutImage ||
    "https://res.cloudinary.com/dtzswo7hc/image/upload/v1755886341/WhatsApp_Image_2025-08-22_at_23.42.08_mqx4bq.jpg";
  const aboutParagraphs = siteSettings?.aboutParagraphs?.length
    ? siteSettings.aboutParagraphs
    : [
        "Passionate Software Engineer with expertise in modern web technologies. I love turning complex problems into simple, beautiful, and performant solutions.",
        "Specializing in React, Next.js, and TypeScript, I build scalable web applications with clean code and exceptional user experiences. Always learning, always building.",
      ];
  const resumeUrl = siteSettings?.resumeUrl || "#contact";
  const stats = siteSettings?.stats?.length ? siteSettings.stats : defaultStats;

  // Handle contact form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      const data = await response.json();
      if (data.success) {
        setSubmitMessage(data.message);
        setContactForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setSubmitMessage(data.error || "Something went wrong");
      }
    } catch {
      setSubmitMessage("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#050505]">
      {/* ════════════════ HERO ════════════════ */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Typing subtitle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <TypingText
                words={[
                  "Software Engineer",
                  "Frontend Developer",
                  "React Specialist",
                  "UI/UX Enthusiast",
                ]}
              />
            </motion.div>

            {/* Hero Name */}
            <div className="overflow-hidden mb-4">
              <motion.h1
                className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter"
                initial={{ y: "100%", rotateX: -40 }}
                animate={{ y: "0%", rotateX: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              >
                <span className="text-gradient">{titleLine1}</span>
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-8">
              <motion.h1
                className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-zinc-100"
                initial={{ y: "100%", rotateX: -40 }}
                animate={{ y: "0%", rotateX: 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              >
                {titleLine2}
              </motion.h1>
            </div>

            {/* Hero Description */}
            <motion.p
              className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              {heroDescription}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              <motion.a
                href="#projects"
                className="btn-send flex items-center gap-2 px-8 py-4 text-base"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>View My Work</span>
                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ArrowDown size={18} />
                </motion.div>
              </motion.a>

              <motion.a
                href={resumeUrl}
                target={
                  resumeUrl.startsWith("http") ||
                  resumeUrl.startsWith("/uploads")
                    ? "_blank"
                    : undefined
                }
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl text-base font-semibold flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] text-zinc-300 hover:bg-white/[0.08] hover:text-white transition-all duration-300"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Download size={18} />
                <span>Download Resume</span>
              </motion.a>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              className="flex flex-wrap justify-center gap-6 md:gap-10 mt-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.8 }}
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8 + i * 0.1 }}
                  className="stat-card text-center min-w-[100px]"
                >
                  <div className="text-3xl font-black text-gradient">
                    {stat.value}
                  </div>
                  <div className="text-[10px] font-normal text-zinc-500 uppercase tracking-[0.2em] mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              className="mt-16"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowDown className="mx-auto text-zinc-600" size={20} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="glow-divider" />

      {/* ════════════════ ABOUT ════════════════ */}
      <section id="about" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20 relative"
          >
            <span className="absolute -top-8 -left-2 md:-left-6 text-8xl md:text-9xl font-black text-indigo-400/[0.08] select-none pointer-events-none">
              01
            </span>
            <p className="text-sm font-semibold text-indigo-400 tracking-[0.3em] uppercase mb-3">
              About
            </p>
            <h2 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-200">
              About <span className="text-gradient">Me</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">
            {/* Image with decorative rings */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 flex justify-center"
            >
              <div className="relative flex items-center justify-center">
                <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-2xl overflow-hidden border border-white/[0.06]">
                  <Image
                    src={aboutImage}
                    alt="Zahid Farooq"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                {/* Decorative rings */}
                <motion.div
                  className="absolute w-[105%] h-[105%] border-2 border-indigo-500/20 rounded-2xl"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <motion.div
                  className="absolute w-[110%] h-[110%] border border-violet-500/15 rounded-3xl"
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <motion.div
                  className="absolute w-[115%] h-[115%] border border-dashed border-indigo-400/10 rounded-3xl"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>
            </motion.div>

            {/* Text content */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-3 space-y-6"
            >
              {aboutParagraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "text-lg md:text-xl text-zinc-400 leading-relaxed"
                      : "text-base text-zinc-500 leading-relaxed"
                  }
                >
                  {paragraph}
                </p>
              ))}

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                {[
                  { label: "Location", value: "Kashmir, India" },
                  { label: "Experience", value: "3+ Years" },
                  { label: "Speciality", value: "Frontend Dev" },
                  { label: "Availability", value: "Open to Work" },
                ].map((item) => (
                  <div key={item.label} className="stat-card">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-1">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold text-zinc-200">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Social links */}
              <div className="flex gap-3 pt-2">
                {[
                  { icon: Github, href: "https://github.com/Zahidahmaddar" },
                  {
                    icon: Linkedin,
                    href: "https://www.linkedin.com/in/zahid-dar-26882a238/",
                  },
                  { icon: Mail, href: "mailto:darzahid537@gmail.com" },
                ].map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-zinc-500 hover:text-indigo-400 hover:border-indigo-500/30 hover:-translate-y-[3px] transition-all duration-300"
                  >
                    <s.icon size={18} />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="glow-divider" />

      {/* ════════════════ SKILLS ════════════════ */}
      <section id="skills" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20 relative"
          >
            <span className="absolute -top-8 -left-2 md:-left-6 text-8xl md:text-9xl font-black text-indigo-400/[0.08] select-none pointer-events-none">
              03
            </span>
            <p className="text-sm font-semibold text-indigo-400 tracking-[0.3em] uppercase mb-3">
              Skills
            </p>
            <h2 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-200">
              My <span className="text-gradient">toolkit.</span>
            </h2>
          </motion.div>

          {/* Skill Pills */}
          <motion.div
            className="flex flex-wrap gap-3 mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.04 } },
            }}
          >
            {skills.map((skill) => (
              <motion.span
                key={skill.name}
                variants={{
                  hidden: { opacity: 0, scale: 0.8, y: 20 },
                  visible: { opacity: 1, scale: 1, y: 0 },
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="px-5 py-3 rounded-xl bg-indigo-500/[0.08] border border-indigo-500/[0.15] text-zinc-200 text-sm font-medium cursor-default hover:bg-indigo-500/[0.15] hover:border-indigo-500/40 hover:shadow-[0_0_20px_rgba(129,140,248,0.1)] transition-all duration-300"
              >
                {skill.name}
                <span className="ml-2 text-indigo-400/70">{skill.level}%</span>
              </motion.span>
            ))}
          </motion.div>

          {/* Skill Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
            {skills.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-zinc-300">
                    {skill.name}
                  </span>
                  <span className="text-sm font-medium text-indigo-400">
                    {skill.level}%
                  </span>
                </div>
                <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-400 skill-bar-fill"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1,
                      delay: i * 0.08,
                      ease: "easeOut",
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="glow-divider" />

      {/* ════════════════ PROJECTS ════════════════ */}
      <section id="projects" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20 relative"
          >
            <span className="absolute -top-8 -left-2 md:-left-6 text-8xl md:text-9xl font-black text-indigo-400/[0.08] select-none pointer-events-none">
              04
            </span>
            <p className="text-sm font-semibold text-indigo-400 tracking-[0.3em] uppercase mb-3">
              Projects
            </p>
            <h2 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-200">
              Featured <span className="text-gradient">Projects</span>
            </h2>
            <p className="text-lg text-zinc-500 mt-4 max-w-2xl">
              Here are some of my recent projects demonstrating my skills in
              software engineering and engaging digital experiences.
            </p>
          </motion.div>

          {loading ? (
            <div className="space-y-8">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-36 bg-white/[0.02] rounded-xl animate-pulse border border-white/[0.04]"
                />
              ))}
            </div>
          ) : projects.length > 0 ? (
            /* Tree-branch timeline */
            <div className="relative">
              {/* Center line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-indigo-500/30 hidden lg:block" />

              <div className="space-y-12 lg:space-y-16">
                {projects.map((project, index) => {
                  const side = index % 2 === 0 ? "left" : "right";
                  return (
                    <div
                      key={project._id}
                      className={`relative flex items-center ${
                        side === "left" ? "lg:justify-start" : "lg:justify-end"
                      }`}
                    >
                      {/* Branch dot */}
                      <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-indigo-500 rounded-full hidden lg:block z-10" />

                      {/* Branch line */}
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 h-px w-10 bg-indigo-500/30 hidden lg:block ${
                          side === "left"
                            ? "left-1/2 ml-1.5"
                            : "right-1/2 mr-1.5"
                        }`}
                      />

                      <div className="w-full lg:w-[46%]">
                        <ProjectCard
                          project={project}
                          index={index}
                          side={side}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-zinc-500 text-lg">
                No projects found. Check back soon for updates!
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="glow-divider" />

      {/* ════════════════ CONTACT ════════════════ */}
      <section id="contact" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20 relative"
          >
            <span className="absolute -top-8 -left-2 md:-left-6 text-8xl md:text-9xl font-black text-indigo-400/[0.08] select-none pointer-events-none">
              05
            </span>
            <p className="text-sm font-semibold text-indigo-400 tracking-[0.3em] uppercase mb-3">
              Contact
            </p>
            <h2 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-200">
              Get In <span className="text-gradient">Touch</span>
            </h2>
            <p className="text-lg text-zinc-500 mt-4 max-w-2xl">
              Have a project in mind? Let&apos;s discuss how we can work
              together to bring your ideas to life.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact form */}
            <motion.form
              onSubmit={handleContactSubmit}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs text-zinc-500 uppercase tracking-[0.15em] mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, name: e.target.value })
                    }
                    className="mono-input"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 uppercase tracking-[0.15em] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                    className="mono-input"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-[0.15em] mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, subject: e.target.value })
                  }
                  className="mono-input"
                  placeholder="Project inquiry"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-[0.15em] mb-2">
                  Message
                </label>
                <textarea
                  required
                  rows={6}
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, message: e.target.value })
                  }
                  className="mono-input resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-send flex items-center gap-2"
                >
                  <Send size={16} />
                  <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                </button>
              </div>
              {submitMessage && (
                <div
                  className={`text-sm p-4 rounded-lg ${
                    submitMessage.includes("Thank you")
                      ? "bg-green-500/10 border border-green-500/20 text-green-400"
                      : "bg-red-500/10 border border-red-500/20 text-red-400"
                  }`}
                >
                  {submitMessage}
                </div>
              )}
            </motion.form>

            {/* Contact info side */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="stat-card">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 rounded-lg bg-indigo-500/10">
                    <Mail className="text-indigo-400" size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                      Email
                    </p>
                    <p className="text-sm font-semibold text-zinc-200">
                      darzahid537@gmail.com
                    </p>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 rounded-lg bg-indigo-500/10">
                    <Github className="text-indigo-400" size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                      GitHub
                    </p>
                    <a
                      href="https://github.com/Zahidahmaddar"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-zinc-200 hover:text-indigo-400 transition-colors"
                    >
                      Zahidahmaddar
                    </a>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 rounded-lg bg-indigo-500/10">
                    <Linkedin className="text-indigo-400" size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                      LinkedIn
                    </p>
                    <a
                      href="https://www.linkedin.com/in/zahid-dar-26882a238/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-zinc-200 hover:text-indigo-400 transition-colors"
                    >
                      Zahid Farooq
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
