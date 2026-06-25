import { useState } from 'react'
import tarotData from '../data/tarot.json'
import { saveTarotReading } from '../services/firestoreService'
import { useSound } from '../contexts/SoundContext'
import TarotFlipCard from '../components/TarotFlipCard'
import ServiceAvatar from '../components/ServiceAvatar'
import avatarVidente from '../assets/avatares/vidente.png'

const imagenes = import.meta.glob('../assets/cartas/*.jpg', { eager: true, import: 'default' })

function obtenerImagenCarta(carta) {
  if (!carta?.imagen) return null
  return Object.entries(imagenes).find(([ruta]) => ruta.endsWith(`/${carta.imagen}`))?.[1] ?? null
}

function CartaImagen({ carta }) {
  const [error, setError] = useState(false)
  const src = obtenerImagenCarta(carta)

  if (!src || error) {
    return (
      <div className="w-full aspect-[2/3] max-h-44 flex items-center justify-center rounded-lg border-2 border-[#fbbf24]/40 bg-purple-950/40">
        <span className="text-4xl text-purple-400/70" aria-hidden="true">🃏</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={carta.nombre}
      onError={() => setError(true)}
      className="w-full max-h-44 object-contain rounded-lg border-2 border-[#fbbf24]/60 shadow-[0_0_12px_rgba(251,191,36,0.2)]"
    />
  )
}

export default function Tarot() {
  const { playChime } = useSound()
  const [tipoLectura, setTipoLectura] = useState(null)
  const [cartasSeleccionadas, setCartasSeleccionadas] = useState([])
  const [cartasVolteadas, setCartasVolteadas] = useState({})
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  const seleccionarCartasAleatorias = (cantidad) => {
    const cartas = tarotData.cartas_tarot
    const seleccionadas = []
    const indicesUsados = new Set()

    while (seleccionadas.length < cantidad) {
      const indiceAleatorio = Math.floor(Math.random() * cartas.length)
      if (!indicesUsados.has(indiceAleatorio)) {
        indicesUsados.add(indiceAleatorio)
        seleccionadas.push(cartas[indiceAleatorio])
      }
    }

    return seleccionadas
  }

  const iniciarLectura = (tipo) => {
    const cantidad = tipo === 'una' ? 1 : 3
    const cartas = seleccionarCartasAleatorias(cantidad)
    setTipoLectura(tipo)
    setCartasSeleccionadas(cartas)
    setCartasVolteadas({})
    setSaveMessage('')
  }

  const voltearCarta = (index) => {
    playChime()
    setCartasVolteadas(prev => ({
      ...prev,
      [index]: true
    }))
  }

  const handleSaveReading = async () => {
    setSaving(true)
    setSaveMessage('')
    
    const result = await saveTarotReading(
      cartasSeleccionadas,
      tipoLectura === 'una' ? 'one-card' : 'three-cards',
      ''
    )
    
    if (result.success) {
      setSaveMessage('✅ Lectura guardada exitosamente')
      setTimeout(() => setSaveMessage(''), 3000)
    } else {
      setSaveMessage('❌ Error al guardar')
    }
    
    setSaving(false)
  }

  const nuevaLectura = () => {
    setTipoLectura(null)
    setCartasSeleccionadas([])
    setCartasVolteadas({})
    setSaveMessage('')
  }

  const todasVolteadas = cartasSeleccionadas.length > 0 &&
    cartasSeleccionadas.every((_, index) => cartasVolteadas[index])

  const obtenerMensajeInterpretativo = (tipo, index, carta) => {
    const contenido = carta.descripcion_breve || carta.significado_derecho
    if (!contenido) return ''

    if (tipo === 'una') {
      return `Mensaje para ti: ${contenido}`
    }

    if (tipo === 'tres') {
      if (index === 0) return `Tu pasado revela: ${contenido}`
      if (index === 1) return `Tu presente indica: ${contenido}`
      if (index === 2) return `Tu futuro sugiere: ${contenido}`
    }

    return ''
  }

  const generarLecturaFinal = () => {
    if (cartasSeleccionadas.length !== 3) return ''
    
    const [pasado, presente, futuro] = cartasSeleccionadas
    
    const mensajes = [
      `Tu camino comienza con la energía de ${pasado.nombre}, que en tu presente se transforma con ${presente.nombre} y te conduce hacia ${futuro.nombre}. Confía en esta secuencia.`,
      `${pasado.nombre} marcó una etapa; ${presente.nombre} ilumina tu ahora y ${futuro.nombre} te espera como destino. Integra las tres para avanzar.`,
      `Lo que ${pasado.nombre} sembró encuentra en ${presente.nombre} su momento de florecer, y ${futuro.nombre} será la cosecha. Camina con conciencia.`,
      `Desde ${pasado.nombre} hasta ${presente.nombre}, tu alma ha tejido una historia que ${futuro.nombre} completa. Honra las tres cartas.`,
      `${pasado.nombre}, ${presente.nombre} y ${futuro.nombre} dialogan en tu lectura: una misma energía que se revela en tres tiempos. Escucha su mensaje.`
    ]

    const indice = Math.floor(Math.random() * mensajes.length)
    return mensajes[indice]
  }

  const renderContenidoCarta = (carta, mensajeInterpretativo) => (
    <div className="space-y-4">
      <CartaImagen carta={carta} />
      <h3 className="text-yellow-300 font-bold text-xl">{carta.nombre}</h3>
      <p className="text-gray-200 text-base leading-relaxed">{carta.significado_derecho}</p>
      {mensajeInterpretativo && (
        <p className="text-purple-200 italic leading-relaxed">{mensajeInterpretativo}</p>
      )}

      {carta.interpretacion_extendida && (
        <p className="text-purple-100 text-sm leading-relaxed border-l-2 border-[#fbbf24]/70 pl-3 py-1 bg-purple-950/30 rounded-r-lg">
          {carta.interpretacion_extendida}
        </p>
      )}

      {carta.consejo && (
        <div className="bg-purple-900/40 border border-purple-500/50 rounded-xl p-3">
          <h4 className="text-[#fbbf24] font-semibold text-sm mb-2">✨ Consejo</h4>
          <p className="text-gray-100 text-sm leading-relaxed">{carta.consejo}</p>
        </div>
      )}

      {carta.en_el_amor && (
        <div className="bg-purple-900/40 border border-purple-500/50 rounded-xl p-3">
          <h4 className="text-[#fbbf24] font-semibold text-sm mb-2">💞 En el amor</h4>
          <p className="text-gray-100 text-sm leading-relaxed">{carta.en_el_amor}</p>
        </div>
      )}

      {carta.en_el_trabajo && (
        <div className="bg-purple-900/40 border border-purple-500/50 rounded-xl p-3">
          <h4 className="text-[#fbbf24] font-semibold text-sm mb-2">💼 En el trabajo</h4>
          <p className="text-gray-100 text-sm leading-relaxed">{carta.en_el_trabajo}</p>
        </div>
      )}

      <div className="pt-1">
        <div className="flex flex-wrap gap-2">
          {carta.palabras_clave.map((palabra, i) => (
            <span
              key={i}
              className="text-xs bg-purple-600/30 text-purple-200 px-2 py-1 rounded border border-purple-600/60"
            >
              {palabra}
            </span>
          ))}
        </div>
      </div>
    </div>
  )

  if (!tipoLectura) {
    return (
      <div className="max-w-md mx-auto px-4 pt-10 pb-4">
        <ServiceAvatar src={avatarVidente} alt="Vidente del Tarot" />
        <h1 className="text-3xl font-bold text-yellow-300 mb-2 text-center">🃏 Tarot</h1>
        <p className="text-purple-200 mb-6 text-center">
          Conecta con la sabiduría del tarot y recibe orientación para tu camino espiritual.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => iniciarLectura('una')}
            className="w-full bg-gradient-to-r from-purple-800/80 to-purple-600/80 border-2 border-purple-500/60 rounded-2xl p-6 shadow-lg shadow-purple-900/60 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="text-yellow-300 text-2xl mb-2">🔮</div>
            <h2 className="text-xl font-bold text-yellow-300 mb-1">Una Carta</h2>
            <p className="text-sm text-purple-100">Lectura rápida para orientación diaria</p>
          </button>

          <button
            onClick={() => iniciarLectura('tres')}
            className="w-full bg-gradient-to-r from-purple-800/80 to-purple-600/80 border-2 border-purple-500/60 rounded-2xl p-6 shadow-lg shadow-purple-900/60 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="text-yellow-300 text-2xl mb-2">✨</div>
            <h2 className="text-xl font-bold text-yellow-300 mb-1">Tres Cartas</h2>
            <p className="text-sm text-purple-100">Pasado, Presente y Futuro</p>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-10 pb-24">
      <ServiceAvatar src={avatarVidente} alt="Vidente del Tarot" />
      <h1 className="text-3xl font-bold text-yellow-300 mb-2 text-center">🃏 Tarot</h1>
      
      <div className="mt-6">
        {/* Lectura 1 carta: tarjeta clásica */}
        {tipoLectura === 'una' && (
          <div className="grid grid-cols-1 gap-4 mb-6">
            {cartasSeleccionadas.map((carta, index) => {
              const estaVolteada = cartasVolteadas[index]
              const mensajeInterpretativo = obtenerMensajeInterpretativo(tipoLectura, index, carta)

              return (
                <div key={index} className="flex flex-col items-center">
                  <TarotFlipCard
                    flipped={!!estaVolteada}
                    onFlip={() => voltearCarta(index)}
                  >
                    {renderContenidoCarta(carta, mensajeInterpretativo)}
                  </TarotFlipCard>
                </div>
              )
            })}
          </div>
        )}

        {tipoLectura === 'tres' && (
          <div className="mb-6 space-y-5">
            {cartasSeleccionadas.map((carta, index) => {
              const estaVolteada = cartasVolteadas[index]
              const etiquetaTiempo = ['Pasado', 'Presente', 'Futuro'][index]
              const mensajeInterpretativo = obtenerMensajeInterpretativo(tipoLectura, index, carta)

              return (
                <TarotFlipCard
                  key={index}
                  flipped={!!estaVolteada}
                  onFlip={() => voltearCarta(index)}
                  label={etiquetaTiempo}
                >
                  {renderContenidoCarta(carta, mensajeInterpretativo)}
                </TarotFlipCard>
              )
            })}
          </div>
        )}

        {tipoLectura === 'tres' && todasVolteadas && (
          <div className="mt-8 mb-6 bg-gradient-to-br from-yellow-900/40 to-purple-900/40 border-2 border-yellow-500/60 rounded-2xl p-6">
            <h2 className="text-yellow-300 font-bold text-lg text-center mb-4">
              ✨ Lectura Final de tu Camino
            </h2>
            <p className="text-purple-100 italic leading-relaxed break-words mb-1">
              {generarLecturaFinal()}
            </p>
          </div>
        )}

        {todasVolteadas && (
          <div className="space-y-4">
            <button
              onClick={handleSaveReading}
              disabled={saving}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? '💾 Guardando...' : '💾 Guardar Lectura'}
            </button>

            {saveMessage && (
              <p className="text-center text-sm font-medium mb-1">
                {saveMessage}
              </p>
            )}

            <button
              onClick={nuevaLectura}
              className="w-full bg-gradient-to-r from-yellow-600/80 to-yellow-500/80 border-2 border-yellow-400/60 rounded-xl py-3 px-6 text-purple-900 font-bold shadow-lg shadow-yellow-900/60 hover:shadow-yellow-500/40 transition-all duration-300 hover:scale-[1.02]"
            >
              ✨ Nueva Lectura
            </button>
          </div>
        )}
      </div>
    </div>
  )
}