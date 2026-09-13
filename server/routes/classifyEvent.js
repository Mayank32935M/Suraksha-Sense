import express from 'express';
import { classifyEvent } from '../services/llmClient.js';

const router = express.Router();

const VALID_CHIPS = ['wedding', 'new_baby', 'new_vehicle', 'new_home'];

/**
 * POST /api/classify-event
 * Request:  { message?: string, presetChip?: string }
 * Response: { eventType: string|null, source: "chip"|"classified"|"fallback" }
 *
 * If presetChip is provided and valid → bypass LLM entirely.
 * Otherwise classify free-text via Gemini.
 * Raw message is NEVER echoed in the response, NEVER logged.
 */
router.post('/classify-event', async (req, res) => {
  try {
    const { message, presetChip } = req.body;

    // Chip bypass — no AI call needed
    if (presetChip && VALID_CHIPS.includes(presetChip)) {
      return res.json({
        eventType: presetChip,
        source: 'chip',
      });
    }

    // Free-text classification via LLM
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.json({
        error: true,
        message: 'Please describe a life event or select one of the preset options.',
      });
    }

    const eventType = await classifyEvent(message);
    // Raw message is discarded here — only eventType flows downstream

    if (eventType === 'none') {
      return res.json({
        eventType: null,
        source: 'fallback',
        message: "We couldn't match that to a specific life event. Try one of the preset options, or describe a wedding, new baby, new vehicle, or new home.",
      });
    }

    return res.json({
      eventType,
      source: 'classified',
    });
  } catch (err) {
    // Never log the raw message in error output
    console.error('Classification error:', err.message);
    return res.json({
      error: true,
      message: 'Unable to analyze your message right now. Please try one of the preset options.',
    });
  }
});

export default router;
