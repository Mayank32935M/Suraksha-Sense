# Suraksha Sense

> An AI that notices when your life changes — marriage, a baby, a new vehicle — and tells you what insurance gap that just opened, then proves the recommended policy is actually trustworthy before you buy it.

Built for the **Paytm Build for India AI Hackathon — Delhi Edition**, Track 2: AI-Powered Financial Journeys.

---

## Quick Start

### Prerequisites
- Node.js 18+
- Gemini API key
- Sarvam AI API key

### Setup

1. Clone the repository:
```bash
git clone <repo-url>
cd suraksha-sense
```

2. Install dependencies:
```bash
cd client && npm install
cd ../server && npm install
```

3. Configure environment variables:
```bash
cd server
cp .env.example .env
# Edit .env with your real API keys
```

4. Start the server:
```bash
cd server
npm run dev
```

5. Start the client (new terminal):
```bash
cd client
npm run dev
```

6. Open `http://localhost:5173` in your browser.

---

## Project Structure

```
suraksha-sense/
├── client/           — React (Vite) frontend
│   └── src/
│       ├── components/   — Reusable UI components
│       ├── screens/      — 3 app screens
│       ├── services/     — API client (single fetch wrapper)
│       ├── data/         — Fallback gap data
│       ├── utils/        — Validation, formatting
│       └── styles/       — CSS tokens and globals
├── server/           — Express API proxy
│   ├── routes/       — 4 API routes
│   ├── services/     — LLM + Sarvam wrappers
│   ├── data/         — Gap mapping + sample policy
│   └── validation/   — AI response validators
├── PRD.md            — Product requirements
├── Architecture.md   — System architecture
├── rules.md          — Engineering rules
├── Phases.md         — Implementation phases
├── design.md         — Design system
└── memory.md         — Project state tracker
```

---

## The Trust Loop

1. **Detect** a life event (typed or tapped)
2. **Map** the event to coverage gaps (from local dataset)
3. **Present** gaps conversationally with premiums and reasons
4. **Inspect** a policy for trustworthiness (0–100 score)
5. **Explain** flags in plain language
6. **Speak** — Hindi voice moment via Sarvam AI

---

## Privacy

Suraksha Sense follows a data-minimization approach:
- No personal data is collected (no name, phone, email, etc.)
- Your life event message is used only to identify the event type and is not stored
- No database, no cookies, no localStorage, no analytics

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), plain CSS |
| Backend | Node.js, Express |
| AI | Gemini API |
| Regional Language | Sarvam AI |
| Data | Local JSON files |

---

## Disclaimer

All insurance products, premiums, and policy documents shown are fictional demo data created for hackathon demonstration purposes only. This is not financial advice.
