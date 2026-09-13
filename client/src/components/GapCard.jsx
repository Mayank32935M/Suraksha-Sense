import './GapCard.css'

/**
 * One coverage-gap recommendation card
 * @param {{ name: string, estimatedPremium: string, whyNow: string, onReview: () => void }} props
 */
export default function GapCard({ name, estimatedPremium, whyNow, onReview }) {
  return (
    <div className="gap-card">
      <div className="gap-card__header">
        <div className="gap-card__icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 1L12.39 6.26L18 7.27L14 11.14L14.76 17L10 14.27L5.24 17L6 11.14L2 7.27L7.61 6.26L10 1Z" fill="currentColor"/>
          </svg>
        </div>
        <div className="gap-card__info">
          <h3 className="gap-card__name">{name}</h3>
          <span className="gap-card__premium">{estimatedPremium}</span>
        </div>
      </div>
      <p className="gap-card__reason">{whyNow}</p>
      <button className="gap-card__action" onClick={onReview} type="button">
        Review Policy →
      </button>
    </div>
  )
}
