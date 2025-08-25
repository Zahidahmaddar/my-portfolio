'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './CustomCursor.css';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                            ('ontouchstart' in window) ||
                            (window.innerWidth <= 768);
      setIsMobile(isMobileDevice);
      return isMobileDevice;
    };

    // If mobile, don't hide cursor and exit early
    if (checkMobile()) {
      return;
    }

    // Hide the default cursor only on desktop
    document.body.style.cursor = 'none';

    const updateMousePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      // Check if hovering over a link or button
      const target = e.target as HTMLElement;
      const isLink = target.tagName.toLowerCase() === 'a' || 
                     target.tagName.toLowerCase() === 'button' ||
                     target.closest('a') !== null || 
                     target.closest('button') !== null ||
                     target.classList.contains('cursor-pointer');
      
      setIsHovering(isLink);
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      // Restore default cursor when component unmounts
      document.body.style.cursor = 'auto';
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Don't render custom cursor on mobile devices
  if (isMobile) {
    return null;
  }

  return (
    <>
      {/* Small dot cursor */}
      <motion.div
        className={`custom-cursor-dot ${isHovering ? 'hovering' : ''}`}
        animate={{
          x: position.x,
          y: position.y,
        }}
        transition={{ type: 'spring', stiffness: 1000, damping: 50 }}
      />
      
      {/* Larger circle cursor with glassmorphism */}
      <motion.div
        className={`custom-cursor-circle ${isHovering ? 'hovering' : ''}`}
        animate={{
          x: position.x,
          y: position.y,
        }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
      />
    </>
  );
};

export default CustomCursor;
