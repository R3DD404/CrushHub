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

  const prompt = `You're a savage but playful developer roasting GitHub compatibility. Be HILARIOUS, ROASTY, and make people laugh out loud. This needs to be SHAREABLE content that'll make people tag their friends.

User: ${profile1.username} (${profile1.topLanguages.slice(0,2).join(', ') || 'no languages'}) - ${profile1.publicRepos} repos, ${profile1.followers} followers
Bio: "${profile1.bio || 'No bio provided'}"

Crush: ${profile2.username} (${profile2.topLanguages.slice(0,2).join(', ') || 'no languages'}) - ${profile2.publicRepos} repos, ${profile2.followers} followers  
Bio: "${profile2.bio || 'No bio provided'}"

Shared languages: ${profile1.topLanguages.filter((lang: string) => profile2.topLanguages.includes(lang)).join(', ') || 'none'}

Generate EXACTLY this JSON format:
{
  "score": [1-100 number based on shared languages, bio compatibility, repo count, followers],
  "roast": "[SAVAGE but funny one-liner about their coding relationship, max 15 words]",
  "verdict": "[HILARIOUS conclusion that'll make people screenshot this, max 6 words]"
}

ROAST EXAMPLES to inspire you (don't copy exactly):
- "Your bios say more about compatibility than your dating profiles ever could"
- "They code in Python, you code in JavaScript... this is doomed from the start"
- "One says 'coffee lover', other says 'tea enthusiast'... irreconcilable differences"
- "Your bios have better chemistry than most couples"
- "Bio says 'dog person', theirs says 'cat person'... it's complicated"

VERDICT EXAMPLES:
- "Merge conflicts incoming"
- "Git commit to each other"
- "Syntax error in love"
- "Code review needed"
- "Push notifications only"
- "Bio compatibility error"

Make it SPICY, FUNNY, and something people will want to share immediately. Roast their coding habits, compare their tech stacks, joke about their bios vs real life. Make it go viral!`;

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
      score: Math.min(100, Math.max(1, result.score)),
      roast: result.roast || "Two developers walk into a repo...",
      verdict: result.verdict || "It's complicated"
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Funnier fallback responses based on bios
    const fallbackResponses = [
      {
        score: Math.floor(Math.random() * 50) + 30,
        roast: "Even AI gave up trying to figure out this bio combination",
        verdict: "System crash detected"
      },
      {
        score: Math.floor(Math.random() * 40) + 40,
        roast: "Your bios are more compatible than your code styles",
        verdict: "404: Love not found"
      },
      {
        score: Math.floor(Math.random() * 60) + 20,
        roast: "AI short-circuited analyzing these bio vibes",
        verdict: "Debug mode activated"
      }
    ];
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
};
