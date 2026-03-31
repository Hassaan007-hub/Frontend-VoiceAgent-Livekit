import DeveloperFooter from './DeveloperFooter'

export default function WelcomeScreen({ onStart, isConnecting, error }) {
  return (
    <div className="welcome">
      {/* Ambient orbs */}
      <div className="welcome__orb welcome__orb--1" />
      <div className="welcome__orb welcome__orb--2" />
      <div className="welcome__orb welcome__orb--3" />

      {/* SVG gradient def for icon stroke */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#67e8f9" />
          </linearGradient>
        </defs>
      </svg>

      <div className="welcome__content">
      {/* Icon */}
      <div className="welcome__icon-wrap">
        <div className="welcome__icon-ring" />
        <div className="welcome__icon-ring welcome__icon-ring--2" />
        <div className="welcome__icon">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
        </div>
      </div>

      <h1 className="welcome__title">Voice Agent</h1>
      <p className="welcome__subtitle">
        Powered by Gemini Live API. Speak naturally&nbsp;—
        the agent listens, thinks, and responds in real time.
      </p>

      {/* Feature pills */}
      <div className="welcome__features">
        <span className="feature-pill">
          <span className="feature-pill__dot feature-pill__dot--violet" />
          Gemini Live
        </span>
        <span className="feature-pill">
          <span className="feature-pill__dot feature-pill__dot--cyan" />
          Real-time Voice
        </span>
        <span className="feature-pill">
          <span className="feature-pill__dot feature-pill__dot--emerald" />
          Google Search
        </span>
      </div>

      <button className="btn-start" onClick={onStart} disabled={isConnecting}>
        {isConnecting ? (
          <>
            <span className="btn-start__spinner" />
            Connecting…
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            </svg>
            Start Conversation
          </>
        )}
      </button>

      {error && (
        <p className="welcome__error">⚠ {error}</p>
      )}
      </div>

      <DeveloperFooter />
    </div>
  )
}
