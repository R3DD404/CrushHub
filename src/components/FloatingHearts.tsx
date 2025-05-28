
import React from 'react';
import { motion } from 'framer-motion';

const FloatingHearts = () => {
  const hearts = ['💕', '💖', '💘', '💝', '💗'];

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {[...Array(20)].map((_, i) => {
        const heart = hearts[Math.floor(Math.random() * hearts.length)];
        const delay = Math.random() * 10;
        const duration = 10 + Math.random() * 10;
        const initialX = Math.random() * 100;
        
        return (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-20"
            style={{
              left: `${initialX}%`,
              top: '100%',
            }}
            animate={{
              y: [0, -window.innerHeight - 100],
              x: [0, (Math.random() - 0.5) * 200],
              rotate: [0, 360],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {heart}
          </motion.div>
        );
      })}
    </div>
  );
};

export default FloatingHearts;
