
import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

interface MusicToggleProps {
  isMuted: boolean;
  onToggle: () => void;
  isLoaded: boolean;
}

const MusicToggle: React.FC<MusicToggleProps> = ({ isMuted, onToggle, isLoaded }) => {
  if (!isLoaded) return null;

  return (
    <motion.div
      className="fixed top-6 right-6 z-50"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <motion.button
        onClick={onToggle}
        className="w-12 h-12 bg-slate-800/60 hover:bg-slate-700/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 border border-slate-600/50 shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isMuted ? 'Unmute background music' : 'Mute background music'}
      >
        {isMuted ? (
          <VolumeX size={18} className="text-slate-300" />
        ) : (
          <Volume2 size={18} className="text-orange-400" />
        )}
      </motion.button>
    </motion.div>
  );
};

export default MusicToggle;
