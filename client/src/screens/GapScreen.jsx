import GapCard from '../components/GapCard'
import Button from '../components/Button'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import './GapScreen.css'

/** Hardcoded placeholder data — used as fallback if API data is not provided */
const PLACEHOLDER_GAPS = [
  { name: 'Spouse Health Cover', estimatedPremium: '₹450/month', whyNow: "Your healthcare needs are now shared, so extending health coverage can prevent one person's medical expense from becoming the other's financial burden." },
  { name: 'Term Life Top-up', estimatedPremium: '₹280/month', whyNow: 'With someone financially dependent on you, your existing life cover may no longer be enough.' },
  { name: 'Joint Savings Plan', estimatedPremium: '₹600/month', whyNow: 'A shared savings plan can help you build a financial cushion for your new household.' },
]

/**
 * Screen 2 — Coverage Gap Output
 * @param {{ eventType: string, onReviewPolicy: () => void, onBack: () => void, gaps?: Array, intro?: string, loading?: boolean, error?: string }} props
 */
export default function GapScreen({ eventType, onReviewPolicy, onBack, gaps, intro, loading = false, error = null }) {
  const displayGaps = gaps || PLACEHOLDER_GAPS
  const displayIntro = intro || 'Congratulations on your new chapter! Here are some coverage gaps worth looking into:'

  const eventLabels = {
    wedding: 'Wedding',
    new_baby: 'New Baby',
    new_vehicle: 'New Vehicle',
    new_home: 'New Home',
  }

  if (loading) {
    return (
      <div className="screen screen-enter gap-screen">
        <LoadingState message="Finding your coverage gaps…" />
      </div>
    )
  }

  return (
    <div className="screen screen-enter gap-screen" aria-live="polite">
      <div className="gap-screen__header">
        <Button variant="ghost" onClick={onBack} ariaLabel="Go back to life event selection">
          ← Back
        </Button>
        <div className="gap-screen__event-badge">
          {eventLabels[eventType] || eventType}
        </div>
      </div>

      <p className="gap-screen__intro">{displayIntro}</p>

      {error && <ErrorState message={error} />}

      <div className="gap-screen__cards">
        {displayGaps.map((gap, index) => (
          <GapCard
            key={index}
            name={gap.name}
            estimatedPremium={gap.estimatedPremium}
            whyNow={gap.whyNow}
            onReview={onReviewPolicy}
          />
        ))}
      </div>

      <p className="text-caption gap-screen__disclaimer">
        Premiums shown are illustrative demo estimates, not live market prices.
      </p>
    </div>
  )
}
