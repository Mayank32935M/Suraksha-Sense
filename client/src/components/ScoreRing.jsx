import './ScoreRing.css'

/**
 * Circular 0-100 score display
 * @param {{ score: number }} props
 */
export default function ScoreRing({ score }) {
  const clampedScore = Math.max(0, Math.min(100, score))

  // Ring color based on score range
  let colorClass = 'score-ring--success'
  if (clampedScore < 50) {
    colorClass = 'score-ring--danger'
  } else if (clampedScore < 75) {
    colorClass = 'score-ring--warning'
  }

  // SVG circle math
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference

  return (
    <div className={`score-ring ${colorClass}`}>
      <svg className="score-ring__svg" viewBox="0 0 160 160" aria-hidden="true">
        {/* Background circle */}
        <circle
          className="score-ring__bg"
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          strokeWidth="8"
        />
        {/* Score arc */}
        <circle
          className="score-ring__arc"
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 80 80)"
        />
      </svg>
      <div className="score-ring__value" aria-label={`Trust score: ${clampedScore} out of 100`}>
        <span className="score-ring__number">{clampedScore}</span>
        <span className="score-ring__label">/100</span>
      </div>
    </div>
  )
}
