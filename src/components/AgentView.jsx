import { useEffect, useMemo, useState } from 'react'
import { useVoiceAssistant, BarVisualizer, VoiceAssistantControlBar } from '@livekit/components-react'
import TranscriptPanel from './TranscriptPanel'
import DeveloperFooter from './DeveloperFooter'

const STATE_META = {
  disconnected:  { label: 'Disconnected',  cls: '' },
  connecting:    { label: 'Connecting…',   cls: '' },
  initializing:  { label: 'Initializing…', cls: '' },
  listening:     { label: 'Listening',     cls: 'state-badge--listening' },
  thinking:      { label: 'Thinking…',     cls: 'state-badge--thinking' },
  speaking:      { label: 'Speaking',      cls: 'state-badge--speaking' },
}

/** Timer starts only after the agent session is live (not during room connect). */
const ACTIVE_ASSISTANT_STATES = new Set(['listening', 'thinking', 'speaking'])

function formatClock(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const mm = String(Math.floor(s / 60)).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

export default function AgentView({ onAutoDisconnect, sessionTimeLimitSeconds }) {
  const { state, audioTrack, agentTranscriptions } = useVoiceAssistant()
  const meta = STATE_META[state] ?? { label: state, cls: '' }

  const limitSeconds = useMemo(() => {
    if (sessionTimeLimitSeconds == null) return null
    const n = Number(sessionTimeLimitSeconds)
    if (!Number.isFinite(n) || n <= 0) return null
    return Math.floor(n)
  }, [sessionTimeLimitSeconds])

  const [remainingSeconds, setRemainingSeconds] = useState(limitSeconds ?? 0)
  const [countdownStartedAt, setCountdownStartedAt] = useState(null)

  useEffect(() => {
    if (limitSeconds == null) return
    if (countdownStartedAt != null) return
    if (!ACTIVE_ASSISTANT_STATES.has(state)) return
    setCountdownStartedAt(Date.now())
    setRemainingSeconds(limitSeconds)
  }, [state, limitSeconds, countdownStartedAt])

  useEffect(() => {
    if (limitSeconds == null || countdownStartedAt == null) return
    const tick = () => {
      const elapsed = Math.floor((Date.now() - countdownStartedAt) / 1000)
      const remaining = Math.max(0, limitSeconds - elapsed)
      setRemainingSeconds(remaining)
      if (remaining <= 0) {
        onAutoDisconnect?.()
      }
    }
    tick()
    const id = setInterval(tick, 250)
    return () => clearInterval(id)
  }, [limitSeconds, countdownStartedAt, onAutoDisconnect])

  return (
    <div className="agent" data-state={state}>
      {/* Header */}
      <header className="agent__header">
        <div className="agent__brand">
          <div className="agent__logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            </svg>
          </div>
          <span className="agent__title">Voice Agent</span>
        </div>

        <div className="agent__badges">
          {limitSeconds != null ? (
            <span
              className="session-timer"
              title={
                countdownStartedAt == null
                  ? 'Session time starts when the agent is ready'
                  : 'Demo session time remaining'
              }
            >
              {countdownStartedAt == null ? formatClock(limitSeconds) : formatClock(remainingSeconds)}
            </span>
          ) : null}
          <span className="live-badge">
            <span className="live-badge__dot" />
            Live
          </span>
          <span className="model-badge">Gemini Live</span>
        </div>
      </header>

      {/* Body */}
      <div className="agent__body">
        {/* Visualizer */}
        <div className="visualizer-wrap">
          <div className={`vring vring--outer ${state === 'listening' ? 'vring--outer vring--listening' : state === 'thinking' ? 'vring--outer vring--thinking' : state === 'speaking' ? 'vring--outer vring--speaking' : state === 'connecting' || state === 'initializing' ? 'vring--outer vring--connecting' : ''}`} />
          <div className={`vring vring--mid ${state === 'listening' ? 'vring--mid vring--listening' : state === 'thinking' ? 'vring--mid vring--thinking' : state === 'speaking' ? 'vring--mid vring--speaking' : state === 'connecting' || state === 'initializing' ? 'vring--mid vring--connecting' : ''}`} />
          <div className={`vring ${state === 'listening' ? 'vring--listening' : state === 'thinking' ? 'vring--thinking' : state === 'speaking' ? 'vring--speaking' : state === 'connecting' || state === 'initializing' ? 'vring--connecting' : ''}`} />
          <div className="visualizer-inner">
            <BarVisualizer
              state={state}
              barCount={9}
              track={audioTrack}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>

        {/* State badge */}
        <div className={`state-badge ${meta.cls}`}>
          <span className="state-badge__dot" />
          {meta.label}
        </div>

        {/* Transcript */}
        <TranscriptPanel transcriptions={agentTranscriptions} />
      </div>

      {/* Footer */}
      <footer className="agent__footer">
        <VoiceAssistantControlBar />
        {limitSeconds != null ? (
          <p className="session-note">
            Free demo sessions are time-limited. Want full access? Reach out to the owner.
          </p>
        ) : null}
        <DeveloperFooter />
      </footer>
    </div>
  )
}
