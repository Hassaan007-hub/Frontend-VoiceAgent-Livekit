import { useState } from 'react'
import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react'
import WelcomeScreen from './components/WelcomeScreen'
import AgentView from './components/AgentView'

const TOKEN_SERVER_URL = import.meta.env.VITE_TOKEN_SERVER_URL || 'http://localhost:8000'
const TOKEN_ENDPOINT_SECRET = import.meta.env.VITE_TOKEN_ENDPOINT_SECRET || ''
const SESSION_TIME_LIMIT_RAW = import.meta.env.VITE_SESSION_TIME_LIMIT_SECONDS

export default function App() {
  const [connectionDetails, setConnectionDetails] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)

  const sessionTimeLimitSeconds = (() => {
    if (SESSION_TIME_LIMIT_RAW == null || SESSION_TIME_LIMIT_RAW === '') return 30
    const normalized = String(SESSION_TIME_LIMIT_RAW).trim().toLowerCase()
    if (normalized === 'unlimited' || normalized === 'none' || normalized === 'off') return null
    const n = Number(normalized)
    if (!Number.isFinite(n) || n <= 0) return null
    return Math.floor(n)
  })()

  async function handleStart() {
    setIsConnecting(true)
    setError(null)
    try {
      const headers = {}
      if (TOKEN_ENDPOINT_SECRET) {
        headers['X-Endpoint-Secret'] = TOKEN_ENDPOINT_SECRET
      }
      const res = await fetch(`${TOKEN_SERVER_URL}/api/token`, { headers })
      if (!res.ok) throw new Error(`Token server error: ${res.status}`)
      const data = await res.json()
      setConnectionDetails(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsConnecting(false)
    }
  }

  function handleDisconnect() {
    setConnectionDetails(null)
  }

  if (!connectionDetails) {
    return (
      <WelcomeScreen
        onStart={handleStart}
        isConnecting={isConnecting}
        error={error}
      />
    )
  }

  return (
    <LiveKitRoom
      token={connectionDetails.token}
      serverUrl={connectionDetails.url}
      connect={true}
      audio={true}
      video={false}
      onDisconnected={handleDisconnect}
    >
      <AgentView
        onAutoDisconnect={handleDisconnect}
        sessionTimeLimitSeconds={sessionTimeLimitSeconds}
      />
      <RoomAudioRenderer />
    </LiveKitRoom>
  )
}
