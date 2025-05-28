import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import CrushHubLogo from '../components/CrushHubLogo';
import UsernameForm from '../components/UsernameForm';
import CompatibilityResults from '../components/CompatibilityResults';
import ShareableCard from '../components/ShareableCard';
import MusicToggle from '../components/MusicToggle';
import { GitHubProfile, CompatibilityResult } from '../types/index';
import { generateCompatibilityWithGemini } from '../services/geminiService';
import { scrapeGitHubContributions, fetchGitHubUserData } from '../services/githubScraper';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<CompatibilityResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCard, setShowCard] = useState(false);

  // Ref for the audio element
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.5;
        audioRef.current.play().catch(() => {});
      }
    };
    playAudio();

    // Fallback: play on first user interaction
    const handleUserInteraction = () => {
      playAudio();
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);
    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  const handleAnalysis = async (username1: string, username2: string) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    setShowCard(false);

    try {
      console.log(`🚀 Starting analysis for ${username1} and ${username2}...`);
      
      // Fetch GitHub profiles
      const [profile1, profile2] = await Promise.all([
        fetchGitHubProfile(username1),
        fetchGitHubProfile(username2)
      ]);

      console.log('✅ Profiles fetched successfully');

      // Generate compatibility analysis with improved algorithm
      const compatibility = await calculateCompatibility(profile1, profile2);

      setResults(compatibility);
      console.log('🎉 Analysis completed successfully');
    } catch (err) {
      console.error('❌ Analysis failed:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong! Maybe one of those users is too mysterious for GitHub?');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCompatibility = async (profile1: GitHubProfile, profile2: GitHubProfile): Promise<CompatibilityResult> => {
    const sharedLanguages = profile1.topLanguages.filter(lang => 
      profile2.topLanguages.includes(lang)
    );

    // Enhanced compatibility calculation
    let score = 50; // Base score for everyone to have decent chances

    // Language compatibility (30% weight)
    const languageScore = Math.min(30, sharedLanguages.length * 10);
    score += languageScore;

    // Follower similarity (20% weight)
    const followerDiff = Math.abs(profile1.followers - profile2.followers);
    const maxFollowers = Math.max(profile1.followers, profile2.followers);
    const followerSimilarity = maxFollowers === 0 ? 20 : Math.max(0, 20 - (followerDiff / maxFollowers) * 20);
    score += followerSimilarity;

    // Repository similarity (15% weight)
    const repoDiff = Math.abs(profile1.publicRepos - profile2.publicRepos);
    const maxRepos = Math.max(profile1.publicRepos, profile2.publicRepos);
    const repoSimilarity = maxRepos === 0 ? 15 : Math.max(0, 15 - (repoDiff / maxRepos) * 15);
    score += repoSimilarity;

    // Bio compatibility (10% weight) - both having bios or both not having bios
    const bothHaveBios = profile1.bio && profile2.bio;
    const neitherHasBio = !profile1.bio && !profile2.bio;
    if (bothHaveBios || neitherHasBio) {
      score += 10;
    }

    // Activity bonus (10% weight) - both being active developers
    if (profile1.publicRepos > 0 && profile2.publicRepos > 0) {
      score += 10;
    }

    // Random factor for fun (15% weight)
    const randomBonus = Math.random() * 15;
    score += randomBonus;

    // Ensure score is between 1 and 100
    score = Math.min(100, Math.max(1, Math.round(score)));

    // Generate AI analysis
    const geminiResult = await generateCompatibilityWithGemini(profile1, profile2);

    return {
      score,
      roast: geminiResult.roast,
      verdict: geminiResult.verdict,
      profile1,
      profile2,
      sharedLanguages
    };
  };

  const fetchGitHubProfile = async (username: string): Promise<GitHubProfile> => {
    console.log(`📡 Fetching profile for ${username}...`);
    
    // Sanitize username input for security
    const sanitizedUsername = username.trim().replace(/[^a-zA-Z0-9-_]/g, '');
    if (!sanitizedUsername || sanitizedUsername !== username.trim()) {
      throw new Error('Invalid username format');
    }
    
    // Fetch user data
    const userData = await fetchGitHubUserData(sanitizedUsername);
    console.log(`✅ User data fetched for ${sanitizedUsername}`);
    
    // Fetch repositories with error handling
    let reposData = [];
    try {
      const reposResponse = await fetch(`https://api.github.com/users/${sanitizedUsername}/repos?per_page=100&sort=updated`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (reposResponse.ok) {
        reposData = await reposResponse.json();
        console.log(`✅ Repos data fetched for ${sanitizedUsername}`);
      } else {
        console.log(`⚠️ Repos fetch failed for ${sanitizedUsername}, using empty array`);
      }
    } catch (error) {
      console.log(`⚠️ Repos fetch error for ${sanitizedUsername}:`, error);
    }
    
    // Scrape contribution data
    let contributionData;
    try {
      contributionData = await scrapeGitHubContributions(sanitizedUsername);
      console.log(`✅ Contributions scraped for ${sanitizedUsername}: ${contributionData.contributionsThisYear}`);
    } catch (error) {
      console.log(`⚠️ Scraping failed for ${sanitizedUsername}, using fallback`);
      contributionData = { contributionsThisYear: 0, longestStreak: 0, currentStreak: 0 };
    }
    
    // Calculate top languages safely
    const languages: { [key: string]: number } = {};
    if (Array.isArray(reposData)) {
      reposData.forEach((repo: any) => {
        if (repo && typeof repo.language === 'string' && repo.language.trim()) {
          const lang = repo.language.trim();
          languages[lang] = (languages[lang] || 0) + 1;
        }
      });
    }
    
    const topLanguages = Object.entries(languages)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([lang]) => lang);

    const lastCommitDate = Array.isArray(reposData) && reposData.length > 0 && reposData[0]?.updated_at 
      ? reposData[0].updated_at 
      : null;
    
    const daysSinceLastCommit = lastCommitDate 
      ? Math.floor((Date.now() - new Date(lastCommitDate).getTime()) / (1000 * 60 * 60 * 24))
      : null;

    return {
      username: userData.login || sanitizedUsername,
      name: userData.name || userData.login || sanitizedUsername,
      avatar: userData.avatar_url || `https://github.com/${sanitizedUsername}.png`,
      bio: userData.bio || "No bio, but probably still cute",
      publicRepos: Math.max(0, userData.public_repos || 0),
      followers: Math.max(0, userData.followers || 0),
      topLanguages,
      daysSinceLastCommit,
      commitsThisYear: Math.max(0, contributionData.contributionsThisYear || 0)
    };
  };

  const resetAnalysis = () => {
    setResults(null);
    setError(null);
    setShowCard(false);
  };

  const showShareableCard = () => {
    setShowCard(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-orange-950 to-black relative overflow-hidden">
      {/* Audio element for background music */}
      <audio ref={audioRef} src="/background-music.mp3" autoPlay hidden />

      {/* Music Toggle Button */}
      <div className="absolute top-6 right-6 flex items-center gap-6 z-50">
        <motion.a
          href="https://x.com/R3DD404"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-transparent hover:bg-orange-500/10 text-orange-400 px-4 py-3 rounded-full font-medium text-sm shadow-xl transition-all duration-300 flex items-center gap-2 border border-orange-600"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Follow me on X
          <ExternalLink size={16} className="text-slate-300" />
        </motion.a>
      </div>

      {/* Enhanced floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-orange-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-amber-400/40 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-yellow-400/20 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-orange-300/30 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 left-1/2 w-2 h-2 bg-amber-300/25 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-yellow-300/35 rounded-full animate-bounce"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <CrushHubLogo />
          <motion.p 
            className="text-slate-300 text-lg mt-6 max-w-2xl mx-auto font-light leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Discover your GitHub compatibility with that special developer ✨
          </motion.p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!results && !isLoading && !error && (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <UsernameForm onSubmit={handleAnalysis} />
            </motion.div>
          )}

          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="relative mb-8 flex justify-center">
                <div className="w-20 h-20 border-4 border-orange-900/50 border-t-orange-400 rounded-full animate-spin"></div>
              </div>
              <motion.h3 
                className="text-white text-2xl font-medium mb-4"
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Analyzing your GitHub chemistry...
              </motion.h3>
              <motion.p 
                className="text-slate-400 text-lg"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Scanning repos, checking vibes, calculating compatibility ⚡
              </motion.p>
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-red-950/30 border border-red-800/50 rounded-2xl p-8 text-center backdrop-blur-sm shadow-xl">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-400 text-2xl">💔</span>
                </div>
                <h3 className="text-red-300 text-xl font-medium mb-4">Oops! Something went wrong</h3>
                <p className="text-slate-300 text-base mb-6 leading-relaxed">{error}</p>
                <button
                  onClick={resetAnalysis}
                  className="bg-red-600/80 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  Try Again ✨
                </button>
              </div>
            </motion.div>
          )}

          {results && !showCard && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <CompatibilityResults 
                results={results} 
                onReset={resetAnalysis}
                onShowCard={showShareableCard}
              />
            </motion.div>
          )}

          {results && showCard && (
            <motion.div
              key="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <ShareableCard results={results} />
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowCard(false)}
                  className="bg-slate-700/80 hover:bg-slate-600 text-slate-200 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  Back to Results ✨
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
