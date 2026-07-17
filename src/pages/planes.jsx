import { usePremium } from '../contexts/PremiumContext'
import Paywall from '../components/Paywall'
import BotonAtras from '../components/BotonAtras'

export default function Planes() {
  const { isPremium, loading } = usePremium()

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🔮</div>
          <p className="text-purple-300">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-10 pb-4">
        <BotonAtras />
      <h1 className="text-3xl font-bold text-yellow-300 mb-2 text-center">✨ Planes</h1>
      <p className="text-purple-200 mb-8 text-center">
        Elige cómo quieres caminar tu senda espiritual
      </p>

      {isPremium && (
        <div className="bg-gradient-to-r from-green-900/40 to-green-700/40 border-2 border-green-500/60 rounded-xl p-4 mb-6 text-center">
          <p className="text-green-200 font-bold">🎉 ¡Ya eres Premium!</p>
          <p className="text-green-300 text-sm">
            Lecturas ilimitadas, profundidad extra y ventajas exclusivas te esperan
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div className="bg-purple-900/40 border-2 border-purple-500/60 rounded-2xl p-6">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-purple-200 mb-1">Plan Gratuito</h2>
            <p className="text-4xl font-bold text-yellow-300">$0</p>
            <p className="text-purple-300 text-sm">Para siempre</p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <p className="text-purple-200 text-sm">Horóscopo (1 lectura a la semana)</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <p className="text-purple-200 text-sm">Tarot, Numerología y más (1 lectura al día)</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <p className="text-purple-200 text-sm">Rituales gratuitos seleccionados</p>
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

        {!isPremium && <Paywall />}
      </div>
    </div>
  )
}
