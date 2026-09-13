/**
 * API service — the ONLY file that calls the backend.
 * No component calls fetch directly. Never logs request payloads.
 */

const API_BASE = 'http://localhost:3001/api';

/**
 * Generic fetch wrapper with error handling.
 * @param {string} endpoint - API endpoint (without /api prefix)
 * @param {object} [body] - Request body (POST only)
 * @returns {Promise<object>} Parsed JSON response
 */
async function apiCall(endpoint, body = null) {
  const options = {
    method: body ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json' },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Classify a free-text life event message.
 * @param {string} message - Raw user text (sent only here, never logged)
 * @param {string} [presetChip] - If provided, skips LLM classification
 * @returns {Promise<{ eventType: string|null, source: string }>}
 */
export async function classifyEvent(message, presetChip) {
  return apiCall('/classify-event', { message, presetChip });
}

/**
 * Get coverage gap recommendations for a detected event type.
 * @param {string} eventType - Normalized event type (never raw message)
 * @returns {Promise<{ eventType: string, intro: string, gaps: Array }>}
 */
export async function getGapRecommendations(eventType) {
  return apiCall('/gap-recommendations', { eventType });
}

/**
 * Get trust score for the demo sample policy.
 * @returns {Promise<{ score: number, flags: Array }>}
 */
export async function getTrustScore() {
  return apiCall('/trust-score', {});
}

/**
 * Request Hindi voiceover via Sarvam API.
 * @param {string} text - Text to translate/speak (AI-generated, never raw user input)
 * @returns {Promise<{ audioUrl?: string, translatedText?: string, unavailable?: boolean }>}
 */
export async function getVoiceover(text) {
  return apiCall('/voiceover', { text, languageCode: 'hi-IN' });
}
