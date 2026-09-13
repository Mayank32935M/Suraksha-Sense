# Suraksha Sense — Architecture Document

## Architecture Overview

Suraksha Sense is a three-layer web application:

1. **Client** — React (Vite) SPA rendering 3 screens
2. **Server** — Thin Node/Express API proxy that holds API keys and calls external services
3. **External Services** — Gemini API (LLM) and Sarvam AI (Hindi TTS/translation)

The server exists **only** to keep API keys server-side and avoid CORS issues. It is not a general-purpose backend — there is no database, no ORM, no persistence.

```
┌──────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   React App  │────▶│  Express Server  │────▶│   Gemini API    │
│  (3 screens) │◀────│  (4 routes)      │◀────│   Sarvam API    │
└──────────────┘     │  + Local JSON    │     └─────────────────┘
                     └──────────────────┘
```

---

## User Flow

```
┌─────────────────────┐
│  Life Event Screen  │  User types text or taps a chip
│  (Screen 1)         │
└────────┬────────────┘
         │ eventType (normalized)
         ▼
┌─────────────────────┐
│  Gap Screen         │  2-3 coverage gap cards shown
│  (Screen 2)         │
└────────┬────────────┘
         │ "Review Policy →"
         ▼
┌─────────────────────┐
│  Trust Score Screen  │  Score 0-100 + flags + Hindi voice
│  (Screen 3)          │
└──────────────────────┘
```

---

## Application Flow

```
User Input
  │
  ├─ Chip tapped ──────────────────────▶ eventType (no AI call)
  │
  └─ Free text ──▶ POST /api/classify-event ──▶ Gemini classifies
                         │                          │
                         │ eventType ◀──────────────┘
                         │ (raw message discarded here)
                         ▼
              POST /api/gap-recommendations
                         │
                         ├─ Read gapMapping.json (source of truth)
                         ├─ Send to Gemini for conversational phrasing
                         ├─ Validate: names/premiums must match dataset
                         │
                         ▼
              User selects a gap card → "Review Policy →"
                         │
                         ▼
              POST /api/trust-score
                         │
                         ├─ Fixed demo policy text (never user-supplied)
                         ├─ Gemini scores against rubric
                         ├─ Validate: score 0-100, 1-3 flags
                         │
                         ▼
              POST /api/voiceover (on button press)
                         │
                         ├─ AI-generated summary text → Sarvam
                         ├─ Returns audio URL or translated text
                         │
                         ▼
              Hindi voice moment plays
```

---

## Data Flow

### Classification (raw message boundary)
```
Client text input ──▶ POST /api/classify-event ──▶ Gemini API
                              │
                              ▼
                      { eventType: "wedding" }
                              │
                     ┌────────┴────────┐
                     │ Raw message     │
                     │ STOPS HERE      │
                     │ Never logged,   │
                     │ never forwarded │
                     └─────────────────┘
```

### Gap Recommendations (eventType only)
```
{ eventType } ──▶ POST /api/gap-recommendations
                         │
                         ├─▶ gapMapping.json (lookup)
                         ├─▶ Gemini API (rephrase whyNow only)
                         │
                         ▼
                  { intro, gaps[] }
```

### Trust Score (no user data at all)
```
POST /api/trust-score ──▶ samplePolicy.js (fixed text)
                              │
                              ▼
                         Gemini API (score against rubric)
                              │
                              ▼
                      { score, flags[] }
```

---

## AI Flow

| Use Case | Input | Output | AI Boundary |
|---|---|---|---|
| Event classification | Raw user message | One of: wedding, new_baby, new_vehicle, new_home, none | Must return exactly one token; anything else → `none` |
| Gap rendering | eventType + raw gap JSON | Conversational intro + rephrased whyNow | Must NOT alter gap names or premiums |
| Trust scoring | Fixed demo policy text | Score 0-100 + 2-3 flags | Must follow rubric ceilings; score clamped server-side |
| Voiceover prep | AI-generated summary | Text for Sarvam input | Never receives raw user input |

All AI responses are requested as strict JSON and validated server-side before being returned to the client. Raw/unvalidated AI output is never rendered directly.

---

## Trust Score Flow

1. Client calls `POST /api/trust-score` with empty body
2. Server reads `SAMPLE_POLICY_TEXT` from `server/data/samplePolicy.js`
3. Server sends policy text + scoring prompt to Gemini
4. Gemini returns `{ score, flags[] }`
5. Server validates: score is number 0-100 (clamp if needed), flags array length 1-3, each flag has non-empty issue + explanation
6. If validation fails → return `FALLBACK_SCORE_RESULT`
7. Client renders ScoreRing + FlagCards

---

## Sarvam Flow

1. User taps "Listen in Hindi" on Trust Score screen
2. Client calls `POST /api/voiceover` with `{ text, languageCode: "hi-IN" }`
3. Server calls Sarvam API for translation/TTS
4. On success: return `{ audioUrl }` or `{ translatedText }`
5. On failure: return `{ unavailable: true, fallbackText }` — never throw

---

## API Layer

### `POST /api/classify-event`
- **Request:** `{ message?: string, presetChip?: string }`
- **Response:** `{ eventType: string | null, source: "chip" | "classified" | "fallback" }`
- If `presetChip` present → skip LLM, return directly
- Raw message never echoed in response

### `POST /api/gap-recommendations`
- **Request:** `{ eventType: string }` — never receives raw message
- **Response:** `{ eventType, intro, gaps: [{ name, estimatedPremium, whyNow }] }`
- Names/premiums must match `gapMapping.json` exactly

### `POST /api/trust-score`
- **Request:** `{}` — always scores fixed demo policy
- **Response:** `{ score: number, flags: [{ issue, explanation, deduction }] }`
- Score clamped to 0-100

### `POST /api/voiceover`
- **Request:** `{ text: string, languageCode: "hi-IN" }`
- **Response:** `{ audioUrl }` or `{ translatedText }` or `{ unavailable: true, fallbackText }`

---

## Local Data Layer

### `server/data/gapMapping.json`
Canonical source of truth for all coverage gaps. Contains 4 event types, each with 2-3 gaps including name, estimated premium, and whyNow explanation.

### `client/src/data/gapMappingFallback.json`
Mirror copy used only if the server is unreachable. Client-side offline fallback.

### `server/data/samplePolicy.js`
Fixed fictional policy text for trust scoring demo. Also exports `FALLBACK_SCORE_RESULT` for error scenarios.

---

## Error Handling

| Failure | Behavior |
|---|---|
| Classification fails | Chips still work (no LLM); free-text → friendly message + chips visible |
| Gap recommendations fail | Render raw gapMapping.json with generic intro |
| Trust score fails | Show FALLBACK_SCORE_RESULT |
| Sarvam fails | Show text + "Voice temporarily unavailable" |
| Server error | Structured `{ error: true, message }` (HTTP 200) |

All error messages use generic, safe strings — never raw input or stack traces.

---

## Privacy & Data Flow Boundaries

- Raw user message exists only between client text input and `/api/classify-event`
- After classification returns `{ eventType }`, raw message is discarded
- No downstream route ever receives the raw message
- Server never logs raw message (even in error paths)
- No localStorage, cookies, database, analytics, or persistence of any kind
- Error responses never echo raw input

---

## Security Considerations

- API keys stored in `.env` (git-ignored), accessed via `process.env`
- All external API calls happen server-side only
- Client never calls Gemini or Sarvam directly
- No raw user input persisted anywhere
- No database = no injection surface
- No auth = no credential storage

---

## Folder Structure

```
suraksha-sense/
├── client/
│   ├── index.html
│   └── src/
│       ├── components/          (9 reusable UI components)
│       ├── screens/             (3 screen components)
│       ├── services/api.js      (single fetch wrapper)
│       ├── data/                (fallback gap data)
│       ├── utils/               (validation, formatting)
│       ├── styles/              (CSS tokens, globals)
│       ├── App.jsx              (screen state machine)
│       └── main.jsx             (Vite entrypoint)
├── server/
│   ├── index.js                 (Express entrypoint)
│   ├── routes/                  (4 API routes)
│   ├── services/                (LLM + Sarvam wrappers)
│   ├── data/                    (gap mapping + sample policy)
│   ├── validation/              (AI response validators)
│   └── .env.example
├── PRD.md, Architecture.md, rules.md, Phases.md, design.md, memory.md
└── README.md
```

---

## File Responsibilities

| File | Responsibility |
|---|---|
| `client/src/App.jsx` | Screen routing state machine; holds `eventType` (never raw message) |
| `client/src/services/api.js` | ONLY file that calls backend; never logs payloads |
| `server/index.js` | Express setup, middleware, route mounting |
| `server/routes/classifyEvent.js` | ONLY route that touches raw message |
| `server/routes/gapRecommendations.js` | Receives eventType only |
| `server/routes/trustScore.js` | Scores fixed demo policy |
| `server/routes/voiceover.js` | Calls Sarvam for Hindi TTS |
| `server/services/llmClient.js` | All Gemini API calls |
| `server/services/sarvamClient.js` | All Sarvam API calls |
| `server/validation/schemas.js` | Validates every AI response shape |
| `server/data/gapMapping.json` | Canonical gap dataset |
| `server/data/samplePolicy.js` | Fixed fictional policy + fallback result |

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), plain JavaScript with JSDoc |
| Styling | Plain CSS with custom properties |
| Backend | Node.js, Express |
| AI | Gemini API via HTTP |
| Regional Language | Sarvam AI API via HTTP |
| Data | Local JSON files |
| Build | Vite |
| Env | dotenv |

---

## External Dependencies

| Service | Purpose | Data Sent |
|---|---|---|
| Gemini API | Event classification, gap rendering, trust scoring | Raw message (classify only), eventType + gap data, fixed policy text |
| Sarvam AI | Hindi translation/TTS | AI-generated summary text (never raw user input) |
