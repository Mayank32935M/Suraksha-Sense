import './Button.css'

/**
 * Button with primary/secondary/ghost variants
 * @param {{ variant?: 'primary' | 'secondary' | 'ghost', children: React.ReactNode, onClick?: () => void, disabled?: boolean, type?: string, ariaLabel?: string, className?: string }} props
 */
export default function Button({ variant = 'primary', children, onClick, disabled = false, type = 'button', ariaLabel, className = '' }) {
  return (
    <button
      className={`btn btn--${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}
