import { useState } from 'react'
import signosData from '../data/signos.json'
import { saveHoroscopeReading } from '../services/firestoreService'

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

const generarPrediccionDiaria = (signo) => {
  const elemento = signo.elemento
  const fortalezaPrincipal = signo.fortalezas[0] || 'energía'
  const nombre = signo.nombre

  const prediccionesPorElemento = {
    'Fuego': [
      `Hoy tu energía de fuego brilla intensamente. Es momento de liderar con tu ${fortalezaPrincipal} natural y compartir tu luz con quienes te rodean.`,
      `Tu ${fortalezaPrincipal} será reconocida hoy. Confía en tu instinto y no temas expresar tus ideas con ese carisma que te caracteriza.`,
      `La pasión que te define como ${nombre} se activa hoy. Usa tu ${fortalezaPrincipal} para inspirar a otros y avanzar en tus proyectos.`,
      `Hoy el universo te invita a encender tu fuego interior. Tu ${fortalezaPrincipal} es tu mayor aliado para superar cualquier desafío.`
    ],
    'Tierra': [
      `Hoy es un día perfecto para construir sobre bases sólidas. Tu ${fortalezaPrincipal} te ayudará a materializar tus planes con paciencia y determinación.`,
      `La estabilidad que caracteriza a ${nombre} será tu guía hoy. Confía en tu ${fortalezaPrincipal} para tomar decisiones prácticas y sensatas.`,
      `Tu conexión con lo tangible se fortalece hoy. Usa tu ${fortalezaPrincipal} para crear algo duradero y significativo en tu vida.`,
      `Hoy la tierra te ofrece su sabiduría. Aprovecha tu ${fortalezaPrincipal} para cultivar resultados concretos y satisfactorios.`
    ],
    'Aire': [
      `Hoy las ideas fluyen libremente para ti, ${nombre}. Tu ${fortalezaPrincipal} te permitirá comunicar con claridad y conectar con otros.`,
      `El viento de la inspiración sopla a tu favor hoy. Usa tu ${fortalezaPrincipal} para compartir tus pensamientos y crear nuevas conexiones.`,
      `Tu mente está especialmente activa hoy. Aprovecha tu ${fortalezaPrincipal} para aprender algo nuevo y expandir tus horizontes.`,
      `Hoy es momento de elevar tu perspectiva, ${nombre}. Tu ${fortalezaPrincipal} te ayudará a ver las situaciones desde un ángulo más amplio.`
    ],
    'Agua': [
      `Hoy tus emociones fluyen con sabiduría, ${nombre}. Tu ${fortalezaPrincipal} te guiará para navegar los sentimientos con intuición y compasión.`,
      `La profundidad emocional que caracteriza a ${nombre} se activa hoy. Confía en tu ${fortalezaPrincipal} para sanar y conectar profundamente.`,
      `Hoy el agua te invita a sumergirte en tu mundo interior. Tu ${fortalezaPrincipal} te ayudará a entender mejor tus emociones y las de otros.`,
      `La sensibilidad de ${nombre} será tu guía hoy. Usa tu ${fortalezaPrincipal} para crear vínculos emocionales auténticos y sanadores.`
    ]
  }

  const mensajes = prediccionesPorElemento[elemento] || prediccionesPorElemento['Fuego']
  const indiceAleatorio = Math.floor(Math.random() * mensajes.length)
  return mensajes[indiceAleatorio]
}

export default function Horoscopo() {
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

  const verPrediccion = (signo) => {
    setSignoSeleccionado(signo)
  }

  const volverASignos = () => {
    setSignoSeleccionado(null)
  }

  if (signoSeleccionado) {
    return (
      <div className="max-w-md mx-auto px-4 pt-10 pb-4">
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
              <h2 className="text-yellow-300 font-bold text-lg mb-3">Tu Predicción de Hoy</h2>
              <p className="text-purple-100 italic leading-relaxed">
                {generarPrediccionDiaria(signoSeleccionado)}
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
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-10 pb-4">
      <h1 className="text-3xl font-bold text-yellow-300 mb-2 text-center">♈ Horóscopo</h1>
      <p className="text-purple-200 mb-6 text-center">
        Explora las energías de los signos y cómo influyen en tu día a día.
      </p>

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
    </div>
  )
}
