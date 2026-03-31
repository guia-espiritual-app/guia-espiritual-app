import { useState } from 'react'
import tarotData from '../data/tarot.json'
import { saveTarotReading } from '../services/firestoreService'

export default function Tarot() {
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

  if (!tipoLectura) {
    return (
      <div className="max-w-md mx-auto px-4 pt-10 pb-4">
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
    <div className="max-w-md mx-auto px-4 pt-10 pb-4">
      <h1 className="text-3xl font-bold text-yellow-300 mb-2 text-center">🃏 Tarot</h1>
      
      <div className="mt-6">
        <div className={`grid ${tipoLectura === 'una' ? 'grid-cols-1' : 'grid-cols-3'} gap-4 mb-6`}>
          {cartasSeleccionadas.map((carta, index) => {
            const estaVolteada = cartasVolteadas[index]
            const etiquetaTiempo = tipoLectura === 'tres'
              ? ['Pasado', 'Presente', 'Futuro'][index]
              : null
            const mensajeInterpretativo = obtenerMensajeInterpretativo(tipoLectura, index, carta)

            return (
              <div key={index} className="flex flex-col items-center">
                {etiquetaTiempo && (
                  <p className="text-xs text-purple-300 mb-2 font-medium">{etiquetaTiempo}</p>
                )}
                <button
                  onClick={() => !estaVolteada && voltearCarta(index)}
                  disabled={estaVolteada}
                  className={`w-full aspect-[2/3] rounded-xl border-2 transition-all duration-500 transform ${
                    estaVolteada
                      ? 'bg-gradient-to-br from-purple-900/90 to-purple-700/90 border-yellow-400/60 shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                      : 'bg-gradient-to-br from-[#1a1a2e] to-[#0f1020] border-purple-600/60 hover:border-purple-400/80 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] cursor-pointer hover:scale-105'
                  }`}
                >
                  {estaVolteada ? (
                    <div className="h-full flex flex-col justify-between p-3 text-left">
                      <div>
                        <h3 className="text-yellow-300 font-bold text-xl mb-2">{carta.nombre}</h3>
                        <p className="text-gray-200 text-base mb-4">
                          {carta.significado_derecho}
                        </p>
                        {mensajeInterpretativo && (
                          <p className="text-purple-200 italic mb-3">
                            {mensajeInterpretativo}
                          </p>
                        )}
                      </div>
                      <div className="mt-auto">
                        <div className="flex flex-wrap gap-1">
                          {carta.palabras_clave.map((palabra, i) => (
                            <span
                              key={i}
                              className="text-xs bg-purple-600/30 text-purple-200 px-2 py-0.5 rounded border border-purple-600/60"
                            >
                              {palabra}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-4xl text-purple-400/60">🃏</div>
                    </div>
                  )}
                </button>
              </div>
            )
          })}
        </div>

        {tipoLectura === 'tres' && todasVolteadas && (
          <div className="mb-6 bg-gradient-to-br from-yellow-900/40 to-purple-900/40 border-2 border-yellow-500/60 rounded-2xl p-6">
            <h2 className="text-yellow-300 font-bold text-lg mb-3 text-center">
              ✨ Lectura Final de tu Camino
            </h2>
            <p className="text-purple-100 italic leading-relaxed">
              {generarLecturaFinal()}
            </p>
          </div>
        )}

        {todasVolteadas && (
          <div className="space-y-3">
            <button
              onClick={handleSaveReading}
              disabled={saving}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? '💾 Guardando...' : '💾 Guardar Lectura'}
            </button>

            {saveMessage && (
              <p className="text-center text-sm font-medium">
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