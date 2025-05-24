import Link from "next/link";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 py-10 px-6 dark:bg-black">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row md:justify-between items-center md:items-start gap-6">
        {/* Left logo */}
        <div className="text-center md:text-left dark:text-white">
          <p className="text-sm text-[#3f3d56] font-medium dark:text-white">
            Zahid
          </p>
          <span className="text-lg font-bold">
            <span className="text-blue-500">{"{"}</span>
            <span className="text-purple-500">013</span>
            <span className="text-purple-500">{"}"}</span>
          </span>
        </div>
        <div className="text-center text-[#3f3d56] text-sm space-y-1 dark:text-white">
          <a href="tel:+917006969556" className="block hover:underline">
            +91 7006969556
          </a>
          <a
            href="mailto:darzahid537@gmail.com"
            className="block hover:underline"
          >
            darzahid537@gmail.com
          </a>
        </div>

        <div className="flex space-x-4 text-[#3f3d56] text-xl dark:text-white">
          <a
            href="https://github.com/Zahidahmaddar"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
          </a>

          <a
            href="https://www.linkedin.com/in/zahid-dar-26882a238/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
          </a>
        </div>
      </div>

      <hr className="border-gray-300 my-6" />

      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-[#3f3d56] dark:text-white">
        <ul className="flex space-x-6 mb-4 md:mb-0">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:underline">
              About
            </Link>
          </li>
          <li>
            <Link href="/my-tech-stack" className="hover:underline">
              Technologies
            </Link>
          </li>
          <li>
            <Link href="/project" className="hover:underline">
              Projects
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </li>
        </ul>

        <p className="text-center dark:text-white">
          Designed and built by{" "}
          <span className="text-[#7b5cff] font-medium">Zahid Farooq</span> with{" "}
          <span className="text-pink-500 font-medium">Love</span> &{" "}
          <span className="text-pink-500 font-medium">Coffee</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
