import { useState } from 'react'
import Chip from '../components/Chip'
import Button from '../components/Button'
import PrivacyNote from '../components/PrivacyNote'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import { classifyEvent } from '../services/api'
import { validateClassifyResponse } from '../utils/validation'
import './LifeEventScreen.css'

const PRESET_CHIPS = [
  { label: '💍 Wedding', value: 'wedding' },
  { label: '👶 New Baby', value: 'new_baby' },
  { label: '🚗 New Vehicle', value: 'new_vehicle' },
  { label: '🏠 New Home', value: 'new_home' },
]

/**
 * Screen 1 — Life Event Input
 * @param {{ onEventDetected: (eventType: string, source: string) => void }} props
 */
export default function LifeEventScreen({ onEventDetected }) {
  const [message, setMessage] = useState('')
  const [selectedChip, setSelectedChip] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChipClick = (value) => {
    setSelectedChip(value)
    setMessage('')
    setError(null)
    // Chips bypass AI classification entirely
    onEventDetected(value, 'chip')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) return
    setError(null)
    setLoading(true)

    try {
      const result = await classifyEvent(message)
      const validated = validateClassifyResponse(result)

      if (validated.eventType) {
        // Successful classification — pass only eventType (never raw message)
        onEventDetected(validated.eventType, validated.source)
      } else {
        // Classification returned "none" or failed
        setError(validated.message || "We couldn't match that to a specific life event. Try one of the preset options below.")
      }
    } catch (err) {
      setError('Unable to analyze your message right now. Please try one of the preset options below.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="screen screen-enter life-event-screen">
      <div className="life-event-screen__content">
        <h2 className="life-event-screen__title">What's new in your life?</h2>
        <p className="life-event-screen__subtitle">
          Tell us about a recent life event, and we'll show you what coverage gaps it may have opened.
        </p>

        <form className="life-event-screen__form" onSubmit={handleSubmit}>
          <div className="life-event-screen__input-wrapper">
            <input
              id="life-event-input"
              type="text"
              className="life-event-screen__input"
              placeholder="e.g., I just got married last month…"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
                setSelectedChip(null)
                setError(null)
              }}
              aria-label="Describe your life event"
              autoComplete="off"
            />
            <Button
              variant="primary"
              type="submit"
              disabled={!message.trim() || loading}
              className="life-event-screen__submit"
            >
              Analyze
            </Button>
          </div>
        </form>

        <div className="life-event-screen__divider">
          <span>or pick one</span>
        </div>

        <div className="life-event-screen__chips" role="group" aria-label="Preset life events">
          {PRESET_CHIPS.map(chip => (
            <Chip
              key={chip.value}
              label={chip.label}
              value={chip.value}
              selected={selectedChip === chip.value}
              onClick={handleChipClick}
            />
          ))}
        </div>

        {loading && <LoadingState message="Analyzing your life event…" />}

        {error && (
          <ErrorState message={error}>
            <p className="text-caption">Try one of the preset options above.</p>
          </ErrorState>
        )}

        <PrivacyNote />
      </div>
    </div>
  )
}
