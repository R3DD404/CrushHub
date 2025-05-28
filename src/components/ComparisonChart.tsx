
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend, Cell } from 'recharts';
import { CompatibilityResult } from '../types/index';

interface ComparisonChartProps {
  results: CompatibilityResult;
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({ results }) => {
  const chartData = [
    {
      category: 'Repos',
      you: results.profile1.publicRepos,
      crush: results.profile2.publicRepos,
    },
    {
      category: 'Followers',
      you: results.profile1.followers,
      crush: results.profile2.followers,
    },
    {
      category: 'Languages',
      you: results.profile1.topLanguages.length,
      crush: results.profile2.topLanguages.length,
    },
    {
      category: 'Bio Score',
      you: results.profile1.bio ? 1 : 0,
      crush: results.profile2.bio ? 1 : 0,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="bg-slate-900/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
    >
      <h3 className="text-white text-xl font-medium mb-6 text-center">You vs Your Crush</h3>
      
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="category" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#94a3b8' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#94a3b8' }}
            />
            <Legend 
              wrapperStyle={{ 
                paddingTop: '20px',
                fontSize: '14px'
              }}
            />
            <Bar 
              dataKey="you" 
              name="You"
              radius={[4, 4, 0, 0]}
              fill="url(#youGradient)"
            />
            <Bar 
              dataKey="crush" 
              name="Your Crush"
              radius={[4, 4, 0, 0]}
              fill="url(#crushGradient)"
            />
            <defs>
              <linearGradient id="youGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ec4899" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#ec4899" stopOpacity={0.3}/>
              </linearGradient>
              <linearGradient id="crushGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.3}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick stats comparison */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-700/50">
        <div className="text-center">
          <div className="text-pink-400 font-medium text-lg">{results.profile1.username}</div>
          <div className="text-slate-400 text-sm">
            {results.profile1.topLanguages.slice(0, 2).join(', ') || 'No languages'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-purple-400 font-medium text-lg">{results.profile2.username}</div>
          <div className="text-slate-400 text-sm">
            {results.profile2.topLanguages.slice(0, 2).join(', ') || 'No languages'}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ComparisonChart;
