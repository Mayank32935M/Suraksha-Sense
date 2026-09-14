import { useState, useEffect } from 'react'
import ScoreRing from '../components/ScoreRing'
import FlagCard from '../components/FlagCard'
import VoiceButton from '../components/VoiceButton'
import Button from '../components/Button'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import { getTrustScore, getVoiceover } from '../services/api'
import { validateTrustScoreResponse } from '../utils/validation'
import './TrustScoreScreen.css'

/** Hardcoded fallback — used when API fails entirely and client can't reach server */
const CLIENT_FALLBACK_SCORE = {
  score: 62,
  flags: [
    { issue: 'Discretionary processing fee', explanation: 'Up to 8% renewal fee is set at the company\'s discretion rather than a fixed, disclosed rate.', deduction: 18 },
    { issue: 'Short claim intimation window', explanation: 'Claims must be reported within 15 days, and late claims are settled at the committee\'s discretion.', deduction: 14 },
    { issue: 'Vague exclusion language', explanation: '"Non-essential or elective" treatment is not clearly defined, leaving broad discretion to the insurer.', deduction: 6 },
  ],
}

/**
 * Screen 3 — Trust Score
 * @param {{ onBack: () => void }} props
 */
export default function TrustScoreScreen({ onBack }) {
  const [voiceStatus, setVoiceStatus] = useState('idle')
  const [scoreData, setScoreData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchTrustScore() {
      setLoading(true)
      setError(null)

      try {
        const result = await getTrustScore()
        if (cancelled) return

        const validated = validateTrustScoreResponse(result)

        if (validated.valid) {
          setScoreData({ score: validated.score, flags: validated.flags })
        } else {
          // Server returned data but it was invalid — use fallback
          setScoreData(CLIENT_FALLBACK_SCORE)
          setError('Score data could not be verified. Showing demo results.')
        }
      } catch (err) {
        if (cancelled) return
        // Network error — use client-side fallback
        setScoreData(CLIENT_FALLBACK_SCORE)
        setError('Could not connect to the server. Showing cached results.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchTrustScore()
    return () => { cancelled = true }
  }, [])

  const [voiceHindiText, setVoiceHindiText] = useState(null)

  /** Build a summary of the trust score findings for voiceover */
  const buildVoiceSummary = () => {
    const d = scoreData || CLIENT_FALLBACK_SCORE
    const flagSummaries = d.flags.map(f => `${f.issue}: ${f.explanation}`).join('. ')
    return `This policy received a trust score of ${d.score} out of 100. Key concerns found: ${flagSummaries}`
  }

  const handleVoiceClick = async () => {
    setVoiceStatus('loading')
    setVoiceHindiText(null)

    try {
      const summaryText = buildVoiceSummary()
      const result = await getVoiceover(summaryText)

      if (result.unavailable) {
        // Sarvam failed — show fallback
        if (result.translatedText) {
          setVoiceHindiText(result.translatedText)
        }
        setVoiceStatus('error')
        return
      }

      // Play the base64 audio
      if (result.audioBase64) {
        if (result.translatedText) {
          setVoiceHindiText(result.translatedText)
        }

        try {
          const audioBytes = atob(result.audioBase64)
          const arrayBuffer = new ArrayBuffer(audioBytes.length)
          const uint8Array = new Uint8Array(arrayBuffer)
          for (let i = 0; i < audioBytes.length; i++) {
            uint8Array[i] = audioBytes.charCodeAt(i)
          }

          const audioContext = new (window.AudioContext || window.webkitAudioContext)()
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
          const source = audioContext.createBufferSource()
          source.buffer = audioBuffer
          source.connect(audioContext.destination)
          source.onended = () => setVoiceStatus('idle')
          source.start()
          setVoiceStatus('playing')
        } catch (audioErr) {
          // Audio decode/playback failed — still show translated text
          console.error('Audio playback failed')
          if (result.translatedText) {
            setVoiceHindiText(result.translatedText)
          }
          setVoiceStatus('error')
        }
      } else {
        setVoiceStatus('error')
      }
    } catch (err) {
      setVoiceStatus('error')
    }
  }

  if (loading) {
    return (
      <div className="screen screen-enter trust-screen">
        <LoadingState message="Scoring policy for trustworthiness…" />
      </div>
    )
  }

  const data = scoreData || CLIENT_FALLBACK_SCORE

  return (
    <div className="screen screen-enter trust-screen" aria-live="polite">
      <div className="trust-screen__header">
        <Button variant="ghost" onClick={onBack} ariaLabel="Go back to coverage gaps">
          ← Back
        </Button>
        <span className="trust-screen__ai-badge">✨ AI Trust Assessment</span>
      </div>

      <div className="trust-screen__score-section">
        <ScoreRing score={data.score} />
        <p className="trust-screen__score-label">Trust Score</p>
      </div>

      {error && <ErrorState message={error} />}

      <div className="trust-screen__flags">
        <h3 className="trust-screen__flags-title">Key Findings</h3>
        {data.flags.map((flag, index) => (
          <FlagCard
            key={index}
            issue={flag.issue}
            explanation={flag.explanation}
            deduction={flag.deduction}
          />
        ))}
      </div>

      <div className="trust-screen__voice-section">
        <VoiceButton status={voiceStatus} onClick={handleVoiceClick} />
        {voiceHindiText && (
          <p className="trust-screen__hindi-text" lang="hi">
            {voiceHindiText}
          </p>
        )}
      </div>

      <p className="text-caption trust-screen__disclaimer">
        This is an AI-assisted demo assessment, not a certified financial or legal rating.
      </p>
    </div>
  )
}
