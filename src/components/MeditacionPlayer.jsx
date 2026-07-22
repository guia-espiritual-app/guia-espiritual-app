import { useState, useEffect, useRef, useCallback } from 'react'
import { Howl, Howler } from 'howler'
import { useSound } from '../contexts/SoundContext'
import meditacionAudio from '../assets/sounds/meditacion-1.mp3'

function formatearTiempo(segundos) {
  if (!Number.isFinite(segundos) || segundos < 0) return '0:00'
  const m = Math.floor(segundos / 60)
  const s = Math.floor(segundos % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

/**
 * Reproductor de meditación con Howler (html5: true, obligatorio en iOS WebView).
 * Instancia separada de la música de fondo y el chime.
 */
export default function MeditacionPlayer({ className = '' }) {
  const { pauseBgForContent, resumeBgAfterContent } = useSound()
  const howlRef = useRef(null)
  const rafRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)

  const stopProgressLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const tickProgress = useCallback(() => {
    const howl = howlRef.current
    if (!howl || !howl.playing()) {
      stopProgressLoop()
      return
    }
    setProgress(howl.seek() || 0)
    rafRef.current = requestAnimationFrame(tickProgress)
  }, [stopProgressLoop])

  useEffect(() => {
    const howl = new Howl({
      src: [meditacionAudio],
      format: ['mp3'],
      html5: true,
      preload: true,
      volume: 1,
      onload: () => {
        setDuration(howl.duration() || 0)
        setReady(true)
      },
      onplay: () => {
        setPlaying(true)
        pauseBgForContent()
        stopProgressLoop()
        rafRef.current = requestAnimationFrame(tickProgress)
      },
      onpause: () => {
        setPlaying(false)
        stopProgressLoop()
        setProgress(howl.seek() || 0)
        resumeBgAfterContent()
      },
      onstop: () => {
        setPlaying(false)
        stopProgressLoop()
        setProgress(0)
        resumeBgAfterContent()
      },
      onend: () => {
        setPlaying(false)
        stopProgressLoop()
        setProgress(0)
        resumeBgAfterContent()
      },
    })

    howlRef.current = howl

    return () => {
      stopProgressLoop()
      if (howl.playing()) {
        resumeBgAfterContent()
      }
      howl.unload()
      howlRef.current = null
    }
  }, [pauseBgForContent, resumeBgAfterContent, stopProgressLoop, tickProgress])

  const togglePlay = () => {
    const howl = howlRef.current
    if (!howl) return

    if (howl.playing()) {
      howl.pause()
      return
    }

    if (Howler.ctx && Howler.ctx.state === 'suspended') {
      Howler.ctx.resume()
    }
    howl.play()
  }

  const onSeek = (e) => {
    const howl = howlRef.current
    if (!howl || !duration) return
    const value = Number(e.target.value)
    howl.seek(value)
    setProgress(value)
  }

  const pct = duration > 0 ? Math.min(100, (progress / duration) * 100) : 0

  return (
    <div
      className={`rounded-2xl border-2 border-[#fbbf24]/40 bg-gradient-to-br from-[#2d1b4e]/95 to-purple-950/80 p-5 shadow-[0_0_28px_rgba(251,191,36,0.12)] ${className}`}
    >
      <div className="flex items-center justify-center mb-4">
        <button
          type="button"
          onClick={togglePlay}
          disabled={!ready}
          aria-label={playing ? 'Pausar meditación' : 'Reproducir meditación'}
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#fbbf24]/70 bg-gradient-to-br from-[#fbbf24] to-yellow-500 text-[#2d1b4e] text-2xl font-bold shadow-[0_0_20px_rgba(251,191,36,0.35)] transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          {playing ? '❚❚' : '▶'}
        </button>
      </div>

      <div className="space-y-2">
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={progress}
          onChange={onSeek}
          disabled={!ready || !duration}
          aria-label="Progreso de la meditación"
          className="w-full accent-[#fbbf24] h-2 cursor-pointer disabled:opacity-40"
          style={{
            background: `linear-gradient(to right, #fbbf24 ${pct}%, rgba(45,27,78,0.8) ${pct}%)`,
          }}
        />
        <div className="flex justify-between text-xs text-purple-300 tabular-nums">
          <span>{formatearTiempo(progress)}</span>
          <span>{ready ? formatearTiempo(duration) : '…'}</span>
        </div>
      </div>

      <p className="mt-3 text-center text-[11px] text-purple-400/80">
        {playing ? 'Meditación en curso… respira con calma ✨' : 'Toca ▶ para comenzar'}
      </p>
    </div>
  )
}
