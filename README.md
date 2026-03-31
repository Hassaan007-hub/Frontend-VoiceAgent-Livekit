# Voice Agent — Frontend

A real-time voice AI assistant frontend built with React and LiveKit. Speak naturally and get instant audio responses powered by Google's Gemini Live API.

---

## Features

- **Real-time voice conversation** — speak and the agent responds in real time
- **Live audio visualizer** — animated rings and bar visualizer react to agent state
- **Agent state indicators** — Listening / Thinking / Speaking / Connecting states
- **Real-time transcription** — agent responses appear as scrollable transcript
- **Session timer** — optional countdown for demo deployments with auto-disconnect
- **Secure token fetching** — supports `X-Endpoint-Secret` header for protected backends
- **Dark glassmorphism UI** — fully custom CSS, no UI library

---

## Tech Stack

| Package | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| `@livekit/components-react` | LiveKit room, voice assistant hooks, control bar |
| `@livekit/components-styles` | LiveKit base styles |
| `livekit-client` | WebRTC transport layer |

---

## Project Structure

```
src/
├── App.jsx                  # Root — token fetch, LiveKitRoom wrapper
├── main.jsx                 # Entry point, style imports
├── index.css                # Full custom dark theme
└── components/
    ├── AgentView.jsx         # Main conversation UI (visualizer, badge, transcript)
    ├── WelcomeScreen.jsx     # Landing page with Start button
    ├── TranscriptPanel.jsx   # Auto-scrolling agent transcriptions
    └── DeveloperFooter.jsx   # Developer credit footer
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Backend token server running (see `Backend_Voice_Agent_Livekit/`)

### Install & Run

```bash
npm install
cp .env.example .env     # fill in your values
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
# URL of the backend token server
VITE_TOKEN_SERVER_URL=http://localhost:8000

# Secret header sent to the token endpoint (must match backend TOKEN_ENDPOINT_SECRET)
# Leave empty to disable authentication
VITE_TOKEN_ENDPOINT_SECRET=

# Session time limit in seconds (optional)
# 30         → 30-second demo countdown with auto-disconnect
# unlimited  → no timer
VITE_SESSION_TIME_LIMIT_SECONDS=unlimited

# Developer info shown in footer
VITE_Developer_Name=Your Name
VITE_Developer_Email=your@email.com
VITE_Developer_LinkedIn=https://www.linkedin.com/in/yourprofile/
```

---

## Build for Production

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```

Deploy the `dist/` folder to any static host:
- **Vercel** — connect repo, set env vars in dashboard, deploy
- **Netlify** — drag & drop `dist/` or connect repo
- **GitHub Pages** — push `dist/` to `gh-pages` branch

> When deploying, set `VITE_TOKEN_SERVER_URL` to your deployed backend URL (e.g. your Hugging Face Space URL).

---

## How It Works

```
User clicks Start
      │
      ▼
Frontend fetches JWT token from backend (/api/token)
      │
      ▼
LiveKitRoom connects to LiveKit Cloud using token
      │
      ▼
LiveKit Cloud dispatches the agent worker to the room
      │
      ▼
Agent joins → useVoiceAssistant() detects agent presence
      │
      ▼
Real-time audio streams between user ↔ agent
```

---

## Developer

Built by **Hassaan Azam**
