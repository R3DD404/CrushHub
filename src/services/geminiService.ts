
interface GeminiRequest {
  contents: {
    parts: {
      text: string;
    }[];
  }[];
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

export const generateCompatibilityWithGemini = async (
  profile1: any,
  profile2: any
): Promise<{
  score: number;
  roast: string;
  verdict: string;
}> => {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  if (!API_KEY) {
    throw new Error('Gemini API key not found. Please set VITE_GEMINI_API_KEY in your environment variables.');
  }

  // Check if it's the same person
  if (profile1.username.toLowerCase() === profile2.username.toLowerCase()) {
    const selfLoveMessages = [
      "Looks like someone's got a serious case of self-love... at least your repos match perfectly!",
      "10/10 would recommend dating yourself, your bio already knows all your flaws",
      "Your biggest competition in love is... yourself. That's actually kinda deep.",
      "Plot twist: you ARE the crush. Self-love era activated!",
      "Found your perfect match... it's you. Your bio doesn't lie."
    ];
    
    const selfLoveVerdicts = [
      "Ultimate self-love",
      "You + You = Perfection", 
      "Solo dev forever",
      "Self-shipped successfully"
    ];

    return {
      score: Math.floor(Math.random() * 20) + 80,
      roast: selfLoveMessages[Math.floor(Math.random() * selfLoveMessages.length)],
      verdict: selfLoveVerdicts[Math.floor(Math.random() * selfLoveVerdicts.length)]
    };
  }

  const sharedLanguages = profile1.topLanguages.filter((lang: string) => profile2.topLanguages.includes(lang));
  const followerSimilarity = Math.abs(profile1.followers - profile2.followers) <= Math.max(profile1.followers, profile2.followers) * 0.5;
  const repoSimilarity = Math.abs(profile1.publicRepos - profile2.publicRepos) <= Math.max(profile1.publicRepos, profile2.publicRepos) * 0.5;
  const bothHaveBios = profile1.bio && profile2.bio;

  const prompt = `You're a savage but playful developer roasting GitHub compatibility. Be HILARIOUS, ROASTY, and make people laugh out loud. This needs to be SHAREABLE content that'll make people tag their friends. Focus on making users feel laygh about their match.

User: ${profile1.username} (${profile1.topLanguages.slice(0,2).join(', ') || 'no languages'}) - ${profile1.publicRepos} repos, ${profile1.followers} followers
Bio: "${profile1.bio || 'No bio provided'}"

Crush: ${profile2.username} (${profile2.topLanguages.slice(0,2).join(', ') || 'no languages'}) - ${profile2.publicRepos} repos, ${profile2.followers} followers  
Bio: "${profile2.bio || 'No bio provided'}"

Compatibility factors:
- Shared languages: ${sharedLanguages.join(', ') || 'none'}
- Similar follower count: ${followerSimilarity ? 'Yes' : 'No'}
- Similar repo count: ${repoSimilarity ? 'Yes' : 'No'}
- Both have bios: ${bothHaveBios ? 'Yes' : 'No'}

Generate EXACTLY this JSON format:
{
  "score": [20-95 range -  People want to laugh],
  "roast": "[SAVAGE but funny one-liner about their coding relationship, max 15 words]",
  "verdict": "[HILARIOUS conclusion that'll make people screenshot this, max 6 words]"
}

ROAST EXAMPLES to inspire you (don't copy exactly):
- "Your repos have better chemistry than most dating apps"
- "Both code in JavaScript... this is either perfect or a disaster"
- "Similar follower count means you're equally unpopular, perfect match!"
- "Your bios are more compatible than your commit schedules"
- "One has a bio, other doesn't... opposites attract in coding too"

VERDICT EXAMPLES:
- "Merge conflicts incoming"
- "Git commit to each other"
- "Syntax error in love"
- "Code review approved"
- "Pull request accepted"
- "Repository compatibility confirmed"

Make it SPICY, FUNNY, ROAST and something people will want to share immediately. We want people to laugh  and share their results!`;

  const requestBody: GeminiRequest = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ]
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data: GeminiResponse = await response.json();
    const generatedText = data.candidates[0]?.content?.parts[0]?.text;

    if (!generatedText) {
      throw new Error('No response from Gemini API');
    }

    // Extract JSON from the response
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON format in Gemini response');
    }

    const result = JSON.parse(jsonMatch[0]);
    
    return {
      score: Math.min(100, Math.max(20, result.score)), // Ensure generous range
      roast: result.roast || "Two developers walk into a repo...",
      verdict: result.verdict || "It's complicated"
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // More generous fallback responses
    const fallbackResponses = [
      {
        score: Math.floor(Math.random() * 25) + 70,
        roast: "Even AI thinks your repos are meant to be together",
        verdict: "Code chemistry confirmed"
      },
      {
        score: Math.floor(Math.random() * 20) + 75,
        roast: "Your GitHub profiles have better compatibility than most apps",
        verdict: "Repository match made"
      },
      {
        score: Math.floor(Math.random() * 30) + 65,
        roast: "AI crashed trying to compute this much coding chemistry",
        verdict: "System overload detected"
      }
    ];
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
};
