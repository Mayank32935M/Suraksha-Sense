import './LoadingState.css'

/**
 * Shared loading/skeleton indicator
 * @param {{ message?: string }} props
 */
export default function LoadingState({ message = 'Loading…' }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <div className="loading-state__spinner" aria-hidden="true"></div>
      <p className="loading-state__message">{message}</p>
    </div>
  )
}
