import { useEffect, useRef } from 'react'

export default function TranscriptPanel({ transcriptions }) {
  const bottomRef = useRef(null)

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [transcriptions])

  const finalSegments = transcriptions.filter((s) => s.final)

  return (
    <div className="transcript">
      {finalSegments.map((seg) => (
        <div key={seg.id} className="transcript__msg">
          <span className="transcript__label">Agent</span>
          <span className="transcript__text">{seg.text}</span>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
