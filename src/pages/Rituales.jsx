import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePremium } from '../contexts/PremiumContext'
import BurbujaGU from '../components/BurbujaGU'
import avatarEjercicios from '../assets/avatares/ejercicios.png'
import ritualesData from '../data/rituales.json'

const categorias = [...ritualesData.categorias].sort((a, b) => a.orden - b.orden)

function contarEjercicios(nombreCategoria) {
  const count = ritualesData.rituales.filter((r) => r.categoria === nombreCategoria).length
  return count === 1 ? '1 ejercicio' : `${count} ejercicios`
}

function BadgeAcceso({ gratuito }) {
  if (gratuito) {
    return (
      <span className="bg-green-600/30 text-green-200 text-xs font-bold px-2 py-0.5 rounded-full border border-green-500/60">
        Gratuito
      </span>
    )
  }
  return (
    <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-purple-900 text-xs font-bold px-2 py-0.5 rounded-full">
      Premium
    </span>
  )
}

function SeccionLista({ titulo, items, numerada = false }) {
  if (!items?.length) return null

  return (
    <div className="bg-purple-900/40 border border-purple-500/50 rounded-xl p-4">
      <h3 className="text-[#fbbf24] font-semibold text-sm mb-3">{titulo}</h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="text-gray-100 text-sm leading-relaxed flex gap-2">
            {numerada && (
              <span className="text-yellow-300/80 font-semibold shrink-0">{index + 1}.</span>
            )}
            {!numerada && <span className="text-purple-400 shrink-0">•</span>}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Rituales() {
  const { isPremium, loading: premiumLoading } = usePremium()
  const navigate = useNavigate()
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null)
  const [ritualSeleccionado, setRitualSeleccionado] = useState(null)

  const ritualesDeCategoria = categoriaSeleccionada
    ? ritualesData.rituales.filter((r) => r.categoria === categoriaSeleccionada.nombre)
    : []

  const puedeVerCompleto = (ritual) => ritual.gratuito || isPremium

  if (premiumLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🔮</div>
          <p className="text-purple-300">Cargando...</p>
        </div>
      </div>
    )
  }

  if (ritualSeleccionado) {
    const ritual = ritualSeleccionado
    const categoria = categorias.find((c) => c.nombre === ritual.categoria)
    const verCompleto = puedeVerCompleto(ritual)

    return (
      <div className="max-w-md mx-auto px-4 pt-10 pb-24">
        <button
          type="button"
          onClick={() => setRitualSeleccionado(null)}
          className="text-purple-300 hover:text-yellow-300 text-sm mb-4 transition-colors"
        >
          ← Volver a {categoriaSeleccionada?.nombre || 'Rituales'}
        </button>

        <div className="flex flex-wrap items-center gap-2 mb-2">
          <BadgeAcceso gratuito={ritual.gratuito} />
          {categoria && (
            <span className="text-purple-300 text-xs">
              {categoria.emoji} {ritual.categoria}
            </span>
          )}
          <span className="text-purple-400 text-xs">⏱ {ritual.duracion}</span>
        </div>

        <h1 className="text-2xl font-bold text-yellow-300 mb-6">{ritual.nombre}</h1>

        <div className="space-y-4">
          <div className="bg-purple-900/40 border border-purple-500/50 rounded-xl p-4">
            <h3 className="text-[#fbbf24] font-semibold text-sm mb-2">Propósito</h3>
            <p className="text-gray-100 text-sm leading-relaxed">{ritual.proposito}</p>
          </div>

          {verCompleto ? (
            <>
              <SeccionLista titulo="Materiales" items={ritual.materiales} />
              <SeccionLista titulo="Preparación" items={ritual.preparacion} numerada />
              <SeccionLista titulo="Desarrollo de la Práctica" items={ritual.desarrollo} numerada />

              {ritual.oracion && (
                <div className="bg-gradient-to-br from-yellow-900/30 to-purple-900/40 border-2 border-yellow-500/50 rounded-xl p-5">
                  <h3 className="text-[#fbbf24] font-semibold text-sm mb-3">Oración</h3>
                  <p className="text-purple-100 italic leading-relaxed text-sm">{ritual.oracion}</p>
                </div>
              )}

              <SeccionLista titulo="Resultados Esperados" items={ritual.resultados} />
            </>
          ) : (
            <div className="bg-gradient-to-br from-purple-900/60 to-[#1a1a2e]/80 border-2 border-yellow-500/40 rounded-2xl p-6 text-center">
              <div className="text-5xl mb-3">🔒</div>
              <h3 className="text-yellow-300 font-bold text-lg mb-2">Este ritual es Premium</h3>
              <p className="text-purple-200 text-sm mb-5 leading-relaxed">
                Desbloquea la guía completa con materiales, preparación, oración y resultados esperados.
              </p>
              <button
                type="button"
                onClick={() => navigate('/planes')}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-purple-900 font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                Hazte Premium
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (categoriaSeleccionada) {
    return (
      <div className="max-w-md mx-auto px-4 pt-10 pb-24">
        <button
          type="button"
          onClick={() => setCategoriaSeleccionada(null)}
          className="text-purple-300 hover:text-yellow-300 text-sm mb-4 transition-colors"
        >
          ← Volver a categorías
        </button>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">{categoriaSeleccionada.emoji}</span>
          <div>
            <h1 className="text-2xl font-bold text-yellow-300">{categoriaSeleccionada.nombre}</h1>
            <p className="text-purple-300 text-sm">{contarEjercicios(categoriaSeleccionada.nombre)}</p>
          </div>
        </div>

        <div className="space-y-3">
          {ritualesDeCategoria.map((ritual) => (
            <button
              key={ritual.id}
              type="button"
              onClick={() => setRitualSeleccionado(ritual)}
              className="w-full text-left bg-purple-900/40 border-2 border-purple-500/60 rounded-xl p-4 hover:border-purple-400/80 hover:shadow-[0_0_16px_rgba(139,92,246,0.35)] transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="text-yellow-300 font-bold text-base leading-snug">
                  <span className="text-purple-400 font-semibold mr-2">#{ritual.id}</span>
                  {ritual.nombre}
                </p>
                <BadgeAcceso gratuito={ritual.gratuito} />
              </div>
              <p className="text-purple-300 text-xs">⏱ {ritual.duracion}</p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-10 pb-24">
      <BurbujaGU
        seccion="rituales"
        avatarSrc={avatarEjercicios}
        avatarAlt="Rituales"
        className="mb-6"
      />
      <h1 className="text-3xl font-bold text-yellow-300 mb-2 text-center">Rituales</h1>
      <p className="text-purple-200 text-center mb-8 text-sm">
        Prácticas esotéricas caseras para armonizar tu energía
      </p>

      <div className="space-y-3">
        {categorias.map((categoria) => (
          <button
            key={categoria.nombre}
            type="button"
            onClick={() => setCategoriaSeleccionada(categoria)}
            className="w-full text-left bg-purple-900/40 border-2 border-purple-500/60 rounded-2xl p-5 hover:scale-[1.01] hover:border-purple-400/80 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all duration-300"
            style={{ borderLeftWidth: '4px', borderLeftColor: categoria.color }}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl shrink-0">{categoria.emoji}</span>
              <div>
                <h2 className="text-yellow-300 font-bold text-lg">{categoria.nombre}</h2>
                <p className="text-purple-300 text-sm">
                  {categoria.nombre} · {contarEjercicios(categoria.nombre)}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <p className="mt-10 mb-4 text-center text-[11px] leading-relaxed text-purple-400/70 px-2">
        Contenido con fines de entretenimiento y bienestar personal. No garantiza
        resultados ni sustituye consejo profesional.
      </p>
    </div>
  )
}
