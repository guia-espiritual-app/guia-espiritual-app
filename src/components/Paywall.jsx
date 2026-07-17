import { useState, useEffect, useCallback } from 'react'
import { Capacitor } from '@capacitor/core'
import { usePremium } from '../contexts/PremiumContext'
import {
  fetchPremiumPackage,
  getRevenueCatErrorMessage,
  isRevenueCatConfigured,
} from '../lib/revenuecat'

const isNativePlatform = Capacitor.getPlatform() !== 'web'

const BENEFICIOS = [
  { emoji: '✨', texto: 'Lecturas ILIMITADAS en todos los servicios' },
  { emoji: '📖', texto: 'Lecturas más amplias y detalladas' },
  { emoji: '🛍️', texto: 'Descuentos en la Tienda y en lecturas' },
  { emoji: '🔮', texto: 'Novedades y contenido nuevo antes que nadie' },
  { emoji: '🚀', texto: 'Ser pionero y acceso anticipado a nuevas funciones' },
  { emoji: '🎮', texto: 'Acceso al juego (próximamente)' },
]

function esErrorConfiguracion(mensaje = '') {
  const lower = mensaje.toLowerCase()
  return (
    lower.includes('configuration') ||
    lower.includes('configur') ||
    lower.includes('offering') ||
    lower.includes('product') ||
    lower.includes('package')
  )
}

export default function Paywall({ className = '' }) {
  const { isPremium, loading: premiumLoading, buyPremium, restorePurchases } = usePremium()

  const [priceString, setPriceString] = useState(null)
  const [priceLoading, setPriceLoading] = useState(isNativePlatform)
  const [buying, setBuying] = useState(false)
  const [restoring, setRestoring] = useState(false)
  const [error, setError] = useState(null)
  const [restoreMessage, setRestoreMessage] = useState(null)

  const loadOffering = useCallback(async () => {
    if (!isNativePlatform || isPremium) {
      setPriceLoading(false)
      return
    }

    setPriceLoading(true)
    setError(null)

    try {
      const { priceString: precio } = await fetchPremiumPackage()
      setPriceString(precio)
      if (!precio) {
        setError(
          'El producto existe pero Google Play no devolvió el precio. Verifica que la suscripción esté activa en Play Console y que la app esté instalada desde una pista de prueba.'
        )
      }
    } catch (err) {
      console.error('[Paywall] Error cargando offering:', err)
      const mensaje = getRevenueCatErrorMessage(err)
      setPriceString(null)
      setError(mensaje)
    } finally {
      setPriceLoading(false)
    }
  }, [isPremium])

  useEffect(() => {
    loadOffering()
  }, [loadOffering])

  const handleSubscribe = async () => {
    setError(null)
    setRestoreMessage(null)
    setBuying(true)

    const result = await buyPremium()

    if (result.success) {
      setError(null)
    } else if (!result.cancelled) {
      setError(result.error || 'Error al procesar la suscripción.')
    }

    setBuying(false)
  }

  const handleRestore = async () => {
    setError(null)
    setRestoreMessage(null)
    setRestoring(true)

    const result = await restorePurchases()

    if (result.success) {
      if (result.isPremium) {
        setRestoreMessage('Compras restauradas correctamente.')
      } else {
        setRestoreMessage('No se encontraron compras previas en esta cuenta.')
      }
    } else {
      setError(result.error || 'Error al restaurar compras.')
    }

    setRestoring(false)
  }

  if (premiumLoading) {
    return (
      <div className={`flex items-center justify-center py-16 ${className}`}>
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🔮</div>
          <p className="text-purple-300">Consultando los astros...</p>
        </div>
      </div>
    )
  }

  if (isPremium) {
    return (
      <div className={`max-w-md mx-auto ${className}`}>
        <div className="bg-gradient-to-br from-green-900/50 to-emerald-800/30 border-2 border-green-500/60 rounded-2xl p-8 text-center shadow-[0_0_24px_rgba(34,197,94,0.15)]">
          <div className="text-5xl mb-4">✨</div>
          <h2 className="text-2xl font-bold text-green-200 mb-2">Ya eres Premium</h2>
          <p className="text-green-300/90 text-sm">
            Tu camino espiritual está desbloqueado. Disfruta de todo el contenido exclusivo.
          </p>
        </div>
      </div>
    )
  }

  const mostrarAyudaConfig = error && esErrorConfiguracion(error)

  return (
    <div className={`max-w-md mx-auto ${className}`}>
      <div className="relative overflow-hidden rounded-2xl border-2 border-yellow-500/40 bg-gradient-to-br from-mystic-dark via-purple-950/80 to-mystic-dark shadow-[0_0_40px_rgba(139,92,246,0.2)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.12)_0%,_transparent_60%)] pointer-events-none" />

        <div className="relative p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-900/60 border border-purple-500/50 mb-4 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              <span className="text-3xl">🌙</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-yellow-300 mb-2">
              Desbloquea Premium
            </h2>
            <p className="text-purple-200/90 text-sm leading-relaxed">
              Eleva tu camino espiritual: lecturas sin límites, profundidad extra y ventajas exclusivas
              para quienes quieren ir más allá.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-yellow-200/90 font-semibold text-sm mb-3 text-center">
              ⭐ Todo lo que incluye Premium
            </h3>
            <ul className="space-y-2.5">
              {BENEFICIOS.map((beneficio) => (
                <li
                  key={beneficio.texto}
                  className="flex items-start gap-2.5 rounded-xl border border-[#fbbf24]/15 bg-purple-950/40 px-3 py-2.5"
                >
                  <span className="text-lg leading-none shrink-0" aria-hidden>
                    {beneficio.emoji}
                  </span>
                  <span className="text-purple-100 text-sm leading-snug pt-0.5">
                    {beneficio.texto}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center mb-6 py-4 rounded-xl bg-purple-900/40 border border-purple-500/30">
            {priceLoading ? (
              <p className="text-purple-300 text-sm animate-pulse">Cargando precio...</p>
            ) : priceString ? (
              <>
                <p className="text-4xl font-bold text-yellow-300">{priceString}</p>
                <p className="text-purple-300 text-xs mt-1">Suscripción mensual · Cancela cuando quieras</p>
              </>
            ) : isNativePlatform ? (
              <p className="text-purple-300 text-sm">Precio no disponible en este momento</p>
            ) : (
              <p className="text-purple-300 text-sm">
                Las suscripciones están disponibles en la app móvil
              </p>
            )}
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-red-900/30 border border-red-500/40 px-4 py-3 text-red-200 text-sm">
              <p className="text-center">{error}</p>
              {mostrarAyudaConfig && (
                <ul className="mt-3 text-left text-xs space-y-1.5 text-red-100/90 list-disc pl-4">
                  <li>Offering marcado como <strong>Current</strong> en RevenueCat</li>
                  <li>Product ID igual en Play Console y RevenueCat</li>
                  <li>Entitlement llamado <strong>premium</strong></li>
                  <li>App instalada desde prueba interna/cerrada de Play (no APK suelto)</li>
                  <li>Cuenta añadida como tester de licencias en Play Console</li>
                </ul>
              )}
              {isNativePlatform && (
                <button
                  type="button"
                  onClick={loadOffering}
                  className="mt-3 w-full text-xs underline text-yellow-300 hover:text-yellow-200"
                >
                  Reintentar cargar precio
                </button>
              )}
            </div>
          )}

          {!isRevenueCatConfigured() && isNativePlatform && !priceLoading && (
            <div className="mb-4 rounded-xl bg-yellow-900/30 border border-yellow-500/40 px-4 py-3 text-yellow-100 text-xs text-center">
              RevenueCat no se inicializó. Reconstruye la app con <code className="text-yellow-300">VITE_REVENUECAT_ANDROID_KEY</code> en <code className="text-yellow-300">.env</code>, luego <code className="text-yellow-300">npm run build && npx cap sync android</code>.
            </div>
          )}

          {restoreMessage && (
            <div className="mb-4 rounded-xl bg-purple-900/50 border border-purple-400/40 px-4 py-3 text-purple-100 text-sm text-center">
              {restoreMessage}
            </div>
          )}

          <button
            type="button"
            onClick={handleSubscribe}
            disabled={buying || restoring || priceLoading}
            className="w-full bg-gradient-to-r from-yellow-500 to-mystic-gold hover:from-yellow-400 hover:to-yellow-500 text-purple-950 font-bold py-4 px-6 rounded-xl shadow-lg shadow-yellow-900/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mb-3"
          >
            {buying ? 'Procesando...' : 'Suscribirme'}
          </button>

          <button
            type="button"
            onClick={handleRestore}
            disabled={buying || restoring}
            className="w-full bg-transparent border border-purple-500/60 hover:border-purple-400 hover:bg-purple-900/30 text-purple-200 font-medium py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {restoring ? 'Restaurando...' : 'Restaurar compras'}
          </button>
        </div>
      </div>
    </div>
  )
}
