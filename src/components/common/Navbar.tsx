"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => item.href.replace("#", ""));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  });

  if (isAdmin) return null;

  return (
    <>
      {/* Desktop floating pill */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center gap-1 px-2 py-1.5 rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/[0.06]"
      >
        {navItems.map((item) => {
          const isActive = activeSection === item.href.replace("#", "");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative px-5 py-2 rounded-full text-xs font-medium uppercase tracking-widest transition-colors duration-200 ${
                isActive
                  ? "bg-indigo-500 text-white shadow-[0_0_20px_rgba(129,140,248,0.4)]"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </motion.nav>

      {/* Mobile compact pill */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 md:hidden flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/[0.06]"
      >
        <span className="text-sm font-bold text-gradient">ZF</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-zinc-400 hover:text-white transition-colors"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </motion.nav>

      {/* Mobile fullscreen overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center gap-6 md:hidden"
          >
            {navItems.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-2xl font-semibold uppercase tracking-widest transition-colors ${
                    activeSection === item.href.replace("#", "")
                      ? "text-indigo-400"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
