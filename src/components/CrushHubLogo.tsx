import React from 'react';
import { motion } from 'framer-motion';

const CrushHubLogo = ({ className = '' }: { className?: string }) => {
  return (
    <motion.div 
      className={`flex items-center justify-center gap-3 mb-2 ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="flex items-center">
        <motion.span 
          className="text-5xl md:text-6xl font-bold text-white"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Crush
        </motion.span>
        
        <motion.span 
          className="text-5xl md:text-6xl font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 px-4 py-2 rounded-2xl ml-3 shadow-xl relative overflow-hidden"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
        >
          <span className="relative z-10">Hub</span>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-500 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </motion.span>
      </div>
    </motion.div>
  );
};

export default CrushHubLogo;
