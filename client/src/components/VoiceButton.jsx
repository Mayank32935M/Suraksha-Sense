import './VoiceButton.css'

/**
 * "Listen in Hindi" trigger with playing and error states.
 * Error state allows retry — button is NOT disabled on error.
 * @param {{ status: 'idle' | 'loading' | 'playing' | 'error', onClick: () => void }} props
 */
export default function VoiceButton({ status = 'idle', onClick }) {
  const isDisabled = status === 'loading' || status === 'playing'

  let label = '🎙️ सुनें · Listen in Hindi'
  if (status === 'loading') label = '⏳ Loading…'
  if (status === 'playing') label = '🔊 Playing…'
  if (status === 'error') label = '🎙️ Tap to retry · Voice unavailable'

  return (
    <button
      className={`voice-btn voice-btn--${status}`}
      onClick={onClick}
      disabled={isDisabled}
      type="button"
      aria-label={status === 'error' ? 'Tap to retry voice playback' : 'Listen in Hindi'}
    >
      {label}
    </button>
  )
}
