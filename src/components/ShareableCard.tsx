
  import React, { useRef } from 'react';
  import { motion } from 'framer-motion';
  import { Share } from 'lucide-react';
  import html2canvas from 'html2canvas';
  import { CompatibilityResult } from '../types/index';
  import { useToast } from '@/hooks/use-toast';

  interface ShareableCardProps {
    results: CompatibilityResult;
  }

  const ShareableCard: React.FC<ShareableCardProps> = ({ results }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    const generateAndShareCard = async () => {
      if (!cardRef.current) return;

      try {
        // Generate the image with exact dimensions and better quality
        const canvas = await html2canvas(cardRef.current, {
          backgroundColor: '#0f172a',
          scale: 2,
          useCORS: true,
          allowTaint: false,
          logging: false,
          width: 438,
          height: 250,
          windowWidth: 470,
          windowHeight: 219,
        });

        // Convert to blob and copy to clipboard
        canvas.toBlob(async (blob) => {
          if (!blob) return;

          try {
            // Copy image to clipboard
            await navigator.clipboard.write([
              new ClipboardItem({
                'image/png': blob
              })
            ]);

            // Show success message immediately
            toast({
              title: "Card copied to clipboard!",
              description: "Opening X for you to share your compatibility results!",
            });

            // Wait a bit then open Twitter
            setTimeout(() => {
              const tweetText = `${results.profile1.username} + ${results.profile2.username} = ${results.score}%\n\n"${results.roast}"\n\nCheck yours at crushub-sigma.vercel.app`;
              const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
              window.open(tweetUrl, '_blank');
            }, 2000);
          } catch (clipboardError) {
            console.error('Clipboard error:', clipboardError);
            // Fallback to just opening Twitter
            const tweetText = `${results.profile1.username} + ${results.profile2.username} = ${results.score}%\n\n"${results.roast}"\n\nCheck yours at crushub-sigma.vercel.app`;
            const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
            window.open(tweetUrl, '_blank');
            
            toast({
              title: "Opened X for sharing",
              description: "Couldn't copy to clipboard, but X is ready for your post!",
            });
          }
        }, 'image/png', 0.95);
      } catch (error) {
        console.error('Error generating card:', error);
        // Fallback to text-only sharing
        const tweetText = `${results.profile1.username} + ${results.profile2.username} = ${results.score}%\n\n"${results.roast}"\n\nCheck yours at crushub-sigma.vercel.app`;
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
        window.open(tweetUrl, '_blank');
        
        toast({
          title: "Opened X for sharing",
          description: "Card generation failed, but you can still share your results!",
        });
      }
    };

    const getScoreColor = (score: number) => {
      if (score >= 80) return 'text-green-400';
      if (score >= 60) return 'text-yellow-400';
      if (score >= 40) return 'text-orange-400';
      return 'text-red-400';
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Optimized Shareable Card for Twitter - 438x219px */}
        <div className="flex justify-center">
          <div
            ref={cardRef}
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl border border-slate-600/50 shadow-2xl relative overflow-hidden"
            style={{ width: '525px', height: '250px' }}
          >
            {/* Enhanced background with animated gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-orange-500/20 to-black-500/20"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>
            
            {/* Content Container */}
            <div className="relative z-10 h-full flex flex-col justify-between p-4">
              
              {/* Header with styled product name and Score */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <span className="text-xl font-black text-white tracking-tight">Crush</span>
                    <span className="text-xl font-black tracking-tight text-orange-500 px-1 py-0.5 rounded-md">

    Hub
  </span>

                  </div>
                  <p className="text-slate-400 text-xs mt-0.5">Find your GitHub crush compatibility</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-300 text-xs font-medium">GitHub Compatibility</p>
                  <div className={`text-3xl font-bold ${getScoreColor(results.score)}`}>
                    {results.score}%
                  </div>
                </div>
              </div>

              {/* Profiles Section */}
              <div className="flex items-center justify-between my-2">
                <div className="flex items-center gap-3">
                  <img
                    src={results.profile1.avatar}
                    alt={results.profile1.name}
                    className="w-12 h-12 rounded-full border-2 border-orange-400/50"
                    crossOrigin="anonymous"
                  />
                  <div>
                    <p className="font-semibold text-white text-sm">{results.profile1.username}</p>
                    <p className="text-slate-400 text-xs">{results.profile1.topLanguages[0] || 'Developer'}</p>
                  </div>
                </div>
                
                <div className="text-center px-3">
                  <div className="text-orange-400 text-xl font-bold">+</div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-semibold text-white text-sm">{results.profile2.username}</p>
                    <p className="text-slate-400 text-xs">{results.profile2.topLanguages[0] || 'Developer'}</p>
                  </div>
                  <img
                    src={results.profile2.avatar}
                    alt={results.profile2.name}
                    className="w-12 h-12 rounded-full border-2 border-amber-400/50"
                    crossOrigin="anonymous"
                  />
                </div>
              </div>

              {/* Roast text without label */}
              <div className="bg-slate-800/60 rounded-lg p-3 text-center backdrop-blur-sm border border-slate-600/30">
                <p className="text-white font-medium text-sm leading-relaxed line-clamp-2">{results.roast}</p>
              </div>

              {/* Bottom website URL */}
              <div className="flex items-center justify-between">  {/* Changed from justify-center to justify-between */}
  <div className="text-xs text-slate-400 font-medium">
    crushub-sigma.vercel.app
  </div>
  <div className="text-xs text-slate-500 font-medium">
    made by @R3DD404
  </div>
</div>
            </div>
          </div>
        </div>

        {/* Share Button */}
        <div className="flex justify-center">
          <motion.button
            onClick={generateAndShareCard}
            className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-8 py-4 rounded-xl font-medium text-lg shadow-xl transition-all duration-300 flex items-center gap-3 hover:from-orange-600 hover:to-amber-700 hover:shadow-2xl"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Share size={20} />
            Copy Card & Share on X
          </motion.button>
        </div>
      </motion.div>
    );
  };

  export default ShareableCard;
