import React from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

const Contact = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col h-[calc(100vh-5rem)] justify-between dark:bg-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full flex-grow flex items-center justify-center text-center px-4"
        >
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-[#0a0156] dark:text-white">
              For any questions please mail me at:
            </p>
            <a
              href="mailto:darzahid537@gmail.com"
              className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mt-4 inline-block"
            >
              darzahid537@gmail.com
            </a>
          </div>
        </motion.div>
        <Footer />
      </div>
    </>
  );
};

export default Contact;
