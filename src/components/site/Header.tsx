"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";

const NAV_ITEMS = [
  { name: "Work", href: "#work" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Contact", href: "#contact" },
];

export default function Header() {
  const [active, setActive] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) =>
      document.getElementById(item.href.slice(1)),
    ).filter((el): el is HTMLElement => !!el);

    const handleScroll = () => {
      let current = "";
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= 120) current = section.id;
      }
      setActive(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <header className="wrap sticky top-3 z-40 mt-3">
      <div className="h-12 pl-5 pr-1.5 flex items-center justify-between rounded-full border border-line bg-raised/85 backdrop-blur-md shadow-[var(--shadow-float)]">
        <a href="#main" className="font-semibold">
          Zahid Farooq
        </a>

        <div className="flex items-center gap-1">
          <nav aria-label="Main" className="hidden md:flex items-center gap-0.5 mr-1">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.href.slice(1);
              return (
                <a
                  key={item.name}
                  href={item.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isActive ? "bg-sunken text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {item.name}
                </a>
              );
            })}
          </nav>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className="icon-btn md:hidden rounded-full"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav
          id="mobile-menu"
          aria-label="Main"
          className="md:hidden mt-2 rounded-2xl border border-line bg-raised p-2 shadow-[var(--shadow-float)]"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-lg font-medium hover:bg-sunken"
            >
              {item.name}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
