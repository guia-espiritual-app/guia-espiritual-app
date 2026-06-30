import { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Howl, Howler } from 'howler'
import bgMusic from '../assets/sounds/background.mp3'
import chimeSound from '../assets/sounds/chime.mp3'

const SoundContext = createContext()

function isHowlUsable(howl) {
  return howl != null && howl.state() !== 'unloaded'
}

export function useSound() {
  return useContext(SoundContext)
}

export function SoundProvider({ children }) {
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [welcomeVisible, setWelcomeVisible] = useState(true)
  const soundEnabledRef = useRef(false)
  const bgMusicRef = useRef(null)
  const chimeRef = useRef(null)

  const createBgHowl = useCallback(() => {
    console.log('[SoundContext] creando instancia de música de fondo — src:', bgMusic)
    return new Howl({
      src: [bgMusic],
      format: ['mp3'],
      html5: true,
      loop: true,
      volume: 0.4,
      preload: true,
      onload: () => {
        console.log('[SoundContext] música de fondo cargada correctamente')
      },
      onloaderror: (id, err) => {
        console.log('[SoundContext] Error carga música:', id, err)
      },
      onplayerror: (id, err) => {
        console.log('[SoundContext] Error play música:', id, err)
      },
    })
  }, [])

  const createChimeHowl = useCallback(() => {
    console.log('[SoundContext] creando instancia de chime')
    return new Howl({
      src: [chimeSound],
      volume: 0.85,
      preload: true,
      html5: true,
      pool: 5,
    })
  }, [])

  const ensureBgHowl = useCallback(() => {
    if (!isHowlUsable(bgMusicRef.current)) {
      console.log('[SoundContext] bg Howl ausente o unloaded — recreando')
      bgMusicRef.current = createBgHowl()
    }
    return bgMusicRef.current
  }, [createBgHowl])

  const ensureChimeHowl = useCallback(() => {
    if (!isHowlUsable(chimeRef.current)) {
      console.log('[SoundContext] chime Howl ausente o unloaded — recreando')
      chimeRef.current = createChimeHowl()
    }
    return chimeRef.current
  }, [createChimeHowl])

  const resumeAudioContext = useCallback(() => {
    if (Howler.ctx && Howler.ctx.state === 'suspended') {
      console.log('[SoundContext] reanudando AudioContext suspendido')
      Howler.ctx.resume()
    }
  }, [])

  const playBgMusic = useCallback(() => {
    const bg = ensureBgHowl()
    console.log('[SoundContext] playBgMusic — state:', bg.state())

    const playNow = () => {
      resumeAudioContext()
      const soundId = bg.play()
      console.log('[SoundContext] bg.play() id:', soundId, 'playing:', bg.playing())
    }

    if (bg.state() === 'loaded') {
      playNow()
    } else {
      bg.once('load', playNow)
      if (bg.state() === 'unloaded') {
        bg.load()
      }
    }
  }, [ensureBgHowl, resumeAudioContext])

  const pauseBgMusic = useCallback(() => {
    if (isHowlUsable(bgMusicRef.current)) {
      console.log('[SoundContext] pausando música de fondo')
      bgMusicRef.current.pause()
    }
  }, [])

  useEffect(() => {
    console.log('[SoundContext] provider montado — preparando instancias')
    ensureBgHowl()
    ensureChimeHowl()

    return () => {
      console.log('[SoundContext] provider desmontado — unload instancias')
      bgMusicRef.current?.unload()
      chimeRef.current?.unload()
      bgMusicRef.current = null
      chimeRef.current = null
    }
  }, [ensureBgHowl, ensureChimeHowl])

  useEffect(() => {
    const resumeIfNeeded = () => {
      if (
        document.visibilityState === 'visible' &&
        soundEnabledRef.current &&
        isHowlUsable(bgMusicRef.current) &&
        !bgMusicRef.current.playing()
      ) {
        playBgMusic()
      }
    }

    document.addEventListener('visibilitychange', resumeIfNeeded)
    window.addEventListener('focus', resumeIfNeeded)

    return () => {
      document.removeEventListener('visibilitychange', resumeIfNeeded)
      window.removeEventListener('focus', resumeIfNeeded)
    }
  }, [playBgMusic])

  const enableSound = useCallback(() => {
    if (soundEnabledRef.current) return
    console.log('[SoundContext] enableSound()')
    soundEnabledRef.current = true
    setSoundEnabled(true)
    playBgMusic()
  }, [playBgMusic])

  const toggleSound = useCallback(() => {
    const next = !soundEnabledRef.current
    console.log('[SoundContext] toggleSound() — next:', next)

    soundEnabledRef.current = next
    setSoundEnabled(next)

    if (next) {
      playBgMusic()
    } else {
      pauseBgMusic()
    }
  }, [playBgMusic, pauseBgMusic])

  const playChime = useCallback(() => {
    console.log('[SoundContext] playChime() — soundEnabled:', soundEnabledRef.current)

    if (!soundEnabledRef.current) {
      console.log('[SoundContext] playChime() omitido: sonido desactivado')
      return
    }

    const chime = ensureChimeHowl()

    const playNow = () => {
      resumeAudioContext()
      chime.stop()
      const soundId = chime.play()
      console.log('[SoundContext] chime.play() id:', soundId, 'playing:', chime.playing())
    }

    if (chime.state() === 'loaded') {
      playNow()
    } else {
      chime.once('load', playNow)
      if (chime.state() === 'unloaded') {
        chime.load()
      }
    }
  }, [ensureChimeHowl, resumeAudioContext])

  const dismissWelcome = useCallback(() => {
    setWelcomeVisible(false)
  }, [])

  const activateFromWelcome = useCallback(() => {
    enableSound()
    setWelcomeVisible(false)
  }, [enableSound])

  const value = useMemo(
    () => ({
      soundEnabled,
      toggleSound,
      playChime,
      enableSound,
      welcomeVisible,
      dismissWelcome,
      activateFromWelcome,
    }),
    [soundEnabled, toggleSound, playChime, enableSound, welcomeVisible, dismissWelcome, activateFromWelcome]
  )

  return (
    <SoundContext.Provider value={value}>
      {children}

      {welcomeVisible && (
        <div className="fixed inset-x-0 bottom-0 z-[70] flex justify-center px-4 pb-24 pointer-events-none">
          <div
            role="dialog"
            aria-label="Activar experiencia sonora"
            className="pointer-events-auto w-full max-w-md bg-gradient-to-br from-purple-900/95 to-[#1a1a2e]/95 border border-yellow-400/40 rounded-2xl p-4 shadow-[0_0_24px_rgba(139,92,246,0.35)] backdrop-blur-md"
          >
            <div className="flex items-start gap-3">
              <p className="flex-1 text-purple-100 text-sm leading-relaxed pt-0.5">
                <span className="mr-1">🔊</span>
                <span className="text-yellow-300 font-semibold">Activa la experiencia sonora mística</span>
                <span className="block text-purple-300 text-xs mt-1">
                  Música ambiental y campanas en tus lecturas
                </span>
              </p>
              <button
                type="button"
                onClick={dismissWelcome}
                aria-label="Cerrar aviso"
                className="shrink-0 text-purple-400 hover:text-purple-200 text-lg leading-none px-1 transition-colors"
              >
                ✕
              </button>
            </div>
            <button
              type="button"
              onClick={activateFromWelcome}
              className="mt-3 w-full bg-gradient-to-r from-yellow-600/90 to-yellow-500/90 border border-yellow-400/60 rounded-xl py-2.5 px-4 text-purple-900 font-bold text-sm shadow-lg shadow-yellow-900/40 hover:scale-[1.01] transition-all duration-200"
            >
              Activar
            </button>
          </div>
        </div>
      )}
    </SoundContext.Provider>
  )
}
