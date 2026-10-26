import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

const FALLBACK_GAME_URL = 'https://guia-espirit-juego.web.app/index.html'

export default function Juego() {
  const navigate = useNavigate()
  const [gameUrl, setGameUrl] = useState(null)
  const [iframeLoaded, setIframeLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadGameUrl() {
      try {
        const snap = await getDoc(doc(db, 'config', 'juego'))
        const url = snap.exists() ? snap.data()?.url : null
        const resolved = typeof url === 'string' && url.trim() ? url.trim() : FALLBACK_GAME_URL
        if (!cancelled) setGameUrl(resolved)
      } catch (error) {
        console.error('[Juego] Error leyendo config/juego:', error)
        if (!cancelled) setGameUrl(FALLBACK_GAME_URL)
      }
    }

    loadGameUrl()

    return () => {
      cancelled = true
    }
  }, [])

  const volver = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  const mostrarLoader = !gameUrl || !iframeLoaded

  return (
    <div className="fixed inset-0 z-[60] bg-black text-purple-100">
      {gameUrl && (
        <iframe
          src={gameUrl}
          title="Las Aventuras del Maestro GU"
          allow="autoplay; fullscreen"
          allowFullScreen
          onLoad={() => setIframeLoaded(true)}
          className="absolute inset-0 h-full w-full border-0 bg-black"
        />
      )}

      {mostrarLoader && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#1a1a2e]">
          <div className="flex flex-col items-center gap-3 px-6 text-center">
            <div className="text-6xl animate-pulse">🔮</div>
            <p className="text-purple-200 text-sm">Preparando la aventura...</p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={volver}
        aria-label="Volver"
        className="fixed left-3 z-20 inline-flex items-center gap-1 rounded-full border border-[#fbbf24]/50 bg-[#0f1020]/85 px-3 py-2 text-sm font-semibold text-[#fbbf24] shadow-lg backdrop-blur-md"
        style={{ top: 'calc(env(safe-area-inset-top, 0px) + 0.75rem)' }}
      >
        <span aria-hidden="true">←</span>
        Volver
      </button>
    </div>
  )
}
