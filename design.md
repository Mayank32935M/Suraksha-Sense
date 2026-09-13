# Suraksha Sense — Design System

The product must feel: trustworthy, calm, modern-but-not-cold, and rooted in Indian financial accessibility.

It must **NOT** look like: a generic ChatGPT clone, a generic banking dashboard, an e-commerce insurance marketplace, or a dark cyberpunk AI interface.

---

## Color Theme

| Token | Hex | Use |
|---|---|---|
| `--color-primary` | `#028090` | Primary actions, active states, brand |
| `--color-secondary` | `#00A896` | Secondary accents |
| `--color-success` | `#02C39A` | High trust score, positive flags, "safe" states |
| `--color-warning` | `#F9A825` | Medium-severity flags |
| `--color-danger` | `#F96167` | Low trust score, high-severity flags |
| `--color-ai-accent` | `#6C63FF` | Reserved ONLY for AI-generated content indicators |
| `--color-background` | `#F4FAF9` | Page background |
| `--color-surface` | `#FFFFFF` | Cards, panels |
| `--color-text` | `#0B1F1E` | Primary text |
| `--color-text-muted` | `#5B7472` | Secondary/caption text, PrivacyNote |
| `--color-border` | `#DCEAE8` | Hairline borders, dividers |

### AI Accent Usage
`--color-ai-accent` (`#6C63FF`) is reserved **exclusively** for AI-generated content indicators:
- "AI Trust Assessment" badge
- Subtle loading pulses during AI processing
- Never used for standard UI chrome (buttons, borders, backgrounds)

This ensures the AI accent color stays meaningful and distinct.

---

## Typography

**Primary font:** `Inter` (loaded via Google Fonts)
**Fallback stack:** `-apple-system, "Segoe UI", Roboto, Arial, sans-serif`

---

## Typography Scale

| Element | Size | Line Height | Weight |
|---|---|---|---|
| H1 | 28px | 34px | 600 |
| H2 | 20px | 26px | 600 |
| H3 | 16px | 22px | 600 |
| Body | 14px | 20px | 400 |
| Caption | 12px | 16px | 400 |
| Score number | 48px | 52px | 700 |
| Button label | 14px | 20px | 600 |

Caption text uses `--color-text-muted`.
Button label has `letter-spacing: 0.2px`.

---

## Components

### Button
Three variants:
- **Primary:** filled with `--color-primary`, white text
- **Secondary:** outlined with `--color-primary` border, primary text
- **Ghost:** text-only, primary color, no border

All variants have a visible focus ring.

### Chip
- **Default state:** `--color-background` fill, `--color-border` outline
- **Active/selected state:** `--color-success` fill, dark text
- Rounded corners: 8px

### GapCard
- Icon-in-circle using `--color-primary`
- Name (bold), estimated premium, "why now" reason
- "Review Policy →" action link/button
- Card shadow on resting state, elevated shadow on hover
- Rounded corners: 12px

### FlagCard
- Left accent bar color mapped to severity:
  - High severity (>15 deduction): `--color-danger`
  - Medium severity (6-15 deduction): `--color-warning`
  - Low severity (≤5 deduction): `--color-success`
- Issue text in bold
- Explanation text in muted color below
- Rounded corners: 12px

### ScoreRing
- Circular ring (SVG or CSS), number centered inside
- Stroke color mapped to score range:
  - ≥75: `--color-success`
  - 50–74: `--color-warning`
  - <50: `--color-danger`
- Score number: 48px / 52px / 700 weight
- Border radius: 999px (full circle)

### VoiceButton
- Pill button shape (border-radius: 999px)
- Default label: "🎙️ Listen in Hindi" / "सुनें"
- **Playing state:** shows "Playing…" with animated indicator
- **Disabled/error state:** muted, shows "Voice temporarily unavailable"

### PrivacyNote
- Small muted caption text (`--color-text-muted`, caption size)
- Persistent near the Screen 1 text input
- Content: *"Suraksha Sense follows a data-minimization approach — your message is used only to identify the relevant life event and is not stored."*
- Does not claim absolute privacy — accurately states the approach

### LoadingState
- Simple centered spinner + one-line status text
- Reusable across all 3 screens during API calls
- Text examples: "Analyzing your life event…", "Finding coverage gaps…", "Scoring policy…"

### ErrorState
- Inline banner with `--color-danger` left accent
- Short error message
- Never a dead end — always shows a way forward (e.g. chips remain visible)
- Rounded corners: 12px

---

## Spacing

Scale (px): **4, 8, 12, 16, 24, 32, 48**

Use multiples of this scale for all margin and padding. Never use arbitrary values.

CSS custom properties:
```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 12px;
--space-base: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
```

---

## Border Radius

| Element | Radius |
|---|---|
| Chips, small buttons | 8px |
| Cards | 12px |
| Containers, screens | 20px |
| Score ring, pill badges, VoiceButton | 999px |

---

## Shadows

Keep subtle — no heavy drop shadows.

| State | Shadow |
|---|---|
| Card resting | `0 2px 8px rgba(2, 52, 54, 0.08)` |
| Card hover/elevated | `0 4px 16px rgba(2, 52, 54, 0.12)` |

---

## Responsive Behaviour

| Breakpoint | Layout |
|---|---|
| Mobile (<640px) | Full-width single column, 16px side padding |
| Tablet (640–1024px) | Centered content column, max-width 600px |
| Desktop (>1024px) | Centered content column, max-width 640px, generous vertical spacing |

Do **not** build a multi-column desktop layout. The flow is inherently linear.

---

## Accessibility

- **Contrast:** Minimum WCAG AA contrast for all text/background pairs
- **Semantic HTML:** Every interactive element is a real `<button>` or `<input>`, never a styled `<div>`
- **Focus ring:** `2px solid var(--color-primary)` with `2px` offset on every focusable element
- **ARIA labels:** Icon-only buttons (voice button, back button) require `aria-label`
- **Live regions:** AI-driven screen transitions wrapped in `aria-live="polite"` so screen readers announce new content
