/**
 * Funkytown Fit — Food Photo AI
 * Sends a base64 JPEG to Claude Vision and returns estimated nutrition.
 *
 * Setup: add your Anthropic API key to app.json → extra → anthropicApiKey
 * Get a key at: https://console.anthropic.com
 */

import Constants from 'expo-constants';

export interface FoodAnalysis {
  food:        string;   // e.g. "Cheeseburger"
  servingDesc: string;   // e.g. "1 burger (220g)"
  calories:    number;
  proteinG:    number;
  carbsG:      number;
  fatG:        number;
}

const PROMPT = `You are a nutrition expert. Identify the food(s) in this photo and estimate the nutrition for the visible serving.

Respond ONLY with valid JSON — no explanation, no markdown fences:
{"food":"name of dish or food","servingDesc":"e.g. 1 cup, 1 slice, 1 burger","calories":number,"proteinG":number,"carbsG":number,"fatG":number}

Rules:
- If multiple foods are present, name the main item and include everything in the totals.
- Be conservative (slightly under-estimate) — it's better to log a bit less than to wildly over-estimate.
- Round calories to nearest 5, macros to nearest gram.
- If you genuinely cannot identify any food, return {"food":"Unknown food","servingDesc":"1 serving","calories":0,"proteinG":0,"carbsG":0,"fatG":0}`;

export async function analyzeFood(base64Jpeg: string): Promise<FoodAnalysis> {
  const apiKey = (Constants.expoConfig?.extra as any)?.anthropicApiKey as string | undefined;

  if (!apiKey || apiKey.startsWith('YOUR_')) {
    throw new Error(
      'Add your Anthropic API key to app.json → extra → anthropicApiKey.\n\nGet one free at console.anthropic.com'
    );
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key':          apiKey,
      'anthropic-version':  '2023-06-01',
      'content-type':       'application/json',
    },
    body: JSON.stringify({
      model:      'claude-haiku-4-5-20251001',  // fast + cheap, great for vision
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type:       'base64',
              media_type: 'image/jpeg',
              data:       base64Jpeg,
            },
          },
          { type: 'text', text: PROMPT },
        ],
      }],
    }),
  });

  if (!response.ok) {
    let msg = `API error ${response.status}`;
    try {
      const err = await response.json();
      msg += `: ${(err as any)?.error?.message ?? 'Unknown error'}`;
    } catch {}
    throw new Error(msg);
  }

  const data = await response.json();
  const rawText: string = data.content?.[0]?.text ?? '';

  // Strip any accidental markdown fences
  const cleaned = rawText
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  let parsed: FoodAnalysis;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(
      `Couldn't parse AI response. Raw: ${rawText.slice(0, 120)}`
    );
  }

  return {
    food:        String(parsed.food        ?? 'Unknown food'),
    servingDesc: String(parsed.servingDesc ?? '1 serving'),
    calories:    Math.max(0, Math.round(Number(parsed.calories) || 0)),
    proteinG:    Math.max(0, Math.round(Number(parsed.proteinG) || 0)),
    carbsG:      Math.max(0, Math.round(Number(parsed.carbsG)   || 0)),
    fatG:        Math.max(0, Math.round(Number(parsed.fatG)     || 0)),
  };
}
