"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen justify-between dark:bg-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full flex-grow flex flex-col items-center justify-center text-center px-4 py-10"
        >
          <div className="mb-10">
            <p className="text-2xl sm:text-3xl font-bold text-[#0a0156] dark:text-white">
              For any questions please mail me at:
            </p>
            <a
              // href="mailto:darzahid537@gmail.com"
              className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mt-4 inline-block"
            >
              darzahid537@gmail.com
            </a>
          </div>

          {/* ✅ Contact Form */}
          {!submitted ? (
            <form
              action="https://formspree.io/f/mzzrlble"
              method="POST"
              onSubmit={() => setSubmitted(true)}
              className="w-full max-w-md space-y-4 bg-white dark:bg-gray-900 p-6 rounded shadow-md transition-all duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Or send a message directly
              </h2>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                aria-label="Name"
                className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                aria-label="Email"
                className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
              />
              <textarea
                name="message"
                rows={4}
                placeholder="Your Message"
                required
                aria-label="Message"
                className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
              ></textarea>

              {/* 🛡️ Honeypot Anti-spam */}
              <input type="text" name="_gotcha" style={{ display: "none" }} />

              <input
                type="hidden"
                name="_subject"
                value="New Contact Message"
              />

              <button
                type="submit"
                className="w-full bg-black text-white dark:bg-white dark:text-black py-2 rounded hover:opacity-90 transition"
              >
                Send Message
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-100 text-green-800 px-6 py-4 rounded mt-6 max-w-md"
            >
              🎉 Thank you! Your message has been sent.
            </motion.div>
          )}

          {/* 🔗 Social Icons */}
          <div className="flex justify-center space-x-5 mt-10">
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

          {/* 🧾 Optional Contact Info */}
          <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>📍 Location: Srinagar, Jammu and Kashmir</p>
            <p>📞 Phone: +91 7006969556</p>
          </div>
        </motion.div>

        {/* <Footer /> */}
      </div>
    </>
  );
};

export default Contact;
