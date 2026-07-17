import { Capacitor } from '@capacitor/core'
import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'

let authUnsubscribe = null
let configured = false
let initPromise = null
let initError = null

function getApiKeyForPlatform() {
  const platform = Capacitor.getPlatform()

  if (platform === 'ios') {
    return import.meta.env.VITE_REVENUECAT_IOS_KEY
  }

  if (platform === 'android') {
    return import.meta.env.VITE_REVENUECAT_ANDROID_KEY
  }

  return null
}

export function isRevenueCatConfigured() {
  return configured
}

export function getRevenueCatInitError() {
  return initError
}

export function whenRevenueCatReady() {
  if (Capacitor.getPlatform() === 'web') {
    return Promise.resolve()
  }

  if (initPromise) {
    return initPromise
  }

  return initRevenueCat()
}

export function getRevenueCatErrorMessage(error) {
  if (!error) return 'Error desconocido'

  const parts = [
    error.underlyingErrorMessage,
    error.errorMessage,
    error.message,
    typeof error === 'string' ? error : null,
  ].filter(Boolean)

  return parts[0] || 'Error desconocido'
}

export function getPackagePriceString(pkg) {
  if (!pkg) return null
  return pkg.product?.priceString ?? pkg.storeProduct?.priceString ?? null
}

export async function fetchPremiumPackage() {
  await whenRevenueCatReady()

  if (!configured) {
    const detail = initError || 'VITE_REVENUECAT_ANDROID_KEY ausente o inválida en el build.'
    throw new Error(
      `RevenueCat no está configurado. ${detail} Ejecuta "npm run build" con .env y luego "npx cap sync android".`
    )
  }

  const { offerings } = await Purchases.getOfferings()

  if (!offerings?.current) {
    throw new Error(
      'No hay un Offering marcado como "Current" en RevenueCat. Ve a Offerings → marca uno como current y añade un package con tu producto de Google Play.'
    )
  }

  const packages = offerings.current.availablePackages ?? []

  if (packages.length === 0) {
    throw new Error(
      'El Offering actual no tiene packages disponibles. Revisa en RevenueCat que el producto esté vinculado al entitlement "premium" y que Google Play Console tenga la suscripción activa.'
    )
  }

  const pkg = packages[0]
  const priceString = getPackagePriceString(pkg)

  if (!priceString) {
    console.warn('[RevenueCat] Package sin priceString:', pkg)
  }

  return { pkg, priceString, offering: offerings.current }
}

export async function initRevenueCat() {
  if (Capacitor.getPlatform() === 'web') {
    return
  }

  if (configured) {
    return
  }

  if (initPromise) {
    return initPromise
  }

  initPromise = (async () => {
    initError = null

    const apiKey = getApiKeyForPlatform()
    if (!apiKey) {
      const platform = Capacitor.getPlatform()
      initError = `Falta la API key de RevenueCat para ${platform}.`
      console.warn(`[RevenueCat] ${initError}`)
      return
    }

    try {
      if (import.meta.env.DEV) {
        await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG })
      }

      await Purchases.configure({ apiKey })
      configured = true

      if (authUnsubscribe) {
        authUnsubscribe()
      }

      authUnsubscribe = onAuthStateChanged(auth, async (user) => {
        try {
          if (user) {
            await Purchases.logIn({ appUserID: user.uid })
          } else {
            await Purchases.logOut()
          }
        } catch (error) {
          console.error('[RevenueCat] Error sincronizando sesión de usuario:', error)
        }
      })
    } catch (error) {
      configured = false
      initError = getRevenueCatErrorMessage(error)
      console.error('[RevenueCat] Error en configure:', error)
      throw error
    }
  })()

  try {
    await initPromise
  } catch {
    initPromise = null
  }
}
