"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute -top-[200px] -left-[200px] w-[600px] h-[600px] rounded-full bg-indigo-500/[0.05] blur-[200px]"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute -bottom-[200px] -right-[200px] w-[500px] h-[500px] rounded-full bg-violet-500/[0.04] blur-[180px]"
        animate={{
          scale: [1.05, 1, 1.05],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
