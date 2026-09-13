import './FlagCard.css'

/**
 * One trust-score flag/deduction card
 * @param {{ issue: string, explanation: string, deduction: number }} props
 */
export default function FlagCard({ issue, explanation, deduction }) {
  /** Severity based on deduction points */
  const severity = deduction > 15 ? 'high' : deduction >= 6 ? 'medium' : 'low'

  return (
    <div className={`flag-card flag-card--${severity}`}>
      <div className="flag-card__header">
        <h3 className="flag-card__issue">{issue}</h3>
        <span className="flag-card__deduction">−{deduction} pts</span>
      </div>
      <p className="flag-card__explanation">{explanation}</p>
    </div>
  )
}
