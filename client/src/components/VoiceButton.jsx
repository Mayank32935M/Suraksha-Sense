import './VoiceButton.css'

/**
 * "Listen in Hindi" trigger with playing and error states
 * @param {{ status: 'idle' | 'loading' | 'playing' | 'error', onClick: () => void }} props
 */
export default function VoiceButton({ status = 'idle', onClick }) {
  const isDisabled = status === 'loading' || status === 'playing'

  let label = '🎙️ सुनें · Listen in Hindi'
  if (status === 'loading') label = '⏳ Loading…'
  if (status === 'playing') label = '🔊 Playing…'
  if (status === 'error') label = '🎙️ Voice temporarily unavailable'

  return (
    <button
      className={`voice-btn voice-btn--${status}`}
      onClick={onClick}
      disabled={isDisabled || status === 'error'}
      type="button"
      aria-label={status === 'error' ? 'Voice temporarily unavailable' : 'Listen in Hindi'}
    >
      {label}
    </button>
  )
}
