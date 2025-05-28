
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface UsernameFormProps {
  onSubmit: (username1: string, username2: string) => void;
}

const UsernameForm: React.FC<UsernameFormProps> = ({ onSubmit }) => {
  const [username1, setUsername1] = useState('');
  const [username2, setUsername2] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username1.trim() && username2.trim()) {
      onSubmit(username1.trim(), username2.trim());
    }
  };

  return (
    <motion.div 
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-700/50 relative overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 rounded-3xl"></div>
        
        <motion.div 
          className="text-center mb-8 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h2 className="text-2xl font-medium text-white mb-3">Check Your GitHub Chemistry</h2>
          <p className="text-slate-400 text-base">Enter both GitHub usernames to discover your compatibility</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="space-y-3"
            >
              <label className="block text-slate-300 font-medium text-sm">
                Your GitHub Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username1}
                  onChange={(e) => setUsername1(e.target.value)}
                  placeholder="your-username"
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50 transition-all duration-200 backdrop-blur-sm"
                  required
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="space-y-3"
            >
              <label className="block text-slate-300 font-medium text-sm">
                Your Crush's GitHub Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username2}
                  onChange={(e) => setUsername2(e.target.value)}
                  placeholder="their-username"
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all duration-200 backdrop-blur-sm"
                  required
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="pt-2"
          >
            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white py-4 rounded-xl font-medium text-lg shadow-lg transition-all duration-300 hover:from-orange-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(251, 146, 60, 0.3)"
              }}
              whileTap={{ scale: 0.98 }}
              disabled={!username1.trim() || !username2.trim()}
            >
              <span className="relative z-10">Check Compatibility</span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-500 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </motion.button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
};

export default UsernameForm;
