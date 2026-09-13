import express from 'express';
import { translateToHindi, textToSpeech } from '../services/sarvamClient.js';

const router = express.Router();

/**
 * POST /api/voiceover
 * Request:  { text: string, languageCode: "hi-IN" }
 * Response: { audioBase64, translatedText } or { unavailable: true, fallbackText }
 *
 * Translates the AI-generated summary to Hindi, then generates TTS.
 * Never receives raw user input — only AI-generated text.
 * On any failure: returns { unavailable: true } — never crashes the screen.
 */
router.post('/voiceover', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.json({
        unavailable: true,
        fallbackText: 'No text provided for voiceover.',
      });
    }

    // Step 1: Translate to Hindi
    let hindiText;
    try {
      hindiText = await translateToHindi(text);
    } catch (translateErr) {
      console.error('Sarvam translate error:', translateErr.message);
      return res.json({
        unavailable: true,
        fallbackText: 'Voice temporarily unavailable. Translation service is not responding.',
      });
    }

    // Step 2: Generate TTS audio
    try {
      const audioBase64 = await textToSpeech(hindiText);
      return res.json({
        audioBase64,
        translatedText: hindiText,
      });
    } catch (ttsErr) {
      console.error('Sarvam TTS error:', ttsErr.message);
      // Translation worked but TTS failed — return translated text at least
      return res.json({
        unavailable: true,
        translatedText: hindiText,
        fallbackText: 'Voice temporarily unavailable. Here is the Hindi translation:',
      });
    }
  } catch (err) {
    console.error('Voiceover error:', err.message);
    return res.json({
      unavailable: true,
      fallbackText: 'Voice temporarily unavailable.',
    });
  }
});

export default router;
