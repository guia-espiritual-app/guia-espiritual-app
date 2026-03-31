import { useState, useEffect } from 'react'
import { getUserReadings } from '../services/firestoreService'

export default function Historial() {
  const [readings, setReadings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReadings()
  }, [])

  const loadReadings = async () => {
    setLoading(true)
    const result = await getUserReadings()
    if (result.success) {
      setReadings(result.readings)
    }
    setLoading(false)
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Fecha desconocida'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getReadingIcon = (type) => {
    if (type === 'tarot') return '🃏'
    if (type === 'horoscope') return '♈'
    if (type === 'numerology') return '🔢'
    return '✨'
  }

  const getReadingTitle = (reading) => {
    if (reading.type === 'tarot') {
      return `Tarot - ${reading.spreadType === 'one-card' ? '1 Carta' : '3 Cartas'}`
    }
    if (reading.type === 'horoscope') {
      return `Horóscopo - ${reading.sign}`
    }
    if (reading.type === 'numerology') {
      return `Numerología - Número ${reading.number}`
    }
    return 'Lectura'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🔮</div>
          <p className="text-purple-300">Cargando tu historial...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-10 pb-4">
      <h1 className="text-3xl font-bold text-yellow-300 mb-2 text-center">📜 Historial</h1>
      <p className="text-purple-200 mb-6 text-center text-sm">
        Tus lecturas guardadas
      </p>

      {readings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-purple-300 mb-2">No tienes lecturas guardadas</p>
          <p className="text-purple-400 text-sm">
            Guarda tus lecturas de Tarot, Horóscopo o Numerología para verlas aquí
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {readings.map((reading) => (
            <div
              key={reading.id}
              className="bg-purple-900/40 border-2 border-purple-500/60 rounded-xl p-4 hover:border-purple-400/80 transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{getReadingIcon(reading.type)}</div>
                <div className="flex-1">
                  <h3 className="text-yellow-300 font-bold mb-1">
                    {getReadingTitle(reading)}
                  </h3>
                  <p className="text-purple-200 text-xs mb-2">
                    {formatDate(reading.timestamp)}
                  </p>

                  {reading.type === 'tarot' && reading.cards && (
                    <div className="mt-2">
                      <p className="text-sm text-purple-100">
                        {reading.cards.map(c => c.nombre).join(' • ')}
                      </p>
                    </div>
                  )}

                  {reading.type === 'horoscope' && (
                    <p className="text-sm text-purple-100 mt-2 line-clamp-2">
                      {reading.prediction}
                    </p>
                  )}

                  {reading.type === 'numerology' && (
                    <div className="mt-2">
                      <p className="text-sm text-purple-100">
                        <strong>{reading.archetype}</strong>
                      </p>
                      <p className="text-xs text-purple-200 mt-1">
                        {reading.energy}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}