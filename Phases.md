# Suraksha Sense — Implementation Phases

Work through these sequentially. Do not start a phase until the previous phase's acceptance criteria are met and the app runs without errors.

---

## Phase 0 — Project Setup

**Objective:** Scaffold both `client/` (Vite + React) and `server/` (Express) with the folder structure from Section 5.

**Files:**
- Root `.gitignore`
- `client/` — Vite + React scaffold with all subdirectories
- `server/` — Express scaffold with all subdirectories
- `server/.env.example` — documents required env vars
- All 6 documentation files (PRD.md, Architecture.md, rules.md, Phases.md, design.md, memory.md)

**Acceptance Criteria:**
- `npm install` succeeds in both `client/` and `server/`
- A placeholder client renders "Suraksha Sense"
- A placeholder server responds 200 on a health-check route

**Do Not Touch Yet:** Any AI integration, any real UI screens.

---

## Phase 1 — Design System

**Objective:** Implement `client/src/styles/variables.css` and `globals.css` per the design system specification.

**Files:**
- `client/src/styles/variables.css` — all CSS custom properties (colors, typography, spacing, radius, shadows)
- `client/src/styles/globals.css` — CSS reset, base typography with Inter font, layout utilities

**Acceptance Criteria:**
- Tokens are defined and visually verifiable via a temporary style-guide page (can be deleted after)

**Do Not Touch Yet:** Component or screen implementation.

---

## Phase 2 — Static UI (No Data, No AI)

**Objective:** Build all 3 screens and all components with hardcoded/placeholder content, wired together by a simple screen-state machine in `App.jsx`. Include the `PrivacyNote` component on Screen 1 even with static content.

**Files:**
- All 9 components in `client/src/components/`
- All 3 screens in `client/src/screens/`
- `client/src/App.jsx` — screen state machine

**Dependencies:** Phase 1 (design tokens must exist)

**Acceptance Criteria:**
- User can click through Screen 1 → 2 → 3 → back
- All screens show static placeholder content
- No console errors
- PrivacyNote visible on Screen 1

**Do Not Touch Yet:** API integration, server routes, AI calls.

---

## Phase 3 — Local Gap-Mapping Data

**Objective:** Create the canonical gap-mapping datasets and wire Screen 2 to render real (non-AI-processed) gap data for a hardcoded event.

**Files:**
- `server/data/gapMapping.json` — canonical gap dataset (exact content from Section 11)
- `client/src/data/gapMappingFallback.json` — mirror copy for offline fallback
- `server/routes/gapRecommendations.js` — serves raw gap data by eventType
- `client/src/services/api.js` — fetch wrapper for `/api/*`

**Dependencies:** Phase 2 (screens and components must exist)

**Acceptance Criteria:**
- Selecting any of the 4 chips shows that event's real gap data
- Gap data is unprocessed by AI
- Names and premiums match Section 11 exactly

**Do Not Touch Yet:** AI classification, LLM rendering of gap text.

---

## Phase 4 — AI Event Classification

**Objective:** Implement `/api/classify-event`, the `llmClient.js` classification function, and wire the free-text input path. Chip taps continue to bypass the LLM.

**Files:**
- `server/services/llmClient.js` — Gemini classification function
- `server/routes/classifyEvent.js` — POST `/api/classify-event`
- `server/validation/schemas.js` — classification response validator
- `client/src/utils/validation.js` — client-side shape validators

**Dependencies:** Phase 3 (gap data must be wired)

**Acceptance Criteria:**
- Typing "Just got married" correctly routes to the wedding gap set
- An unrelated message triggers the fallback message without crashing
- Chip taps bypass the LLM entirely
- Server logs never contain the raw message
- App.jsx state holds only `eventType` after classification, never the raw message

**Do Not Touch Yet:** AI-rendered gap text, trust scoring.

---

## Phase 5 — Gap Output (AI-Rendered)

**Objective:** Implement `/api/gap-recommendations` with the gap-rendering prompt and response validation. Replace Phase 3's raw rendering with the conversational AI version, falling back to raw data on failure.

**Files:**
- `server/routes/gapRecommendations.js` — add LLM rendering with validation
- `server/services/llmClient.js` — add gap-rendering function
- `server/validation/schemas.js` — add gap response validator

**Dependencies:** Phase 4 (classification must work)

**Acceptance Criteria:**
- Gap cards show natural, conversational phrasing
- Names and premiums are byte-for-byte identical to `gapMapping.json`
- Forcing an API failure (e.g. temporarily invalid key) still shows correct raw data via fallback

---

## Phase 6 — Trust Score

**Objective:** Implement `/api/trust-score`, `server/data/samplePolicy.js`, the trust-score prompt, validation, and the `ScoreRing`/`FlagCard` components with real data.

**Files:**
- `server/data/samplePolicy.js` — fictional policy text + fallback result
- `server/routes/trustScore.js` — POST `/api/trust-score`
- `server/services/llmClient.js` — add trust-scoring function
- `server/validation/schemas.js` — add trust-score validator
- `client/src/screens/TrustScoreScreen.jsx` — wire to real API

**Dependencies:** Phase 5 (gap rendering must work)

**Acceptance Criteria:**
- Trust Score screen shows a score 0–100 and 2–3 flags with real deductions
- Score is clamped to 0–100
- Forcing an API failure shows `FALLBACK_SCORE_RESULT` instead of empty screen
- "AI Trust Assessment" label and disclaimer caption are visible

---

## Phase 7 — Sarvam Integration

**Objective:** Implement `/api/voiceover`, `server/services/sarvamClient.js`, and wire `VoiceButton` on the Trust Score screen.

**Files:**
- `server/services/sarvamClient.js` — Sarvam API wrapper
- `server/routes/voiceover.js` — POST `/api/voiceover`
- `client/src/components/VoiceButton.jsx` — wire to voiceover API

**Dependencies:** Phase 6 (trust score must work)

**Acceptance Criteria:**
- Tapping the voice button plays or shows Hindi output
- Disconnecting Sarvam access shows "Voice temporarily unavailable"
- The rest of the Trust Score screen remains functional

---

## Phase 8 — Error Handling and Fallbacks (Hardening Pass)

**Objective:** Deliberately test every failure path (bad API key, network timeout, malformed JSON from the model) and confirm every one degrades gracefully. Also verify no raw user input appears anywhere in server logs, browser console, or error responses.

**Dependencies:** Phase 7 (all features must be implemented)

**Acceptance Criteria:**
- No combination of failures produces a blank screen
- No unhandled exceptions
- No frozen loading states
- Manual log/network inspection confirms zero raw-message leakage
- All error paths from the fallback table are verified

---

## Phase 9 — Demo Polish

**Objective:** Tighten spacing, loading-state copy, transition smoothness, and confirm the design system is applied consistently across all 3 screens.

**Dependencies:** Phase 8 (error handling must be solid)

**Acceptance Criteria:**
- The full happy path feels smooth and completes in under 90 seconds when demoed aloud
- Design tokens are consistently applied
- Loading states have appropriate copy
- Transitions feel natural

---

## Phase 10 — Testing

**Objective:** Manually verify all 4 life-event flows (wedding, new baby, new vehicle, new home) end-to-end, plus the free-text classification path and every fallback.

**Dependencies:** Phase 9 (polish must be complete)

**Acceptance Criteria:**
- Every checkbox in the acceptance criteria list passes
- All 4 event flows work end-to-end
- Free-text classification works correctly
- All fallback behaviors verified

---

## Phase 11 — Final Hackathon Readiness

**Objective:** Confirm `.env` is git-ignored and not committed, README explains how to run both client and server locally, and `memory.md` reflects final project state without ever containing raw user input.

**Dependencies:** Phase 10 (testing must be complete)

**Acceptance Criteria:**
- `.env` is git-ignored
- README has clear setup and run instructions
- `memory.md` reflects final project state accurately
- A fresh clone + `npm install` + documented run steps produces a working demo
- No manual fixes needed
