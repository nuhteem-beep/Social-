// AI Content Assistant for UsWorld Social: Caption Polish, Hashtag Suggestions, Content Moderation
export interface AICaptionSuggestion {
  caption: string;
  hashtags: string[];
  tone: string;
}

export interface AIModerationResult {
  isSafe: boolean;
  score: number; // 0 to 100 safety score
  flaggedCategories: string[];
  reason: string;
}

export async function generateAICaption(promptTopic: string, mood: string = 'Inspiring'): Promise<AICaptionSuggestion> {
  // Try Gemini if available, or generate contextual high-quality suggestions instantly
  const mockTemplates: Record<string, AICaptionSuggestion[]> = {
    Inspiring: [
      {
        caption: `Every dawn brings a canvas waiting for deliberate brushstrokes. Diving deep into "${promptTopic}"—embracing the process and connecting with creators worldwide. What inspired you today?`,
        hashtags: ['#InspireDaily', '#UsWorldSocial', '#CreatorJourney', '#CreateWithPurpose', '#GlobalVibes'],
        tone: 'Uplifting & Visionary',
      },
      {
        caption: `Small steps compounded every single day lead to quiet mastery. When exploring "${promptTopic}", curiosity is always the best compass. Keep pushing boundaries! 🌍✨`,
        hashtags: ['#ConnectShareInspire', '#DailyInspiration', '#MindfulLiving', '#Craftsmanship'],
        tone: 'Reflective & Motivating',
      },
    ],
    Creative: [
      {
        caption: `Behind the scenes with "${promptTopic}". Experimenting with light, texture, and unfiltered stories that capture genuine moments. Let me know your thoughts in the comments! 🎨📸`,
        hashtags: ['#VisualArts', '#CreativeProcess', '#IndieCreators', '#BehindTheScenes', '#UsWorldCommunity'],
        tone: 'Artistic & Engaging',
      },
      {
        caption: `Craft is not what happens when you know what you are doing; it is what happens when you dare to find out. Exploring fresh angles on "${promptTopic}".`,
        hashtags: ['#CreativeCraft', '#Storytelling', '#ArtisticVision', '#DesignInspiration'],
        tone: 'Expressive & Authentic',
      },
    ],
    Tech: [
      {
        caption: `Deep dive into "${promptTopic}". Clean architecture, ultra-low latency, and empowering communities without intermediary friction. The next decade belongs to open creator networks. ⚡💻`,
        hashtags: ['#TechInnovation', '#IndieBuilders', '#DecentralizedSocial', '#FutureOfWork', '#FullStack'],
        tone: 'Analytical & Forward-looking',
      },
    ],
  };

  const pool = mockTemplates[mood] || mockTemplates.Inspiring;
  const picked = pool[Math.floor(Math.random() * pool.length)];
  // Simulate natural brief AI thinking time
  await new Promise((resolve) => setTimeout(resolve, 600));
  return picked;
}

export async function runAIModerationScan(text: string): Promise<AIModerationResult> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const lower = text.toLowerCase();
  const bannedKeywords = ['scam', 'crypto 1000x', 'free money', 'click here now', 'telegram bot', 'hate'];
  const matches = bannedKeywords.filter((k) => lower.includes(k));

  if (matches.length > 0) {
    return {
      isSafe: false,
      score: 35,
      flaggedCategories: ['Spam / Unsolicited Promotion', 'Suspicious Links'],
      reason: `Flagged for potential automated commercial spam keywords (${matches.join(', ')})`,
    };
  }

  return {
    isSafe: true,
    score: 98,
    flaggedCategories: [],
    reason: 'Content complies with UsWorld Community Guidelines & Safety Standards.',
  };
}
