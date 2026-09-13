/**
 * Client-side validation utilities.
 * Validates shapes coming back from services/api.js before use.
 */

const VALID_EVENT_TYPES = ['wedding', 'new_baby', 'new_vehicle', 'new_home'];

/**
 * Validate classification API response.
 * @param {*} data - API response
 * @returns {{ valid: boolean, eventType: string|null, source: string, message?: string }}
 */
export function validateClassifyResponse(data) {
  if (!data || typeof data !== 'object') {
    return { valid: false, eventType: null, source: 'fallback' };
  }

  // Error response from server
  if (data.error) {
    return { valid: false, eventType: null, source: 'fallback', message: data.message };
  }

  // Fallback (none) response
  if (data.source === 'fallback') {
    return { valid: true, eventType: null, source: 'fallback', message: data.message };
  }

  // Valid classification
  if (data.eventType && VALID_EVENT_TYPES.includes(data.eventType)) {
    return { valid: true, eventType: data.eventType, source: data.source || 'classified' };
  }

  return { valid: false, eventType: null, source: 'fallback' };
}

/**
 * Validate gap recommendations API response.
 * @param {*} data - API response
 * @returns {{ valid: boolean, intro?: string, gaps?: Array }}
 */
export function validateGapResponse(data) {
  if (!data || typeof data !== 'object') {
    return { valid: false };
  }

  if (data.error) {
    return { valid: false, message: data.message };
  }

  if (!Array.isArray(data.gaps) || data.gaps.length === 0) {
    return { valid: false };
  }

  // Verify each gap has required fields
  for (const gap of data.gaps) {
    if (!gap.name || !gap.estimatedPremium || !gap.whyNow) {
      return { valid: false };
    }
  }

  return {
    valid: true,
    intro: data.intro || '',
    gaps: data.gaps,
  };
}

/**
 * Validate trust score API response.
 * @param {*} data - API response
 * @returns {{ valid: boolean, score?: number, flags?: Array }}
 */
export function validateTrustScoreResponse(data) {
  if (!data || typeof data !== 'object') {
    return { valid: false };
  }

  if (data.error) {
    return { valid: false, message: data.message };
  }

  if (typeof data.score !== 'number' || data.score < 0 || data.score > 100) {
    return { valid: false };
  }

  if (!Array.isArray(data.flags) || data.flags.length < 1) {
    return { valid: false };
  }

  return {
    valid: true,
    score: data.score,
    flags: data.flags,
  };
}
