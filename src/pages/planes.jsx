import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePremium } from '../contexts/PremiumContext'

export default function Planes() {
  const { isPremium, activatePremium } = usePremium()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleUpgrade = async () => {
    setLoading(true)
    
    // Simular proceso de pago
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const result = await activatePremium()
    
    if (result.success) {
      alert('🎉 ¡Bienvenido a Premium! Ahora tienes acceso completo.')
      navigate('/')
    } else {
      alert('❌ Error al activar Premium. Intenta de nuevo.')
    }
    
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-10 pb-4">
      <h1 className="text-3xl font-bold text-yellow-300 mb-2 text-center">✨ Planes</h1>
      <p className="text-purple-200 mb-8 text-center">
        Elige el plan perfecto para tu viaje espiritual
      </p>

      {isPremium && (
        <div className="bg-gradient-to-r from-green-900/40 to-green-700/40 border-2 border-green-500/60 rounded-xl p-4 mb-6 text-center">
          <p className="text-green-200 font-bold">🎉 ¡Ya eres Premium!</p>
          <p className="text-green-300 text-sm">Disfruta de todas las funcionalidades</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Plan Gratuito */}
        <div className="bg-purple-900/40 border-2 border-purple-500/60 rounded-2xl p-6">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-purple-200 mb-1">Plan Gratuito</h2>
            <p className="text-4xl font-bold text-yellow-300">$0</p>
            <p className="text-purple-300 text-sm">Para siempre</p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <p className="text-purple-200 text-sm">Horóscopo diario</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <p className="text-purple-200 text-sm">Tarot básico (1-3 cartas)</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <p className="text-purple-200 text-sm">Numerología básica</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <p className="text-purple-200 text-sm">Frase del día</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <p className="text-purple-200 text-sm">Historial de lecturas</p>
            </div>
          </div>

          <button
            disabled
            className="w-full bg-purple-700/50 text-purple-300 font-bold py-3 px-6 rounded-xl cursor-not-allowed"
          >
            Plan Actual
          </button>
        </div>

        {/* Plan Premium */}
        <div className="bg-gradient-to-br from-yellow-900/60 to-yellow-700/60 border-4 border-yellow-400/80 rounded-2xl p-6 shadow-[0_0_30px_rgba(212,175,55,0.4)] relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-purple-900 text-xs font-bold px-4 py-1 rounded-full shadow-lg">
              ⭐ MÁS POPULAR
            </span>
          </div>

          <div className="text-center mb-4 mt-2">
            <h2 className="text-2xl font-bold text-yellow-200 mb-1">Plan Premium</h2>
            <p className="text-5xl font-bold text-yellow-300">$4.99</p>
            <p className="text-yellow-200 text-sm">por mes</p>
          </div>

          <div className="space-y-3 mb-6">
            <p className="text-yellow-100 font-semibold text-sm mb-2">✨ Todo lo del plan gratuito, más:</p>
            
            <div className="flex items-start gap-2">
              <span className="text-yellow-300 mt-0.5">⭐</span>
              <p className="text-yellow-100 text-sm font-medium">Carta Astral completa</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-300 mt-0.5">⭐</span>
              <p className="text-yellow-100 text-sm font-medium">Lecturas ilimitadas de Tarot</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-300 mt-0.5">⭐</span>
              <p className="text-yellow-100 text-sm font-medium">Registros Akáshicos</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-300 mt-0.5">⭐</span>
              <p className="text-yellow-100 text-sm font-medium">Spreads avanzados de Tarot</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-300 mt-0.5">⭐</span>
              <p className="text-yellow-100 text-sm font-medium">Sin anuncios</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-300 mt-0.5">⭐</span>
              <p className="text-yellow-100 text-sm font-medium">Soporte prioritario</p>
            </div>
          </div>

          {isPremium ? (
            <button
              disabled
              className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-xl cursor-not-allowed"
            >
              ✓ Ya eres Premium
            </button>
          ) : (
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-purple-900 font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Procesando...' : '🚀 Actualizar a Premium'}
            </button>
          )}

          <p className="text-yellow-200/80 text-xs text-center mt-3">
            Cancela en cualquier momento. Sin compromisos.
          </p>
        </div>
      </div>

      <p className="text-purple-300 text-xs text-center mt-6">
        💳 Pago seguro procesado por Stripe
      </p>
    </div>
  )
}