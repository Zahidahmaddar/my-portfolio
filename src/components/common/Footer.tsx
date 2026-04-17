"use client";

import { usePathname } from "next/navigation";
import { Github, Linkedin, Mail, Heart } from "lucide-react";

const Footer = () => {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/Zahidahmaddar",
      icon: Github,
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/zahid-dar-26882a238/",
      icon: Linkedin,
    },
    {
      name: "Email",
      href: "mailto:darzahid537@gmail.com",
      icon: Mail,
    },
  ];

  return (
    <footer className="border-t border-white/[0.06] bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-gradient">Zahid Farooq</h3>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
              Software Engineer crafting responsive web applications with
              seamless functionality and delightful experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-[0.2em]">
              Quick Links
            </h4>
            <div className="space-y-2">
              {["Home", "About", "Skills", "Projects", "Contact"].map(
                (link) => (
                  <a
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    className="block text-sm text-zinc-500 hover:text-indigo-400 transition-colors"
                  >
                    {link}
                  </a>
                ),
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-[0.2em]">
              Connect
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-zinc-500 hover:text-indigo-400 hover:border-indigo-500/30 hover:-translate-y-[3px] transition-all duration-300"
                    aria-label={social.name}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="glow-divider mt-12 mb-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-xs">
            © {currentYear} Zahid Farooq. All rights reserved.
          </p>
          <p className="text-zinc-600 text-xs flex items-center">
            Made with <Heart className="w-3 h-3 mx-1 text-indigo-400" /> using
            Next.js
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
