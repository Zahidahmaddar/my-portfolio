import Navbar from "@/components/Navbar";
import React from "react";
import { motion } from "framer-motion";

const MyTechStack = () => {
  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-[1200px] mx-auto mt-10 px-4 text-lg text-gray-800 dark:text-white"
      >
        Tech Stack
      </motion.div>
    </>
  );
};

export default MyTechStack;
