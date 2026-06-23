export default function TarotFlipCard({ flipped, onFlip, label, children }) {
  return (
    <div className="w-full">
      {label && (
        <p className="text-sm text-purple-300 mb-3 font-semibold text-center">{label}</p>
      )}

      <div
        className={`tarot-flip-scene w-full ${flipped ? 'tarot-flip-scene--revealed' : ''}`}
        onClick={() => !flipped && onFlip()}
        onKeyDown={(e) => {
          if (!flipped && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            onFlip()
          }
        }}
        role="button"
        tabIndex={flipped ? -1 : 0}
        aria-label={flipped ? undefined : 'Toca para revelar carta'}
        aria-pressed={flipped}
      >
        <div className={`tarot-flip-inner ${flipped ? 'is-flipped' : ''}`}>
          <div className="tarot-flip-face tarot-flip-back">
            <div className="tarot-flip-back-inner">
              <span className="tarot-flip-back-glow" aria-hidden="true" />
              <span className="text-5xl mb-3 drop-shadow-[0_0_14px_rgba(251,191,36,0.55)]" aria-hidden="true">
                🌙
              </span>
              <span className="text-2xl text-[#fbbf24]/40 mb-2" aria-hidden="true">✦</span>
              <p className="text-[#fbbf24]/90 text-xs font-semibold tracking-[0.25em] uppercase">
                Guía Espiritual
              </p>
              <p className="text-purple-300/70 text-xs mt-4">Toca para revelar</p>
            </div>
          </div>

          <div className="tarot-flip-face tarot-flip-front">
            <div className="tarot-flip-front-inner">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
