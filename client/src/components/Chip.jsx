import './Chip.css'

/**
 * Single selectable life-event chip
 * @param {{ label: string, value: string, selected: boolean, onClick: (value: string) => void }} props
 */
export default function Chip({ label, value, selected, onClick }) {
  return (
    <button
      className={`chip ${selected ? 'chip--selected' : ''}`}
      onClick={() => onClick(value)}
      type="button"
      aria-pressed={selected}
    >
      {label}
    </button>
  )
}
