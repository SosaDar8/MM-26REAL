
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

let isRateLimited = false;

const FALLBACK_COMMENTARY = [
  "THE CROWD IS GOING WILD!",
  "ABSOLUTELY ELECTRIC!",
  "WHAT A PERFORMANCE!",
  "THEY ARE ON FIRE!",
  "PERFECT FORMATION!",
  "LISTEN TO THAT SOUND!",
  "UNSTOPPABLE MOMENTUM!",
  "PURE MARCHING FRENZY!"
];

const FALLBACK_NAMES = [
  "The Pixel Marchers",
  "Sonic Boom",
  "Golden Legion",
  "Thunder Corps",
  "Iron Brass",
  "Velocity Vanguard"
];

const FALLBACK_PEP_TALKS = [
  "Listen up! We've practiced for this. Leave it all on the field!",
  "They doubt us. Let's show them why we are the loudest band in the land!",
  "Focus on your technique. Precision wins championships.",
  "Have fun out there. If we enjoy it, the crowd will too."
];

const FALLBACK_RIVAL_BANTER = [
    "We've been waiting to show you how we do it this year!",
    "Don't think last year's win means anything—you're up next!",
    "Time to prove who runs this field!",
    "Hope you practiced your scales, because we aren't holding back.",
    "Nice uniforms... shame about the sound."
];

export const generateAnnouncerCommentary = async (
  context: string,
  score: number,
  crowdEnergy: number,
  rating?: 'S' | 'A' | 'B' | 'C' | 'D' // New optional rating for accuracy
): Promise<string> => {
  if (isRateLimited || !process.env.API_KEY) {
    return FALLBACK_COMMENTARY[Math.floor(Math.random() * FALLBACK_COMMENTARY.length)];
  }

  let prompt = `Context: ${context}. Score: ${score}. Crowd Energy: ${crowdEnergy}.`;
  
  if (rating) {
      if (rating === 'S' || rating === 'A') {
          prompt += " The band is playing perfectly! Generate a HYPED commentary line about how amazing they sound.";
      } else if (rating === 'C' || rating === 'D') {
          prompt += " The band is struggling. Generate a critical or concerned commentary line about the sloppy performance.";
      } else {
          prompt += " The band is okay. Generate a neutral but energetic sports commentary line.";
      }
  } else {
      prompt += " Generate one short, hyped, all-caps sports commentary line (max 5 words).";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
          maxOutputTokens: 20,
          thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text?.trim() || FALLBACK_COMMENTARY[0];
  } catch (error: any) {
    if (error.message?.includes('429') || error.status === 'RESOURCE_EXHAUSTED') {
      isRateLimited = true;
      setTimeout(() => isRateLimited = false, 60000);
    }
    return FALLBACK_COMMENTARY[Math.floor(Math.random() * FALLBACK_COMMENTARY.length)];
  }
};

export const generateBandName = async (style: string): Promise<string> => {
    if (isRateLimited || !process.env.API_KEY) {
        return FALLBACK_NAMES[Math.floor(Math.random() * FALLBACK_NAMES.length)];
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Generate one cool marching band name for a ${style} band. Max 3 words. No quotes.`,
            config: {
                maxOutputTokens: 10,
                thinkingConfig: { thinkingBudget: 0 }
            }
        });
        return response.text?.trim() || FALLBACK_NAMES[0];
    } catch (e) {
        return FALLBACK_NAMES[Math.floor(Math.random() * FALLBACK_NAMES.length)];
    }
}

export const generatePepTalk = async (tone: 'AGGRESSIVE' | 'INSPIRING' | 'TECHNICAL', opponentName: string): Promise<string> => {
    if (isRateLimited || !process.env.API_KEY) {
        return FALLBACK_PEP_TALKS[Math.floor(Math.random() * FALLBACK_PEP_TALKS.length)];
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Write a short (max 2 sentences), intense locker room pep talk for a marching band about to play against ${opponentName}. Tone: ${tone}.`,
            config: {
                maxOutputTokens: 60,
                thinkingConfig: { thinkingBudget: 0 }
            }
        });
        return response.text?.trim() || FALLBACK_PEP_TALKS[0];
    } catch (e) {
        return FALLBACK_PEP_TALKS[Math.floor(Math.random() * FALLBACK_PEP_TALKS.length)];
    }
}

export const generateRivalBanter = async (opponentName: string, situation: 'PREGAME' | 'WINNING' | 'LOSING'): Promise<string> => {
    if (isRateLimited || !process.env.API_KEY) {
        return FALLBACK_RIVAL_BANTER[Math.floor(Math.random() * FALLBACK_RIVAL_BANTER.length)];
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Write one sentence of competitive trash talk from a rival marching band named ${opponentName}. Situation: ${situation}.`,
            config: {
                maxOutputTokens: 30,
                thinkingConfig: { thinkingBudget: 0 }
            }
        });
        return response.text?.trim() || FALLBACK_RIVAL_BANTER[0];
    } catch (e) {
        return FALLBACK_RIVAL_BANTER[Math.floor(Math.random() * FALLBACK_RIVAL_BANTER.length)];
    }
}
