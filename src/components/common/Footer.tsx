"use client";

import { Github, Linkedin, Mail, Heart } from "lucide-react";

const Footer = () => {
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
    <footer className="bg-[var(--background)] border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold gradient-text">Zahid Farooq</h3>
            <p className="max-w-md gradient-text">
              As a Software Engineer, I craft responsive web applications that
              deliver seamless functionality and delightful user experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold gradient-text">Quick Links</h4>
            <div className="space-y-2">
              {["Home", "About", "Projects", "Contact"].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="block gradient-text hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold gradient-text">Connect</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg transition-all social-icon-link"
                    style={{
                      backgroundColor: "var(--card-background)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--card-border)",
                    }}
                    aria-label={social.name}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p
              className="text-gray-600 dark:text-gray-400 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              © {currentYear} Zahid Farooq. All rights reserved.
            </p>
            <p
              className="text-gray-600 dark:text-gray-400 text-sm flex items-center"
              style={{ color: "var(--text-secondary)" }}
            >
              Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> using
              Next.js
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
