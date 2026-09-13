# Project Memory

## Current Status
Phase 7 — Sarvam Integration completed. All routes and features implemented.

## Completed
- Phase 0: Vite + React client scaffolded, Express server created, all 6 docs, .gitignore, .env.example
- Phase 1: Design system (variables.css, globals.css) with all tokens
- Phase 2: All 9 components and 3 screens built with static data, screen state machine
- Phase 3: gapMapping.json created (server + client fallback), gap route serving real data, api.js service layer
- Phase 4: Gemini classification via llmClient.js, classifyEvent route, server + client validation schemas
- Phase 5: AI gap rendering with conversational phrasing, name/premium validation against dataset
- Phase 6: samplePolicy.js + FALLBACK_SCORE_RESULT, trust-score route, TrustScoreScreen wired to real API
- Phase 7: sarvamClient.js (translate + TTS), voiceover route, VoiceButton wired to real API with audio playback

## Current Phase
Phase 8 (Error Hardening)

## Current File Being Worked On
All files implemented; entering hardening/polish

## Last Completed Task
Wired VoiceButton to Sarvam voiceover API with base64 audio playback and Hindi text fallback

## Next Task
Phase 8: Error hardening — test all failure paths
Phase 9: Demo polish
Phase 10: Full end-to-end testing
Phase 11: Final readiness check

## Known Issues
None — all 3 screens render correctly, all 4 API routes are mounted and functional

## Important Decisions
- Plain JavaScript with JSDoc, not TypeScript, to minimize build friction
- Node/Express thin backend used only to keep API keys server-side, not as general infrastructure
- Local JSON is the source of truth for gap data; AI only rephrases, never invents
- Raw user input is never persisted or logged; only normalized eventType flows downstream past the classify-event route (data-minimization principle)
- Gemini API chosen as LLM provider (user has API key)
- Sarvam AI via direct HTTP calls (user has API key)
- Project created at suraksha-sense/ inside d:\Projects\Suraksha Sense\
- Trust score uses FALLBACK_SCORE_RESULT when API/validation fails
- Gap recommendations fall back to raw dataset when AI rephrasing fails
- Sarvam voiceover degrades gracefully: audio → translated text → "unavailable" message

## Do Not Change
- The gap-mapping dataset values in Section 11
- The Trust Score rubric ceilings in Section 13
- The three-screen MVP scope in Section 1
- The data-minimization boundary — raw message must never be logged, stored, or forwarded past classification
