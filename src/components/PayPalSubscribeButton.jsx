import { useEffect, useRef, useState } from 'react'
import { httpsCallable } from 'firebase/functions'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, functions } from '../firebase'
import { usePremium } from '../contexts/PremiumContext'

const CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID
const PLAN_ID = import.meta.env.VITE_PAYPAL_PLAN_ID

/** Promise compartida para cargar el SDK una sola vez. */
let paypalSdkPromise = null

function loadPayPalSdk(clientId) {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('PayPal solo está disponible en el navegador.'))
  }

  if (window.paypal) {
    return Promise.resolve(window.paypal)
  }

  if (paypalSdkPromise) {
    return paypalSdkPromise
  }

  paypalSdkPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-paypal-sdk="true"]')
    if (existing) {
      existing.addEventListener('load', () => resolve(window.paypal))
      existing.addEventListener('error', () => {
        paypalSdkPromise = null
        reject(new Error('No se pudo cargar el SDK de PayPal.'))
      })
      return
    }

    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&vault=true&intent=subscription`
    script.async = true
    script.dataset.paypalSdk = 'true'
    script.onload = () => {
      if (window.paypal) {
        resolve(window.paypal)
      } else {
        paypalSdkPromise = null
        reject(new Error('PayPal SDK cargó pero window.paypal no está disponible.'))
      }
    }
    script.onerror = () => {
      paypalSdkPromise = null
      reject(new Error('No se pudo cargar el SDK de PayPal.'))
    }
    document.body.appendChild(script)
  })

  return paypalSdkPromise
}

/**
 * Botón de suscripción PayPal (solo web/PWA).
 * Requiere Firebase Auth. Tras aprobar, verifica con Cloud Function y actualiza premium.
 */
export default function PayPalSubscribeButton({ className = '' }) {
  const containerRef = useRef(null)
  const [user, authLoading] = useAuthState(auth)
  const { checkPremium } = usePremium()
  const checkPremiumRef = useRef(checkPremium)
  checkPremiumRef.current = checkPremium

  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState(null)
  const [failedSubscriptionId, setFailedSubscriptionId] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (authLoading || !user) {
      setLoading(false)
      return undefined
    }

    let cancelled = false
    let buttonsInstance = null

    const verifySubscription = async (subscriptionId) => {
      setVerifying(true)
      setError(null)
      setFailedSubscriptionId(null)
      setSuccess(false)

      try {
        const verify = httpsCallable(functions, 'verifyPayPalSubscription')
        const result = await verify({ subscriptionId })
        const data = result?.data

        if (data?.success === true) {
          setSuccess(true)
          await checkPremiumRef.current?.()
          return
        }

        setSuccess(false)
        setError(
          data?.reason ||
            'No pudimos activar Premium. Si ya pagaste, contacta soporte con tu comprobante.'
        )
      } catch (err) {
        console.error('[PayPal] Error verifyPayPalSubscription:', err)
        setSuccess(false)
        setFailedSubscriptionId(subscriptionId)
        setError(
          'Hubo un problema al verificar tu pago. Contacta soporte e indica el ID de suscripción de abajo.'
        )
      } finally {
        setVerifying(false)
      }
    }

    const mount = async () => {
      setLoading(true)
      setError(null)
      setFailedSubscriptionId(null)

      if (!CLIENT_ID || !PLAN_ID) {
        setError(
          'Falta configurar VITE_PAYPAL_CLIENT_ID o VITE_PAYPAL_PLAN_ID en el entorno.'
        )
        setLoading(false)
        return
      }

      try {
        const paypal = await loadPayPalSdk(CLIENT_ID)
        if (cancelled || !containerRef.current) return

        containerRef.current.innerHTML = ''

        buttonsInstance = paypal.Buttons({
          style: {
            shape: 'rect',
            color: 'gold',
            layout: 'vertical',
            label: 'subscribe',
          },
          createSubscription(_data, actions) {
            return actions.subscription.create({
              plan_id: PLAN_ID,
              custom_id: user.uid,
            })
          },
          onApprove(data) {
            const subscriptionId = data?.subscriptionID
            console.log('[PayPal] subscriptionID:', subscriptionId)
            if (!subscriptionId) {
              setError(
                'PayPal no devolvió un ID de suscripción. Contacta soporte si el cobro se realizó.'
              )
              return
            }
            return verifySubscription(subscriptionId)
          },
          onError(err) {
            console.error('[PayPal] Error en suscripción:', err)
            setSuccess(false)
            setError(
              'No pudimos completar la suscripción con PayPal. Intenta de nuevo en unos momentos.'
            )
          },
          onCancel() {
            console.log('[PayPal] Suscripción cancelada por el usuario')
          },
        })

        await buttonsInstance.render(containerRef.current)
        if (!cancelled) setLoading(false)
      } catch (err) {
        console.error('[PayPal] Error cargando SDK:', err)
        if (!cancelled) {
          setError(
            err?.message ||
              'No se pudo cargar PayPal. Revisa tu conexión e intenta de nuevo.'
          )
          setLoading(false)
        }
      }
    }

    mount()

    return () => {
      cancelled = true
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
      buttonsInstance = null
    }
  }, [authLoading, user])

  if (authLoading) {
    return (
      <div className={`w-full text-center ${className}`}>
        <p className="text-purple-300 text-sm animate-pulse">Cargando...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className={`w-full text-center ${className}`}>
        <p className="text-purple-100 text-sm font-medium mb-1">
          Inicia sesión para suscribirte
        </p>
        <p className="text-purple-300 text-xs leading-relaxed">
          Necesitas una cuenta en Guía Espiritual antes de activar Premium con
          PayPal.
        </p>
      </div>
    )
  }

  return (
    <div className={`w-full text-left ${className}`}>
      <p className="text-purple-200 text-sm text-center mb-3">
        Suscripción Premium con PayPal
      </p>

      {loading && (
        <p className="text-purple-300 text-sm text-center animate-pulse mb-3">
          Cargando PayPal...
        </p>
      )}

      {verifying && (
        <div className="mb-3 rounded-xl border border-[#fbbf24]/40 bg-purple-950/50 px-3 py-3 text-center">
          <p className="text-[#fbbf24] text-sm font-semibold animate-pulse">
            Verificando tu pago...
          </p>
        </div>
      )}

      {success && !verifying && (
        <div className="mb-3 rounded-xl border border-green-500/50 bg-green-900/30 px-3 py-3 text-center">
          <p className="text-green-200 text-sm font-semibold">
            ¡Ya eres Premium! ✨
          </p>
        </div>
      )}

      {error && !verifying && (
        <div className="mb-3 rounded-xl border border-red-500/40 bg-red-900/30 px-3 py-2 text-center">
          <p className="text-red-200 text-xs leading-relaxed">{error}</p>
          {failedSubscriptionId && (
            <p className="text-red-100 text-[11px] mt-2 font-mono break-all select-all">
              ID de suscripción: {failedSubscriptionId}
            </p>
          )}
          <p className="text-red-200/80 text-[10px] mt-1.5 leading-relaxed">
            Si el cobro ya se hizo, escríbenos a soporte con tu correo y ese ID.
          </p>
        </div>
      )}

      {!success && <div ref={containerRef} className="min-h-[45px]" />}
    </div>
  )
}
