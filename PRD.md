# Suraksha Sense — Product Requirements Document

## Product Overview

**Suraksha Sense** is an AI-powered insurance gap detection and trust verification tool built for the Paytm Build for India AI Hackathon — Delhi Edition, Track 2: AI-Powered Financial Journeys.

**One-line pitch:** An AI that notices when your life changes — marriage, a baby, a new vehicle — and tells you what insurance gap that just opened, then proves the recommended policy is actually trustworthy before you buy it.

**Emotional core:** *"Your life changed. Your financial protection should change with it."*

This is **not** a chatbot. This is **not** an insurance marketplace. It is a **proactive nudge + trust verification** experience.

---

## Problem

When major life events occur — a wedding, a baby, buying a vehicle or home — people's insurance needs change dramatically, but:
1. Most people don't know what coverage gaps just opened.
2. Even when they find a policy, they can't tell if the fine print is trustworthy.
3. Existing tools either overwhelm with choices or offer no transparency.

---

## Solution

**The Trust Loop** — the core product mechanic:
1. **Detect** a life event (typed or tapped).
2. **Map** the event to relevant coverage gaps (from a local dataset — never invented by AI).
3. **Present** those gaps conversationally, with illustrative premiums and a reason.
4. **Inspect** — let the user select one recommendation to review.
5. **Score** a policy document for trustworthiness, 0–100, with explainable deductions.
6. **Explain** the flags in plain language.
7. **Speak** — offer a Hindi voice/translation moment via Sarvam AI.

---

## Targeted User

First-time or under-insured Indians going through a major life event who want straightforward, trustworthy guidance on what coverage they may be missing — without needing to understand insurance jargon or navigate marketplace complexity.

---

## Product Goals

- Complete the happy-path demo in under 90 seconds.
- Feel trustworthy, calm, and rooted in Indian financial accessibility.
- Prove that AI can add genuine value to insurance discovery without replacing human judgment.
- Demonstrate responsible AI use — the AI interprets and presents, never invents.

---

## Non-Goals

- Real Paytm/insurance API integration
- Live policy search
- Real purchasing capability
- User accounts or authentication
- Persistence or databases
- Document upload or OCR
- Agentic multi-step automation
- Autonomous transactions
- A recommendation engine beyond the static lookup table
- Multilingual support beyond one working Hindi moment

---

## Core User Journey

```
Life Event Screen
  → user types "Just got married" OR taps "Wedding" chip
  → (PrivacyNote visible near the input at all times)

Gap Screen
  → AI/local data shows 2-3 gap cards (e.g. Spouse Health Cover, Term Life Top-up, Joint Savings Plan)
  → user taps "Review Policy →" on one card

Trust Score Screen
  → fixed demo policy is scored → score + 2-3 flags shown
  → user taps "Listen in Hindi" / "सुनें"
  → Sarvam-powered Hindi voice/translation moment plays
```

---

## Features

### Screen 1: Life Event Input
- Free text input box for describing life events
- 4 preset chips: Wedding, New Baby, New Vehicle, New Home
- Persistent PrivacyNote component visible near input
- Chip selection bypasses AI classification entirely

### Screen 2: Coverage Gap Output
- 2-3 gap cards per detected event
- Each card shows: name, estimated premium, reason ("why now")
- "Review Policy →" action on each card to proceed to trust scoring
- AI rephrases the "whyNow" text conversationally; names/premiums always from local dataset

### Screen 3: Trust Score
- Circular score display (0–100) with color-coded ring
- 2-3 explainable flag cards with severity-colored accents
- "AI Trust Assessment" badge (never implies official/regulatory rating)
- "Listen in Hindi" / "सुनें" voice button
- Disclaimer caption: "This is an AI-assisted demo assessment, not a certified financial or legal rating."

---

## MVP Scope

Build **exactly** three screens. If a feature does not directly serve the 90-second happy-path demo, leave it out.

---

## AI Responsibilities

AI is used **ONLY** for:
1. Classifying a life event from free text
2. Rendering the local gap-mapping data conversationally
3. Scoring the fixed demo policy against the trust rubric
4. Plain-language explanation of flags
5. Preparing text for Sarvam translation/TTS

---

## AI Boundaries

AI must **NEVER**:
- Invent insurance products, premiums, or policy clauses
- Fabricate regulatory claims
- Override the local gap-mapping dataset
- Silently alter the scoring rubric
- Present demo premiums or the demo policy as real/live data
- Make definitive legal or financial recommendations
- Retain, log, or forward raw user input beyond classification

The local JSON dataset is the source of truth for what coverage gaps exist. The AI's job is interpretation and presentation, never invention.

---

## Privacy & Data Minimization

This section is a binding principle across every route, screen, and log statement.

- **No personal data collection.** No name, phone, email, Aadhaar, PAN, address, DOB, payment info, or user accounts.
- **Raw input is transient.** The user's free-text message is used ONLY to determine the normalized `eventType`. Once classified, the raw message is discarded.
- **Never persisted.** Raw messages must never be written to: database, localStorage, cookies, analytics, server logs, or memory.md.
- **Minimum necessary to external services.** Only the classify-event call needs the raw message. No other call ever needs it.
- **UI transparency.** A visible PrivacyNote states the data-minimization approach accurately — does not overpromise.
- **Future scope guardrail.** Persistent data features require a separate privacy/security design pass.

---

## Trust Score Requirements

- **Rubric:** Start at 100, subtract using 4 categories:
  - Hidden/unclear charges: up to −30
  - Vague/ambiguous clause language: up to −25
  - Claim rejection risk signals: up to −25
  - Short/unreasonable claim windows: up to −20
- **Clamped** to 0–100 range server-side
- **Labeled** as "AI Trust Assessment" — never an official rating
- **Disclaimer** caption required on the Trust Score screen
- **Validated** before rendering — schema checks on score range and flag structure

---

## Sarvam Requirements

- Hindi translation and/or TTS via Sarvam AI API
- Called server-side only (API key protected)
- Voice button on Trust Score screen: "🎙️ Listen in Hindi" / "सुनें"
- Shows "Playing…" state during playback
- On failure: "Voice temporarily unavailable" — never breaks the screen

---

## Error/Fallback Behaviour

| Failure | Fallback |
|---|---|
| Classification fails | Chip selection always works (no LLM); free-text failure shows friendly message + keeps chips visible |
| Gap recommendations fail | Render raw `gapMapping.json` entries with generic intro |
| Trust score fails | Show hardcoded `FALLBACK_SCORE_RESULT` |
| Sarvam fails | Show Hindi text (or English) + "Voice temporarily unavailable" |
| Any server error | Structured `{ error: true, message }` — never raw input or stack trace |

---

## Success Criteria

- [ ] Project runs locally (client + server) with documented steps
- [ ] Main UI loads without console errors
- [ ] User can enter free-text life event
- [ ] All 4 preset chips work
- [ ] All 4 life-event flows work end-to-end
- [ ] Event classification works for free text
- [ ] Local gap data matches Section 11 exactly
- [ ] Gap recommendations render correctly
- [ ] Trust Score screen works with real scoring
- [ ] Sample policy is clearly labeled fictional
- [ ] Trust Score rubric matches requirements, score always 0–100
- [ ] AI response validated before rendering
- [ ] Flags display clearly
- [ ] Hindi/Sarvam voice moment works or falls back gracefully
- [ ] No API failure crashes the app
- [ ] No API key exposed in client code
- [ ] No PII collected
- [ ] Raw user message never persisted or forwarded past classification
- [ ] No error message contains raw user input
- [ ] PrivacyNote visible and accurate
- [ ] Responsive layout works across breakpoints
- [ ] Happy-path demo completes in under 90 seconds
- [ ] All documentation files exist and are populated

---

## Future / Stretch Features (NOT for MVP)

- Real insurance API integration
- Multiple language support beyond Hindi
- Document upload and OCR for real policy scoring
- User accounts and personalization
- Persistent history/recommendations
- Real premium calculations
- Marketplace integration
