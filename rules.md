# Suraksha Sense — Engineering Rules

These rules are binding across every file, route, component, and log statement in this project.

---

## General Rules

- Prefer boring, reliable code over clever abstractions.
- A two-person hackathon team must be able to read and modify any file in under a few minutes.
- Small, single-responsibility components and functions.
- No file should mix UI rendering with API calling logic.
- Do not replace working code merely for stylistic reasons.

---

## Libraries to Use

- **React** — UI framework
- **Vite** — build tool and dev server
- **Express** — minimal server framework
- **dotenv** — environment variable loading
- **cors** — Cross-origin resource sharing middleware
- Native `fetch` (Node 18+) or `node-fetch` — HTTP client for server-side API calls

Nothing else unless a specific, justified need arises.

---

## Libraries to Avoid

- **State management** (Redux, Zustand, Jotai, etc.) — React `useState` is sufficient for 3 screens
- **CSS-in-JS** (styled-components, emotion, etc.) — plain CSS with custom properties
- **UI component kits** (Material UI, Chakra, Ant Design, etc.)
- **ORMs** (Sequelize, Prisma, etc.) — no database exists
- **Agent/orchestration frameworks** (LangChain, CrewAI, etc.) — simple HTTP calls only
- **Analytics/tracking SDKs** — conflicts with data-minimization (Section 3)
- **TypeScript** — adds build friction with no benefit at this scope
- **Router libraries** — manual screen state is sufficient for 3 screens

---

## AI Usage Rules

AI is used for exactly **four** use cases:
1. Classifying a life event from free text
2. Rendering the local gap-mapping data conversationally (rephrasing `whyNow` only)
3. Scoring the fixed demo policy against the trust rubric
4. Plain-language explanation of trust flags

Plus one supporting role:
5. Preparing text for Sarvam translation/TTS

Every AI call must have:
- A validated response schema (checked server-side before returning to client)
- A defined fallback behavior for failures

---

## AI Boundaries

AI must **NEVER**:
- Invent insurance products, premiums, or policy clauses
- Fabricate regulatory claims
- Override the local gap-mapping dataset
- Silently alter the scoring rubric
- Present demo premiums or the demo policy as real/live data
- Make definitive legal or financial recommendations
- Retain, log, or forward raw user input beyond what is strictly needed for classification

The local JSON dataset is the **sole source of truth** for what coverage gaps exist. The AI interprets and presents — it never invents.

---

## Prompt Rules

- Prompts must explicitly forbid inventing data not present in the local dataset.
- Prompts must request JSON-only output with no markdown fences or commentary.
- The classification prompt must return exactly one of the known tokens or be treated as `none`.
- The gap-rendering prompt must preserve `name` and `estimatedPremium` byte-for-byte from the dataset.
- The trust-score prompt must operate only on the fixed demo policy text.

---

## API Rules

- The client never calls an external AI/Sarvam endpoint directly — always through `server/routes/*`.
- Only `client/src/services/api.js` makes `fetch` calls to the server — no component calls `fetch` directly.
- Raw user input never crosses more than one route (`/api/classify-event`).
- All routes return structured JSON responses, even on failure.

---

## Error Handling Rules

- No unhandled promise rejections.
- Every route wraps its logic in `try/catch`.
- Every route returns a structured response even on failure.
- Error responses use generic, safe strings — never raw input or stack traces.
- No combination of failures should produce a blank screen, an unhandled exception, or a frozen loading state.
- The `message` field in error responses must be a generic, safe string.

---

## Security Rules

- No API keys, secrets, or credentials anywhere in `client/` source.
- All external API calls happen server-side only.
- `.env` is git-ignored; `.env.example` documents variable names with placeholder values only.
- Never log full API keys, even to console, even in development.
- No raw user input is ever persisted, logged, or forwarded past the classify-event route.
- No database, no cookies, no localStorage, no analytics collection.

---

## Privacy Rules

This section implements Section 3 of the master prompt in full. It is a **binding principle**, not a guideline.

### No Personal Data Collection
The MVP must NOT require or collect: name, phone number, email, Aadhaar, PAN, address, date of birth, payment information, or any form of user account.

### Raw Input Is Transient
- The user's raw free-text message is used ONLY to determine the normalized `eventType`.
- Once classification returns `{ eventType }`, every downstream step operates on this normalized category ONLY.
- The raw message must never be written to: a database, localStorage, cookies, analytics events, application/server logs, or memory.md.
- After the classify-event call returns, the raw message is discarded from server memory.

### Minimum Necessary Data
- The classification call legitimately needs the raw message — that is its one job.
- No other call ever needs the raw message.
- The Trust Score call operates exclusively on the fixed fictional demo policy text.

### Error Handling Privacy
- Error messages must never echo the user's raw input back verbatim.
- Validation error logs contain only the validation failure reason and route name — never the raw request body.
- Server-side debug logs may contain only the normalized `eventType` and a timestamp/request ID.

### UI Transparency
- A visible PrivacyNote near the Screen 1 input states the data-minimization approach.
- The note does not claim absolute privacy or zero third-party processing.
- It accurately states that the raw message IS sent to an external LLM for classification.

### Future Scope Guardrail
- Any future feature involving persistent user data, accounts, policy uploads, financial information, personalization, or sharing requires a separate privacy/security design pass.
- Do not design persistent data features for this MVP.

---

## Data Rules

- `gapMapping.json` is the **only** source of truth for gap names and premiums.
- AI may only rephrase the `whyNow` field — never alter names or premiums.
- If the AI returns altered names/premiums, discard the AI response entirely and use raw local data.
- All premiums are illustrative demo estimates. Never label them as live market prices in UI copy.
- The sample policy is fictional. Never name a real insurer.

---

## UI Rules

- Every interactive element uses real semantic HTML (`<button>`, `<input>`), never styled `<div>`.
- Minimum WCAG AA contrast for all text/background pairs.
- Visible focus ring on every focusable element: `2px solid var(--color-primary)` with 2px offset.
- Icon-only buttons require `aria-label`.
- AI-driven screen transitions wrapped in `aria-live="polite"` regions.
- No text-only screens — every screen has defined visual layout per the design system.

---

## Scope Control

If a feature isn't listed in the "build exactly these three screens" specification, do not build it. This includes:
- Additional screens or navigation
- User accounts or settings
- Data persistence
- Additional language support beyond one Hindi moment
- Real insurance marketplace features

---

## Code Quality Rules

- Small, single-responsibility components and functions.
- No file should mix UI rendering with API calling logic.
- Components and screens call `services/api.js` — never `fetch` directly.
- Each component has one stated responsibility — do not add files for abstraction's sake, and do not collapse responsibilities.

---

## Demo Reliability Rules

- The happy path ("Just got married" → Wedding gaps → Trust Score → Hindi voice) must be manually verified after every phase that touches it.
- Never claim a feature is implemented unless you have actually run and verified it.
- Never leave a known build or runtime error unresolved when moving to the next phase.
- The happy-path demo must complete reliably in under 90 seconds.
