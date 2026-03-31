import { Fragment } from 'react'

function stripEnv(value) {
  if (value == null || typeof value !== 'string') return ''
  let s = value.trim()
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim()
  }
  return s
}

function linkedInHref(raw) {
  const s = stripEnv(raw)
  if (!s) return ''
  if (/^https?:\/\//i.test(s)) return s
  return `https://${s}`
}

export default function DeveloperFooter({ className = '' }) {
  const name = stripEnv(import.meta.env.VITE_Developer_Name)
  const email = stripEnv(import.meta.env.VITE_Developer_Email)
  const linkedInRaw = stripEnv(import.meta.env.VITE_Developer_LinkedIn)
  const linkedIn = linkedInHref(linkedInRaw)

  const segments = []
  if (name) segments.push({ key: 'name', node: <span>{name}</span> })
  if (email)
    segments.push({
      key: 'email',
      node: (
        <a className="dev-footer__link" href={`mailto:${email}`}>
          {email}
        </a>
      ),
    })
  if (linkedIn)
    segments.push({
      key: 'linkedin',
      node: (
        <a
          className="dev-footer__link"
          href={linkedIn}
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
      ),
    })

  if (segments.length === 0) return null

  return (
    <div className={`dev-footer ${className}`.trim()}>
      <p className="dev-footer__line">
        <span className="dev-footer__prefix">Built by </span>
        {segments.map((seg, i) => (
          <Fragment key={seg.key}>
            {i > 0 ? (
              <span className="dev-footer__dot" aria-hidden>
                {' '}
                ·{' '}
              </span>
            ) : null}
            {seg.node}
          </Fragment>
        ))}
      </p>
    </div>
  )
}
