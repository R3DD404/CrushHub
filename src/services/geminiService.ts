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
  profile2: any,
  score: number
): Promise<{
  roast: string;
  verdict: string;
}> => {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  if (!API_KEY) {
    throw new Error('Gemini API key not found. Please set VITE_GEMINI_API_KEY in your environment variables.');
  }

  const sharedLanguages = profile1.topLanguages.filter((lang: string) => profile2.topLanguages.includes(lang));
  const tone = score >= 80 ? "romantic and dreamy" : score >= 50 ? "playful and flirty" : "sassy and roasty";

  const prompt = `You're a ${tone} AI analyzing GitHub compatibility for CrushHub. Be HILARIOUS, FLIRTY, and ROASTY. Use the score to guide the tone of your response. Make it SHAREABLE and something users will laugh at and blush over.

User: ${profile1.username} (${profile1.topLanguages.slice(0, 2).join(', ') || 'no languages'}) - ${profile1.publicRepos} repos, ${profile1.followers} followers
Bio: "${profile1.bio || 'No bio provided'}"

Crush: ${profile2.username} (${profile2.topLanguages.slice(0, 2).join(', ') || 'no languages'}) - ${profile2.publicRepos} repos, ${profile2.followers} followers  
Bio: "${profile2.bio || 'No bio provided'}"

Compatibility factors:
- Shared languages: ${sharedLanguages.join(', ') || 'none'}
- Compatibility score: ${score}

Generate EXACTLY this JSON format:
{
  "roast": "[Flirty, romantic, or roasty one-liner about their coding chemistry, max 15 words]",
  "verdict": "[Hilarious and shareable conclusion, max 6 words]"
}

ROAST EXAMPLES:
- "Your repos are a match made in GitHub heaven!"
- "Shared languages? Sparks are flying already!"
- "Your bios vibe like a late-night commit."
- "One says 'night owl', the other 'early bird'... opposites attract, right?"

VERDICT EXAMPLES:
- "Merge conflicts incoming"
- "Pull request accepted"
- "Syntax error in love"
- "Code review approved"
- "Hot repo romance"

Make it SPICY, FUNNY, and tailored to the score.`;

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
      roast: result.roast || "Your code’s got us hot and bothered!",
      verdict: result.verdict || "Steamy commit vibes"
    };
  } catch (error) {
    console.error('Gemini API Error:', error);

    // Fallback responses
    const fallbackResponses = [
      {
        roast: "Your repos are sparking some heat!",
        verdict: "Code’s too hot"
      },
      {
        roast: "GitHub’s blushing at your sexy code!",
        verdict: "Passionate repo match"
      },
      {
        roast: "Your profiles scream late-night coding sessions!",
        verdict: "Steamy syntax vibes"
      }
    ];

    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
};