import { useState, useEffect, useRef } from 'react'
import api from '../../services/api'

export default function AvatarPicker({ selected, onSelect, onClose }) {
  const backdropRef = useRef(null)
  const [avatars, setAvatars] = useState(null)

  useEffect(() => {
    api.get('/avatars').then(({ data }) => setAvatars(data)).catch(() => setAvatars([]))
  }, [])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="modal-backdrop"
      ref={backdropRef}
      onClick={e => { if (e.target === backdropRef.current) onClose() }}
    >
      <div className="modal-box avatar-picker-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Choose your avatar</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {avatars === null && (
          <p style={{ fontSize: 14, color: 'var(--text-3)', padding: '12px 0' }}>Loading…</p>
        )}

        {avatars !== null && avatars.length === 0 && (
          <p style={{ fontSize: 14, color: 'var(--text-3)', padding: '12px 0' }}>
            No avatars found. Add images to <code style={{ fontSize: 12 }}>client/public/avatars/</code>.
          </p>
        )}

        {avatars !== null && avatars.length > 0 && (
          <div className="avatar-picker-grid">
            {avatars.map((src) => (
              <button
                key={src}
                type="button"
                className={`avatar-picker-option${selected === src ? ' avatar-picker-option--selected' : ''}`}
                onClick={() => { onSelect(src); onClose() }}
              >
                <img src={src} alt="" draggable={false} />
                {selected === src && (
                  <span className="avatar-picker-check">
                    <svg viewBox="0 0 12 10" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="1 5 5 9 11 1"/>
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
