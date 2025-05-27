import { useEffect, useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import ThemeSwitcher from "./ThemeSwitcher";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/my-tech-stack", label: "Tech Stack" },
    { href: "/project", label: "Projects" },
    { href: "/contact", label: "Contact" },
    { href: "/blog", label: "Blog" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 500);
      setMenuOpen(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`z-50 transition-all duration-300 ${
        isSticky
          ? "fixed top-0 left-0 w-full bg-white dark:bg-black shadow-md dark:shadow-[0_2px_10px_rgba(255,255,255,0.1)]"
          : "dark:bg-black"
      }`}
    >
      <div className="max-w-[1200px] mx-auto flex justify-between items-center p-4 rounded-bl-xl rounded-br-xl">
        <div className="flex flex-col items-start leading-tight">
          <span className="text-xl font-bold">
            <span className="text-blue-500">{"{"}</span>
            <span className="text-purple-500">013</span>
            <span className="text-purple-500">{"}"}</span>
          </span>
          <span className="text-lg font-bold">
            <Link href="/" className="text-blue-500">
              zahid
            </Link>
          </span>
        </div>

        <div className="hidden md:flex gap-8 text-gray-700 dark:text-gray-300 text-lg">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-blue-500 ${
                pathname === link.href ? "text-blue-500" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300 text-xl">
          <div className="hidden md:flex items-center gap-4">
            <ThemeSwitcher />
            <a
              href="/resume.pdf"
              download
              className="px-4 py-1 rounded border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition text-sm"
            >
              Resume
            </a>
          </div>
          <button
            className="md:hidden text-2xl focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          <div className="flex flex-col gap-4 text-gray-700 dark:text-gray-300 text-lg">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-blue-500 ${
                  pathname === link.href ? "text-blue-500" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-4 pt-2 text-xl">
              <ThemeSwitcher />
            </div>
          </div>
          {/* <div className="flex flex-col gap-4 text-gray-700 dark:text-gray-300 text-lg">
            <Link
              href="/"
              className="hover:text-blue-500"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="hover:text-blue-500"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/my-tech-stack"
              className="hover:text-blue-500"
              onClick={() => setMenuOpen(false)}
            >
              Tech Stack
            </Link>
            <Link
              href="/project"
              className="hover:text-blue-500"
              onClick={() => setMenuOpen(false)}
            >
              Projects
            </Link>
            <Link
              href="/contact"
              className="hover:text-blue-500"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="flex gap-4 pt-2 text-xl">
              <ThemeSwitcher />
            </div>
          </div> */}
        </div>
      )}
    </nav>
  );
}
