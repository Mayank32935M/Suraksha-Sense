import express from 'express';
import { scoreTrustPolicy } from '../services/llmClient.js';
import { validateTrustScore } from '../validation/schemas.js';
import { SAMPLE_POLICY_TEXT, FALLBACK_SCORE_RESULT } from '../data/samplePolicy.js';

const router = express.Router();

/**
 * POST /api/trust-score
 * Request:  {} — always scores the fixed demo policy
 * Response: { score: number, flags: [{ issue, explanation, deduction }] }
 *
 * No user data is involved — the policy text is hardcoded server-side.
 * Falls back to FALLBACK_SCORE_RESULT on any error.
 */
router.post('/trust-score', async (req, res) => {
  try {
    const aiResult = await scoreTrustPolicy(SAMPLE_POLICY_TEXT);
    const validated = validateTrustScore(aiResult);

    if (validated.valid) {
      return res.json(validated.data);
    }

    // AI response didn't pass validation — use fallback
    console.error('Trust score validation failed — using fallback');
    return res.json(FALLBACK_SCORE_RESULT);
  } catch (err) {
    console.error('Trust score error:', err.message, '— using fallback');
    return res.json(FALLBACK_SCORE_RESULT);
  }
});

export default router;
