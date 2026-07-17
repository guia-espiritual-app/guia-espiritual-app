import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { Capacitor } from '@capacitor/core'
import { Purchases } from '@revenuecat/purchases-capacitor'
import { whenRevenueCatReady, fetchPremiumPackage, getRevenueCatErrorMessage } from '../lib/revenuecat'

// Firestore (users/{uid}.isPremium) ya no es la fuente de verdad para acceso premium.
// Si se necesita validación server-side, reincorporar Firestore como espejo vía
// webhooks de RevenueCat (TRANSFER, RENEWAL, CANCELLATION, etc.).

const PREMIUM_ENTITLEMENT = 'premium'
const isNativePlatform = Capacitor.getPlatform() !== 'web'

const PremiumContext = createContext()

function isPremiumFromCustomerInfo(customerInfo) {
  return Boolean(customerInfo?.entitlements?.active?.[PREMIUM_ENTITLEMENT])
}

export function usePremium() {
  return useContext(PremiumContext)
}

export function PremiumProvider({ children }) {
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)
  const listenerIdRef = useRef(null)

  const applyCustomerInfo = useCallback((customerInfo) => {
    setIsPremium(isPremiumFromCustomerInfo(customerInfo))
  }, [])

  const checkPremium = useCallback(async () => {
    if (!isNativePlatform) {
      setIsPremium(false)
      return { success: true, isPremium: false }
    }

    try {
      const { customerInfo } = await Purchases.getCustomerInfo()
      applyCustomerInfo(customerInfo)
      return { success: true, isPremium: isPremiumFromCustomerInfo(customerInfo) }
    } catch (error) {
      console.error('[Premium] Error consultando customerInfo:', error)
      setIsPremium(false)
      return { success: false, isPremium: false, error: error.message }
    }
  }, [applyCustomerInfo])

  const buyPremium = useCallback(async () => {
    if (!isNativePlatform) {
      return { success: false, error: 'Las compras premium no están disponibles en web.' }
    }

    try {
      const { pkg } = await fetchPremiumPackage()

      const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg })
      applyCustomerInfo(customerInfo)

      const premiumActive = isPremiumFromCustomerInfo(customerInfo)
      return { success: premiumActive, isPremium: premiumActive }
    } catch (error) {
      if (error?.userCancelled) {
        return { success: false, cancelled: true, error: 'Compra cancelada.' }
      }

      console.error('[Premium] Error en compra:', error)
      return { success: false, error: getRevenueCatErrorMessage(error) || 'Error al procesar la compra.' }
    }
  }, [applyCustomerInfo])

  const restorePurchases = useCallback(async () => {
    if (!isNativePlatform) {
      return { success: false, error: 'Restaurar compras no está disponible en web.' }
    }

    try {
      const { customerInfo } = await Purchases.restorePurchases()
      applyCustomerInfo(customerInfo)

      return {
        success: true,
        isPremium: isPremiumFromCustomerInfo(customerInfo),
      }
    } catch (error) {
      console.error('[Premium] Error restaurando compras:', error)
      return { success: false, error: error.message || 'Error al restaurar compras.' }
    }
  }, [applyCustomerInfo])

  // Alias para componentes existentes (p. ej. planes.jsx)
  const activatePremium = buyPremium

  useEffect(() => {
    let cancelled = false

    const setup = async () => {
      if (!isNativePlatform) {
        setIsPremium(false)
        setLoading(false)
        return
      }

      setLoading(true)

      try {
        await whenRevenueCatReady()

        const listenerId = await Purchases.addCustomerInfoUpdateListener((customerInfo) => {
          if (!cancelled) {
            applyCustomerInfo(customerInfo)
          }
        })
        listenerIdRef.current = listenerId

        const { customerInfo } = await Purchases.getCustomerInfo()
        if (!cancelled) {
          applyCustomerInfo(customerInfo)
        }
      } catch (error) {
        console.error('[Premium] Error inicializando premium:', error)
        if (!cancelled) {
          setIsPremium(false)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    setup()

    return () => {
      cancelled = true

      if (listenerIdRef.current) {
        Purchases.removeCustomerInfoUpdateListener({
          listenerToRemove: listenerIdRef.current,
        }).catch(() => {})
        listenerIdRef.current = null
      }
    }
  }, [applyCustomerInfo])

  const value = {
    isPremium,
    loading,
    checkPremium,
    buyPremium,
    restorePurchases,
    activatePremium,
  }

  return (
    <PremiumContext.Provider value={value}>
      {children}
    </PremiumContext.Provider>
  )
}
