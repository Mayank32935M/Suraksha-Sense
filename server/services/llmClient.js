/**
 * LLM Client — wraps all Gemini API HTTP calls.
 * One function per use case. Never logs raw user input.
 */

import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * Make a raw Gemini API call.
 * @param {string} prompt - The prompt to send
 * @returns {Promise<string>} Raw text response from Gemini
 */
async function callGemini(prompt) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1024,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Empty response from Gemini');
  }

  return text;
}

/**
 * Classify a life event from free text.
 * Returns one of: wedding, new_baby, new_vehicle, new_home, none
 *
 * @param {string} message - Raw user text (used only here, never logged)
 * @returns {Promise<string>} One of the valid event types or "none"
 */
export async function classifyEvent(message) {
  const prompt = `You are a life-event classifier for an Indian insurance recommendation app.

Given the user's message, determine which ONE life event they are describing.

Valid event types (return exactly one):
- "wedding" — marriage, getting married, engagement leading to marriage
- "new_baby" — expecting a child, newborn, just had a baby, pregnancy
- "new_vehicle" — bought a car, new bike, new vehicle purchase
- "new_home" — bought a house, new flat, moving to a new home, home purchase
- "none" — if the message doesn't clearly match any of the above

Return ONLY a JSON object with this exact structure:
{"eventType": "<one of the above values>"}

Important rules:
- If uncertain, return "none"
- Do not invent categories
- Be generous in matching — casual Indian English, Hinglish, or informal phrasing should still match

User message: "${message}"`;

  const raw = await callGemini(prompt);

  try {
    const parsed = JSON.parse(raw);
    const validTypes = ['wedding', 'new_baby', 'new_vehicle', 'new_home', 'none'];

    if (parsed.eventType && validTypes.includes(parsed.eventType)) {
      return parsed.eventType;
    }
    return 'none';
  } catch {
    return 'none';
  }
}

/**
 * Rephrase gap data conversationally for a life event.
 * The AI may only rephrase the whyNow field — names and premiums are fixed.
 *
 * @param {string} eventType - Normalized event type
 * @param {string} eventLabel - Human-readable label (e.g. "Wedding")
 * @param {Array<{name: string, estimatedPremium: string, whyNow: string}>} gaps - Raw gap data from dataset
 * @returns {Promise<{intro: string, gaps: Array<{name: string, estimatedPremium: string, whyNow: string}>}>}
 */
export async function renderGapsConversationally(eventType, eventLabel, gaps) {
  const gapList = gaps.map(g => `- ${g.name} (${g.estimatedPremium}): ${g.whyNow}`).join('\n');

  const prompt = `You are a warm, knowledgeable insurance advisor for an Indian audience.

The user just experienced a life event: "${eventLabel}".

Here are the coverage gaps that apply to them:
${gapList}

Your job:
1. Write a short, warm introductory sentence (1-2 lines) acknowledging this life event and introducing the recommendations. Be congratulatory if appropriate.
2. For each gap, rewrite ONLY the "whyNow" explanation to be more conversational, warm, and relatable. Keep it concise (2-3 sentences max).

CRITICAL RULES:
- The "name" field must be EXACTLY: ${gaps.map(g => `"${g.name}"`).join(', ')}
- The "estimatedPremium" field must be EXACTLY: ${gaps.map(g => `"${g.estimatedPremium}"`).join(', ')}
- Do NOT change the name or estimatedPremium values AT ALL
- Only rephrase the whyNow text

Return ONLY a JSON object with this exact structure:
{
  "intro": "your introductory sentence here",
  "gaps": [
    {"name": "exact name from above", "estimatedPremium": "exact premium from above", "whyNow": "your rephrased explanation"}
  ]
}`;

  const raw = await callGemini(prompt);
  return JSON.parse(raw);
}

/**
 * Score the sample policy for trustworthiness.
 *
 * @param {string} policyText - The fixed demo policy text
 * @returns {Promise<{score: number, flags: Array<{issue: string, explanation: string, deduction: number}>}>}
 */
export async function scoreTrustPolicy(policyText) {
  const prompt = `You are an AI insurance policy analyst evaluating a policy document for trustworthiness.

Here is the policy document to analyze:

---
${policyText}
---

Score this policy on a 0-100 trust scale using this rubric:
Start at 100 and subtract points for issues found:

1. Hidden or unclear charges: up to -30 points
   - Look for: undisclosed fees, discretionary charges, unclear pricing
2. Vague or ambiguous clause language: up to -25 points
   - Look for: undefined terms, broad discretion clauses, unclear definitions
3. Claim rejection risk signals: up to -25 points
   - Look for: broad exclusions, subjective denial criteria, unclear processes
4. Short or unreasonable claim windows: up to -20 points
   - Look for: tight deadlines, unreasonable notice periods, expiry traps

For each issue found, create a flag with:
- "issue": A short 3-6 word title of the concern
- "explanation": A plain-language explanation (1-2 sentences) that a non-expert can understand
- "deduction": How many points were deducted (positive number)

Return EXACTLY 2-3 flags (the most significant ones).
The final score should equal 100 minus the sum of all deductions.

Return ONLY a JSON object with this exact structure:
{
  "score": <number 0-100>,
  "flags": [
    {"issue": "short title", "explanation": "plain language explanation", "deduction": <number>}
  ]
}`;

  const raw = await callGemini(prompt);
  return JSON.parse(raw);
}
