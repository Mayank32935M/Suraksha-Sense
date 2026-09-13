/**
 * Sarvam AI client — wraps Sarvam API HTTP calls for Hindi translation and TTS.
 * Called server-side only (API key protected).
 * Never receives raw user input — only AI-generated summary text.
 */

import dotenv from 'dotenv';
dotenv.config();

const SARVAM_API_KEY = process.env.SARVAM_API_KEY;
const SARVAM_TRANSLATE_URL = 'https://api.sarvam.ai/translate';
const SARVAM_TTS_URL = 'https://api.sarvam.ai/text-to-speech';

/**
 * Translate English text to Hindi via Sarvam API.
 * @param {string} text - English text to translate
 * @returns {Promise<string>} Hindi translated text
 */
export async function translateToHindi(text) {
  if (!SARVAM_API_KEY) {
    throw new Error('SARVAM_API_KEY not configured');
  }

  const response = await fetch(SARVAM_TRANSLATE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-subscription-key': SARVAM_API_KEY,
    },
    body: JSON.stringify({
      input: text,
      source_language_code: 'en-IN',
      target_language_code: 'hi-IN',
      speaker_gender: 'Female',
      mode: 'formal',
      model: 'mayura:v1',
      enable_preprocessing: true,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Sarvam translate error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  return data.translated_text || text;
}

/**
 * Generate Hindi TTS audio via Sarvam API.
 * @param {string} hindiText - Hindi text to speak
 * @returns {Promise<string>} Base64-encoded audio data
 */
export async function textToSpeech(hindiText) {
  if (!SARVAM_API_KEY) {
    throw new Error('SARVAM_API_KEY not configured');
  }

  const response = await fetch(SARVAM_TTS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-subscription-key': SARVAM_API_KEY,
    },
    body: JSON.stringify({
      inputs: [hindiText],
      target_language_code: 'hi-IN',
      speaker: 'meera',
      pitch: 0,
      pace: 1.0,
      loudness: 1.5,
      speech_sample_rate: 22050,
      enable_preprocessing: true,
      model: 'bulbul:v1',
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Sarvam TTS error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  
  // Sarvam returns audios as base64 array
  if (data.audios && data.audios.length > 0) {
    return data.audios[0];
  }

  throw new Error('No audio data in Sarvam response');
}
