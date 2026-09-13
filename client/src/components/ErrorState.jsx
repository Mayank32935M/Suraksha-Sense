import './ErrorState.css'

/**
 * Inline error/fallback banner
 * @param {{ message: string, children?: React.ReactNode }} props
 */
export default function ErrorState({ message, children }) {
  return (
    <div className="error-state" role="alert">
      <p className="error-state__message">{message}</p>
      {children && <div className="error-state__actions">{children}</div>}
    </div>
  )
}
