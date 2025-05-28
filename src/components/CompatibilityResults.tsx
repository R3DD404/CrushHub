
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CompatibilityResult } from '../types/index';
import ComparisonChart from './ComparisonChart';

interface CompatibilityResultsProps {
  results: CompatibilityResult;
  onReset: () => void;
  onShowCard?: () => void;
}

const CompatibilityResults: React.FC<CompatibilityResultsProps> = ({ results, onReset, onShowCard }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (results.score > 85) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [results.score]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    if (score >= 40) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-pink-600';
  };

  return (
    <motion.div 
      className="max-w-6xl mx-auto space-y-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Profile Cards */}
      <motion.div 
        className="grid md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent"></div>
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <img 
              src={results.profile1.avatar} 
              alt={results.profile1.name}
              className="w-20 h-20 rounded-full border-3 border-orange-400/50 shadow-lg"
            />
            <div>
              <h3 className="text-white font-medium text-xl">{results.profile1.name}</h3>
              <p className="text-orange-400 font-medium text-lg">@{results.profile1.username}</p>
              <p className="text-slate-400 text-xs uppercase tracking-wider font-medium">YOU ✨</p>
            </div>
          </div>
          
          {/* Bio Section */}
          <div className="mb-4 relative z-10">
            <p className="text-slate-300 text-sm leading-relaxed bg-slate-800/30 rounded-lg p-3">
              "{results.profile1.bio || 'No bio, but probably still amazing'}"
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm relative z-10">
            <div className="text-center p-3 bg-slate-800/40 rounded-xl backdrop-blur-sm">
              <div className="text-white font-medium text-base">{results.profile1.publicRepos}</div>
              <div className="text-slate-400 text-xs">Repositories</div>
            </div>
            <div className="text-center p-3 bg-slate-800/40 rounded-xl backdrop-blur-sm">
              <div className="text-white font-medium text-base">{results.profile1.followers}</div>
              <div className="text-slate-400 text-xs">Followers</div>
            </div>
            <div className="text-center p-3 bg-slate-800/40 rounded-xl backdrop-blur-sm col-span-2">
              <div className="text-white font-medium text-xs">{results.profile1.topLanguages.slice(0, 2).join(', ') || 'Various Technologies'}</div>
              <div className="text-slate-400 text-xs">Top Languages</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent"></div>
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <img 
              src={results.profile2.avatar} 
              alt={results.profile2.name}
              className="w-20 h-20 rounded-full border-3 border-amber-400/50 shadow-lg"
            />
            <div>
              <h3 className="text-white font-medium text-xl">{results.profile2.name}</h3>
              <p className="text-amber-400 font-medium text-lg">@{results.profile2.username}</p>
              <p className="text-slate-400 text-xs uppercase tracking-wider font-medium">YOUR CRUSH 💕</p>
            </div>
          </div>
          
          {/* Bio Section */}
          <div className="mb-4 relative z-10">
            <p className="text-slate-300 text-sm leading-relaxed bg-slate-800/30 rounded-lg p-3">
              "{results.profile2.bio || 'No bio, but definitely intriguing'}"
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm relative z-10">
            <div className="text-center p-3 bg-slate-800/40 rounded-xl backdrop-blur-sm">
              <div className="text-white font-medium text-base">{results.profile2.publicRepos}</div>
              <div className="text-slate-400 text-xs">Repositories</div>
            </div>
            <div className="text-center p-3 bg-slate-800/40 rounded-xl backdrop-blur-sm">
              <div className="text-white font-medium text-base">{results.profile2.followers}</div>
              <div className="text-slate-400 text-xs">Followers</div>
            </div>
            <div className="text-center p-3 bg-slate-800/40 rounded-xl backdrop-blur-sm col-span-2">
              <div className="text-white font-medium text-xs">{results.profile2.topLanguages.slice(0, 2).join(', ') || 'Various Technologies'}</div>
              <div className="text-slate-400 text-xs">Top Languages</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Compatibility Score */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
      >
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-12 border border-slate-700/50 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-amber-500/10 to-yellow-500/10"></div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8, type: "spring", bounce: 0.4 }}
            className={`text-8xl font-bold ${getScoreColor(results.score)} mb-6 relative z-10`}
          >
            {results.score}%
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-white text-3xl font-medium mb-8 relative z-10"
          >
            Compatibility Match ✨
          </motion.h2>

          {results.sharedLanguages.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mb-8 relative z-10"
            >
              <p className="text-slate-300 text-lg mb-4">Shared Programming Languages:</p>
              <div className="flex justify-center gap-3 flex-wrap">
                {results.sharedLanguages.map((lang, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-slate-200 px-4 py-2 rounded-full text-sm font-medium border border-orange-400/30 backdrop-blur-sm shadow-lg"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Comparison Chart */}
      <ComparisonChart results={results} />

      {/* AI Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-xl"
      >
        <h3 className="text-white text-2xl font-medium mb-6">AI Analysis 🤖</h3>
        <p className="text-slate-300 text-xl leading-relaxed mb-6">{results.roast}</p>
        <div className="bg-gradient-to-r from-orange-500/15 to-amber-500/15 rounded-xl p-6 border border-orange-400/30 backdrop-blur-sm shadow-lg">
          <h4 className="text-slate-200 text-lg font-medium mb-3">Final Verdict:</h4>
          <p className="text-white text-2xl font-medium">{results.verdict} ✨</p>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        {onShowCard && (
          <motion.button
            onClick={onShowCard}
            className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-8 py-4 rounded-xl font-medium text-lg shadow-xl transition-all duration-300 hover:from-orange-600 hover:to-amber-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Share on X ✨
          </motion.button>
        )}

        <motion.button
          onClick={onReset}
          className="bg-slate-700/80 hover:bg-slate-600 text-slate-200 px-8 py-4 rounded-xl font-medium text-lg transition-all duration-200 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Check Another Crush 💕
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default CompatibilityResults;
