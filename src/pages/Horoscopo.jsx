import { useState } from 'react'
import signosData from '../data/signos.json'
import horoscopoMensajes from '../data/horoscopo_mensajes.json'
import { saveHoroscopeReading } from '../services/firestoreService'
import { useSound } from '../contexts/SoundContext'
import { useLimiteDiario } from '../hooks/useLimiteDiario'
import ServiceAvatar from '../components/ServiceAvatar'
import BurbujaGU from '../components/BurbujaGU'
import AvisoLimiteDiario from '../components/AvisoLimiteDiario'
import CierreLecturaGU from '../components/CierreLecturaGU'
import BotonAtras from '../components/BotonAtras'
import avatarSacerdotisa from '../assets/avatares/sacerdotisa.png'

const rotarCompatibilidades = (compatibilidadOriginal) => {
  const mesActual = new Date().getMonth() // 0-11
  const rotacion = mesActual % compatibilidadOriginal.length

  // Rotar el array según el mes
  return [
    ...compatibilidadOriginal.slice(rotacion),
    ...compatibilidadOriginal.slice(0, rotacion)
  ]
}

const simbolosZodiacales = {
  'Aries': '♈',
  'Tauro': '♉',
  'Geminis': '♊',
  'Cancer': '♋',
  'Leo': '♌',
  'Virgo': '♍',
  'Libra': '♎',
  'Escorpio': '♏',
  'Sagitario': '♐',
  'Capricornio': '♑',
  'Acuario': '♒',
  'Piscis': '♓'
}

/** Día del año local (1–366), para rotación consistente entre usuarios. */
function getDiaDelAno(fecha = new Date()) {
  const year = fecha.getFullYear()
  const inicio = new Date(year, 0, 1)
  const hoy = new Date(year, fecha.getMonth(), fecha.getDate())
  const diffMs = hoy.getTime() - inicio.getTime()
  return Math.floor(diffMs / 86400000) + 1
}

/**
 * Predicción del día: misma fecha + mismo signo → mismo contenido para todos.
 * Índice = díaDelAño % cantidad de mensajes del signo.
 */
function obtenerPrediccionDiaria(signo) {
  const mensajes = horoscopoMensajes[signo.nombre]
  const fallback = {
    general: 'Hoy los astros te invitan a confiar en tu camino con serenidad.',
    amor: 'Abre el corazón con honestidad y suavidad.',
    dinero: 'Organiza prioridades y avanza con foco.',
    salud: 'Honra descanso y movimiento consciente.',
    piedra: {
      nombre: 'Cuarzo Transparente',
      emoji: '✨',
      motivo: 'para clarificar tu intención del día.',
    },
  }

  if (!mensajes?.length) return fallback

  const dia = getDiaDelAno()
  const indice = (dia - 1) % mensajes.length
  return mensajes[indice]
}

function SeccionPrediccion({ titulo, texto }) {
  return (
    <div className="bg-purple-800/40 border border-purple-600/60 rounded-xl p-4">
      <h3 className="text-[#fbbf24] font-bold text-base mb-2">{titulo}</h3>
      <p className="text-purple-100 text-sm leading-relaxed">{texto}</p>
    </div>
  )
}

export default function Horoscopo() {
  const { playChime } = useSound()
  const { limiteAlcanzado, listo, intentarLectura, periodo } = useLimiteDiario('horoscopo')
  const [signoSeleccionado, setSignoSeleccionado] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  
  const signos = signosData.signos_zodiacales

  const handleSaveReading = async () => {
    if (!signoSeleccionado) return
    
    setSaving(true)
    setSaveMessage('')
    
    const result = await saveHoroscopeReading(signoSeleccionado)
    
    if (result.success) {
      setSaveMessage('✅ Horóscopo guardado exitosamente')
      setTimeout(() => setSaveMessage(''), 3000)
    } else {
      setSaveMessage('❌ Error al guardar')
    }
    
    setSaving(false)
  }

  const verPrediccion = async (signo) => {
    const permitido = await intentarLectura()
    if (!permitido) return

    setSignoSeleccionado(signo)
    playChime()
  }

  const volverASignos = () => {
    setSignoSeleccionado(null)
  }

  if (signoSeleccionado) {
    const prediccion = obtenerPrediccionDiaria(signoSeleccionado)

    return (
      <div className="max-w-md mx-auto px-4 pt-10 pb-4">
        <BotonAtras />
        <ServiceAvatar src={avatarSacerdotisa} alt="Sacerdotisa del Horóscopo" />
        <div className="bg-gradient-to-br from-purple-900/90 to-purple-700/90 border-2 border-purple-500/60 rounded-2xl p-6 shadow-lg shadow-purple-900/60">
          <h1 className="text-4xl font-bold text-yellow-300 mb-2 text-center">
            {simbolosZodiacales[signoSeleccionado.nombre]} {signoSeleccionado.nombre}
          </h1>
          <p className="text-purple-200 text-center mb-6">{signoSeleccionado.fechas}</p>

          <div className="space-y-4">
            <div className="bg-purple-800/40 border border-purple-600/60 rounded-xl p-4">
              <h2 className="text-yellow-300 font-bold text-lg mb-2">Elemento y Planeta</h2>
              <p className="text-gray-200">
                <span className="font-semibold">Elemento:</span> {signoSeleccionado.elemento}
              </p>
              <p className="text-gray-200">
                <span className="font-semibold">Planeta Regente:</span> {signoSeleccionado.planeta_regente}
              </p>
            </div>

            <div className="bg-purple-800/40 border border-purple-600/60 rounded-xl p-4">
              <h2 className="text-yellow-300 font-bold text-lg mb-2">Características Generales</h2>
              <p className="text-gray-200">{signoSeleccionado.caracteristicas_generales}</p>
            </div>

            <div className="bg-purple-800/30 border border-purple-500/50 rounded-xl p-5">
              <h2 className="text-[#fbbf24] font-bold text-lg mb-3">Tu Predicción de Hoy</h2>
              <p className="text-purple-100 italic leading-relaxed">
                {prediccion.general}
              </p>
            </div>

            <SeccionPrediccion titulo="💖 Amor" texto={prediccion.amor} />
            <SeccionPrediccion titulo="💰 Dinero / Trabajo" texto={prediccion.dinero} />
            <SeccionPrediccion titulo="🌿 Salud" texto={prediccion.salud} />

            <div className="bg-gradient-to-br from-yellow-900/35 to-purple-900/50 border-2 border-[#fbbf24]/45 rounded-xl p-4">
              <h3 className="text-[#fbbf24] font-bold text-base mb-2">Piedra recomendada hoy</h3>
              <p className="text-purple-100 text-sm leading-relaxed">
                {prediccion.piedra.nombre} {prediccion.piedra.emoji} — {prediccion.piedra.motivo}
              </p>
            </div>

            <div className="bg-purple-800/40 border border-purple-600/60 rounded-xl p-4">
              <h2 className="text-yellow-300 font-bold text-lg mb-2">Fortalezas</h2>
              <div className="flex flex-wrap gap-2">
                {signoSeleccionado.fortalezas.map((fortaleza, index) => (
                  <span
                    key={index}
                    className="text-xs bg-green-600/30 text-green-200 px-3 py-1 rounded-full border border-green-600/60"
                  >
                    {fortaleza}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-purple-800/40 border border-purple-600/60 rounded-xl p-4">
              <h2 className="text-yellow-300 font-bold text-lg mb-2">Debilidades</h2>
              <div className="flex flex-wrap gap-2">
                {signoSeleccionado.debilidades.map((debilidad, index) => (
                  <span
                    key={index}
                    className="text-xs bg-red-600/30 text-red-200 px-3 py-1 rounded-full border border-red-600/60"
                  >
                    {debilidad}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-purple-800/40 border border-purple-600/60 rounded-xl p-4">
              <h2 className="text-yellow-300 font-bold text-lg mb-2">Compatibilidad Alta</h2>
              <div className="flex flex-wrap gap-2">
                {rotarCompatibilidades(signoSeleccionado.compatibilidad_alta).map((signo, index) => (
                  <span
                    key={index}
                    className="text-sm bg-purple-600/40 text-purple-200 px-3 py-1 rounded-full border border-purple-500/60"
                  >
                    {simbolosZodiacales[signo]} {signo}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-purple-800/40 border border-purple-600/60 rounded-xl p-4">
              <h2 className="text-yellow-300 font-bold text-lg mb-2">Compatibilidad Baja</h2>
              <div className="flex flex-wrap gap-2">
                {rotarCompatibilidades(signoSeleccionado.compatibilidad_baja).map((signo, index) => (
                  <span
                    key={index}
                    className="text-sm bg-purple-900/60 text-purple-300 px-3 py-1 rounded-full border border-purple-700/60"
                  >
                    {simbolosZodiacales[signo]} {signo}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={handleSaveReading}
              disabled={saving}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-3"
            >
              {saving ? '💾 Guardando...' : '💾 Guardar Horóscopo'}
            </button>

            {saveMessage && (
              <p className="text-center text-sm mb-3 font-medium">
                {saveMessage}
              </p>
            )}

            <button
              onClick={volverASignos}
              className="w-full bg-gradient-to-r from-purple-600/80 to-purple-500/80 border-2 border-purple-400/60 rounded-xl py-3 px-6 text-yellow-300 font-bold shadow-lg shadow-purple-900/60 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-[1.02]"
            >
              ← Volver a Signos
            </button>

            <CierreLecturaGU />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-10 pb-4">
        <BotonAtras />
      <BurbujaGU
        seccion="horoscopo"
        avatarSrc={avatarSacerdotisa}
        avatarAlt="Sacerdotisa del Horóscopo"
        className="mb-6"
      />
      <h1 className="text-3xl font-bold text-yellow-300 mb-2 text-center">♈ Horóscopo</h1>
      <p className="text-purple-200 mb-6 text-center">
        Explora las energías de los signos y cómo influyen en tu día a día.
      </p>

      {!listo ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3 animate-pulse">🔮</div>
          <p className="text-purple-300 text-sm">Consultando los astros...</p>
        </div>
      ) : limiteAlcanzado ? (
        <AvisoLimiteDiario periodo={periodo} />
      ) : (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {signos.map((signo) => (
          <button
            key={signo.nombre}
            onClick={() => verPrediccion(signo)}
            className="bg-purple-900/40 border-2 border-purple-500/60 rounded-xl p-4 hover:scale-105 hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] transition-all duration-300 hover:border-purple-400/80"
          >
            <div className="text-4xl mb-2">{simbolosZodiacales[signo.nombre]}</div>
            <h3 className="text-yellow-300 font-bold text-sm mb-1">{signo.nombre}</h3>
            <p className="text-purple-200 text-xs mb-3">{signo.fechas}</p>
            <span className="text-purple-300 text-xs font-medium bg-purple-800/40 px-2 py-1 rounded border border-purple-600/60">
              Ver predicción
            </span>
          </button>
        ))}
      </div>
      )}
    </div>
  )
}
