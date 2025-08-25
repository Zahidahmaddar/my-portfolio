'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface IllustrationProps {
  type: 'frontend' | 'backend' | 'design' | 'mobile' | 'journey';
  className?: string;
}

const CustomIllustration: React.FC<IllustrationProps> = ({ type, className = '' }) => {
  // SVG paths for different illustrations
  const illustrations = {
    frontend: (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={`w-full h-full ${className}`}>
        <motion.rect 
          x="40" y="40" width="120" height="80" rx="5" 
          fill="var(--card-background)" 
          stroke="var(--primary)" 
          strokeWidth="3"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        <motion.path 
          d="M70 70 L50 85 L70 100" 
          stroke="var(--primary)" 
          strokeWidth="3" 
          fill="none"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.path 
          d="M130 70 L150 85 L130 100" 
          stroke="var(--primary)" 
          strokeWidth="3" 
          fill="none"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.7 }}
        />
        <motion.path 
          d="M90 65 L110 105" 
          stroke="var(--accent)" 
          strokeWidth="3" 
          fill="none"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.9 }}
        />
        <motion.rect 
          x="40" y="130" width="120" height="10" rx="2" 
          fill="var(--primary)"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, ease: "easeInOut", delay: 1.2 }}
        />
      </svg>
    ),
    backend: (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={`w-full h-full ${className}`}>
        <motion.circle 
          cx="100" cy="70" r="30" 
          fill="var(--card-background)" 
          stroke="var(--primary)" 
          strokeWidth="3"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <motion.rect 
          x="70" y="110" width="60" height="50" rx="5" 
          fill="var(--card-background)" 
          stroke="var(--primary)" 
          strokeWidth="3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        />
        <motion.line 
          x1="100" y1="100" x2="100" y2="110" 
          stroke="var(--primary)" 
          strokeWidth="3"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut", delay: 0.6 }}
        />
        <motion.circle 
          cx="85" cy="70" r="5" 
          fill="var(--accent)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        />
        <motion.circle 
          cx="115" cy="70" r="5" 
          fill="var(--accent)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        />
        <motion.path 
          d="M85 135 L95 125 L105 135 L115 125" 
          stroke="var(--accent)" 
          strokeWidth="3" 
          fill="none"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut", delay: 1.3 }}
        />
      </svg>
    ),
    design: (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={`w-full h-full ${className}`}>
        <motion.circle 
          cx="100" cy="100" r="50" 
          fill="none" 
          stroke="var(--primary)" 
          strokeWidth="3"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        <motion.circle 
          cx="100" cy="100" r="30" 
          fill="none" 
          stroke="var(--accent)" 
          strokeWidth="2"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
        />
        <motion.path 
          d="M100 50 L100 150" 
          stroke="var(--primary)" 
          strokeWidth="2" 
          strokeDasharray="5,5"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.6 }}
        />
        <motion.path 
          d="M50 100 L150 100" 
          stroke="var(--primary)" 
          strokeWidth="2" 
          strokeDasharray="5,5"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.9 }}
        />
        <motion.polygon 
          points="100,70 115,100 100,130 85,100" 
          fill="var(--accent)"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 1.2 }}
        />
      </svg>
    ),
    mobile: (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={`w-full h-full ${className}`}>
        <motion.rect 
          x="70" y="40" width="60" height="120" rx="10" 
          fill="var(--card-background)" 
          stroke="var(--primary)" 
          strokeWidth="3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <motion.rect 
          x="75" y="50" width="50" height="80" rx="2" 
          fill="var(--primary-dark)"
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        />
        <motion.circle 
          cx="100" cy="145" r="8" 
          fill="none" 
          stroke="var(--accent)" 
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
        />
        <motion.path 
          d="M85 65 L115 65 M85 75 L105 75 M85 85 L110 85 M85 95 L100 95" 
          stroke="var(--accent)" 
          strokeWidth="2" 
          strokeLinecap="round"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.9 }}
        />
      </svg>
    ),
    journey: (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={`w-full h-full ${className}`}>
        <motion.path 
          d="M40,150 Q70,50 100,120 Q130,50 160,150" 
          fill="none" 
          stroke="var(--primary)" 
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.circle 
          cx="40" cy="150" r="8" 
          fill="var(--card-background)" 
          stroke="var(--primary)" 
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
        />
        <motion.circle 
          cx="100" cy="120" r="8" 
          fill="var(--card-background)" 
          stroke="var(--primary)" 
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 1 }}
        />
        <motion.circle 
          cx="160" cy="150" r="8" 
          fill="var(--card-background)" 
          stroke="var(--accent)" 
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 1.5 }}
        />
        <motion.path 
          d="M40,170 L40,180 M100,140 L100,150 M160,170 L160,180" 
          stroke="var(--primary)" 
          strokeWidth="2"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut", delay: 2 }}
        />
        <motion.text 
          x="40" y="190" 
          textAnchor="middle" 
          fill="var(--card-text)" 
          fontSize="10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 2.2 }}
        >
          Start
        </motion.text>
        <motion.text 
          x="100" y="160" 
          textAnchor="middle" 
          fill="var(--card-text)" 
          fontSize="10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 2.4 }}
        >
          Growth
        </motion.text>
        <motion.text 
          x="160" y="190" 
          textAnchor="middle" 
          fill="var(--card-text)" 
          fontSize="10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 2.6 }}
        >
          Now
        </motion.text>
      </svg>
    )
  };

  return (
    <div className="illustration-container">
      {illustrations[type]}
    </div>
  );
};

export default CustomIllustration;
