import express from 'express';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { renderGapsConversationally } from '../services/llmClient.js';
import { validateGapResponse } from '../validation/schemas.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** Load gap mapping from local JSON (source of truth) */
let gapMapping = null;
async function loadGapMapping() {
  if (!gapMapping) {
    const raw = await readFile(join(__dirname, '..', 'data', 'gapMapping.json'), 'utf-8');
    gapMapping = JSON.parse(raw);
  }
  return gapMapping;
}

const VALID_EVENT_TYPES = ['wedding', 'new_baby', 'new_vehicle', 'new_home'];

/**
 * POST /api/gap-recommendations
 * Request:  { eventType: string }
 * Response: { eventType, intro, gaps: [{ name, estimatedPremium, whyNow }] }
 *
 * 1. Loads raw gap data from gapMapping.json (source of truth)
 * 2. Sends to Gemini for conversational rephrasing
 * 3. Validates AI output — names/premiums must match dataset exactly
 * 4. Falls back to raw data if AI fails or returns invalid response
 */
router.post('/gap-recommendations', async (req, res) => {
  try {
    const { eventType } = req.body;

    if (!eventType || !VALID_EVENT_TYPES.includes(eventType)) {
      return res.json({
        error: true,
        message: 'Please select a valid life event to see coverage recommendations.',
      });
    }

    const mapping = await loadGapMapping();
    const eventData = mapping[eventType];

    if (!eventData) {
      return res.json({
        error: true,
        message: 'Coverage data not available for this event type.',
      });
    }

    // Raw fallback data (used if AI fails)
    const rawFallback = {
      eventType,
      intro: `Here are the coverage gaps we found for your ${eventData.label.toLowerCase()} event:`,
      gaps: eventData.gaps,
    };

    // Attempt AI-rendered conversational version
    try {
      const aiResult = await renderGapsConversationally(eventType, eventData.label, eventData.gaps);
      const validated = validateGapResponse(aiResult, eventData.gaps);

      if (validated.valid) {
        return res.json({
          eventType,
          intro: validated.data.intro,
          gaps: validated.data.gaps,
        });
      }

      // AI response didn't pass validation — fall back to raw data
      console.error('Gap rendering validation failed — using raw data fallback');
      return res.json(rawFallback);
    } catch (aiErr) {
      // AI call failed entirely — fall back to raw data
      console.error('Gap rendering AI error:', aiErr.message, '— using raw data fallback');
      return res.json(rawFallback);
    }
  } catch (err) {
    console.error('Gap recommendations error:', err.message);
    return res.json({
      error: true,
      message: 'Unable to load coverage recommendations. Please try again.',
    });
  }
});

export default router;
