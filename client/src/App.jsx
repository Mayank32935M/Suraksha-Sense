import { useState } from 'react'
import './styles/variables.css'
import LifeEventScreen from './screens/LifeEventScreen'
import GapScreen from './screens/GapScreen'
import TrustScoreScreen from './screens/TrustScoreScreen'
import { getGapRecommendations } from './services/api'
import fallbackGapData from './data/gapMappingFallback.json'

/**
 * Screen state machine — routes between the 3 screens.
 * Holds `eventType` in state (never the raw message) once classification completes.
 */
function App() {
  // Which screen is active: 'lifeEvent' | 'gaps' | 'trustScore'
  const [currentScreen, setCurrentScreen] = useState('lifeEvent')
  // Normalized event type (never raw user text)
  const [eventType, setEventType] = useState(null)
  // Gap recommendation data from API
  const [gapData, setGapData] = useState(null)
  const [gapLoading, setGapLoading] = useState(false)
  const [gapError, setGapError] = useState(null)

  /** Called when Screen 1 detects an event (via chip or classification) */
  const handleEventDetected = async (detectedEventType, source) => {
    setEventType(detectedEventType)
    setCurrentScreen('gaps')
    setGapLoading(true)
    setGapError(null)
    setGapData(null)

    try {
      const result = await getGapRecommendations(detectedEventType)

      if (result.error) {
        // API returned an error — use client-side fallback
        const fallback = fallbackGapData[detectedEventType]
        setGapData({
          intro: `Here are the coverage gaps for your ${fallback?.label?.toLowerCase() || detectedEventType} event:`,
          gaps: fallback?.gaps || [],
        })
        setGapError(result.message)
      } else {
        setGapData(result)
      }
    } catch (err) {
      // Network/server unreachable — use client-side fallback
      const fallback = fallbackGapData[detectedEventType]
      if (fallback) {
        setGapData({
          intro: `Here are the coverage gaps for your ${fallback.label.toLowerCase()} event:`,
          gaps: fallback.gaps,
        })
      }
      setGapError('Could not connect to the server. Showing cached recommendations.')
    } finally {
      setGapLoading(false)
    }
  }

  /** Called when "Review Policy →" is tapped on Screen 2 */
  const handleReviewPolicy = () => {
    setCurrentScreen('trustScore')
  }

  /** Navigate back from Screen 2 → Screen 1 */
  const handleBackToEvents = () => {
    setCurrentScreen('lifeEvent')
    setEventType(null)
    setGapData(null)
    setGapError(null)
  }

  /** Navigate back from Screen 3 → Screen 2 */
  const handleBackToGaps = () => {
    setCurrentScreen('gaps')
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Suraksha Sense</h1>
        <p className="app-subtitle">Your life changed. Your financial protection should change with it.</p>
      </header>

      <main className="app-main">
        {currentScreen === 'lifeEvent' && (
          <LifeEventScreen onEventDetected={handleEventDetected} />
        )}

        {currentScreen === 'gaps' && (
          <GapScreen
            eventType={eventType}
            onReviewPolicy={handleReviewPolicy}
            onBack={handleBackToEvents}
            gaps={gapData?.gaps}
            intro={gapData?.intro}
            loading={gapLoading}
            error={gapError}
          />
        )}

        {currentScreen === 'trustScore' && (
          <TrustScoreScreen onBack={handleBackToGaps} />
        )}
      </main>
    </div>
  )
}

export default App
