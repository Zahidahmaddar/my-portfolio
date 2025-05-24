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
          className="w-full max-w-[1200px] mx-auto mt-10 px-4 text-lg text-gray-800 dark:text-white"
        >
          Contact
        </motion.div>
        <Footer />
      </div>
    </>
  );
};

export default Contact;
