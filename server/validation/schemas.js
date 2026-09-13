/**
 * Validation schemas — validates every AI response shape before returning to client.
 * Raw/unvalidated AI output is never rendered directly.
 */

const VALID_EVENT_TYPES = ['wedding', 'new_baby', 'new_vehicle', 'new_home', 'none'];

/**
 * Validate classification response from AI.
 * @param {*} data - Parsed AI response
 * @returns {{ valid: boolean, eventType: string }}
 */
export function validateClassification(data) {
  if (!data || typeof data !== 'object') {
    return { valid: false, eventType: 'none' };
  }

  if (!data.eventType || !VALID_EVENT_TYPES.includes(data.eventType)) {
    return { valid: false, eventType: 'none' };
  }

  return { valid: true, eventType: data.eventType };
}

/**
 * Validate gap recommendations response from AI.
 * Ensures names and premiums match the source dataset exactly.
 *
 * @param {*} aiResponse - Parsed AI response
 * @param {Array<{name: string, estimatedPremium: string, whyNow: string}>} sourceGaps - Original gap data from dataset
 * @returns {{ valid: boolean, data: { intro: string, gaps: Array } | null }}
 */
export function validateGapResponse(aiResponse, sourceGaps) {
  if (!aiResponse || typeof aiResponse !== 'object') {
    return { valid: false, data: null };
  }

  if (typeof aiResponse.intro !== 'string' || !aiResponse.intro.trim()) {
    return { valid: false, data: null };
  }

  if (!Array.isArray(aiResponse.gaps) || aiResponse.gaps.length !== sourceGaps.length) {
    return { valid: false, data: null };
  }

  // Verify each gap's name and premium match the source exactly
  const validatedGaps = [];
  for (let i = 0; i < sourceGaps.length; i++) {
    const aiGap = aiResponse.gaps[i];
    const sourceGap = sourceGaps[i];

    if (!aiGap || typeof aiGap !== 'object') {
      return { valid: false, data: null };
    }

    // Names and premiums MUST match exactly
    if (aiGap.name !== sourceGap.name || aiGap.estimatedPremium !== sourceGap.estimatedPremium) {
      return { valid: false, data: null };
    }

    if (typeof aiGap.whyNow !== 'string' || !aiGap.whyNow.trim()) {
      return { valid: false, data: null };
    }

    validatedGaps.push({
      name: sourceGap.name,
      estimatedPremium: sourceGap.estimatedPremium,
      whyNow: aiGap.whyNow,
    });
  }

  return {
    valid: true,
    data: {
      intro: aiResponse.intro.trim(),
      gaps: validatedGaps,
    },
  };
}

/**
 * Validate trust score response from AI.
 * Score must be 0-100, with 1-3 flags each having issue, explanation, deduction.
 *
 * @param {*} data - Parsed AI response
 * @returns {{ valid: boolean, data: { score: number, flags: Array } | null }}
 */
export function validateTrustScore(data) {
  if (!data || typeof data !== 'object') {
    return { valid: false, data: null };
  }

  // Score must be a number
  if (typeof data.score !== 'number' || isNaN(data.score)) {
    return { valid: false, data: null };
  }

  // Clamp score to 0-100
  const score = Math.max(0, Math.min(100, Math.round(data.score)));

  // Must have 1-3 flags
  if (!Array.isArray(data.flags) || data.flags.length < 1 || data.flags.length > 3) {
    return { valid: false, data: null };
  }

  const validatedFlags = [];
  for (const flag of data.flags) {
    if (!flag || typeof flag !== 'object') {
      return { valid: false, data: null };
    }

    if (typeof flag.issue !== 'string' || !flag.issue.trim()) {
      return { valid: false, data: null };
    }

    if (typeof flag.explanation !== 'string' || !flag.explanation.trim()) {
      return { valid: false, data: null };
    }

    if (typeof flag.deduction !== 'number' || isNaN(flag.deduction) || flag.deduction < 0) {
      return { valid: false, data: null };
    }

    validatedFlags.push({
      issue: flag.issue.trim(),
      explanation: flag.explanation.trim(),
      deduction: Math.round(flag.deduction),
    });
  }

  return {
    valid: true,
    data: { score, flags: validatedFlags },
  };
}
