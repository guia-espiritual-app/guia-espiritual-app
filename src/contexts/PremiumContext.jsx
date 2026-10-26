import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { Capacitor } from '@capacitor/core'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { Purchases } from '@revenuecat/purchases-capacitor'
import { whenRevenueCatReady, fetchPremiumPackage, getRevenueCatErrorMessage } from '../lib/revenuecat'
import { auth, db } from '../firebase'

// Premium unificado:
// isPremium = premiumDeRevenueCat (Android/iOS) || premiumDeFirestore (PayPal / Cloud Function)

const PREMIUM_ENTITLEMENT = 'premium'
const isNativePlatform = Capacitor.getPlatform() !== 'web'

const PremiumContext = createContext()

function isPremiumFromCustomerInfo(customerInfo) {
  return Boolean(customerInfo?.entitlements?.active?.[PREMIUM_ENTITLEMENT])
}

/** PayPal puede dejar isPremium en true hasta premiumExpiresAt (cancelación con periodo pagado). */
function isFirestorePremiumActive(data) {
  if (data?.isPremium !== true) return false

  const expiresAt = data.premiumExpiresAt
  if (expiresAt == null) return true

  const expiresMs = typeof expiresAt.toMillis === 'function'
    ? expiresAt.toMillis()
    : new Date(expiresAt).getTime()

  return Number.isFinite(expiresMs) && expiresMs > Date.now()
}

export function usePremium() {
  return useContext(PremiumContext)
}

export function PremiumProvider({ children }) {
  const [premiumFromRC, setPremiumFromRC] = useState(false)
  const [premiumFromFirestore, setPremiumFromFirestore] = useState(false)
  /** En web, RevenueCat no aplica: esa fuente ya está “lista” como false. */
  const [rcLoaded, setRcLoaded] = useState(!isNativePlatform)
  const [fsLoaded, setFsLoaded] = useState(false)

  const listenerIdRef = useRef(null)
  const firestoreUnsubRef = useRef(null)

  const isPremium = premiumFromRC || premiumFromFirestore
  const loading = !(rcLoaded && fsLoaded)

  const checkPremium = useCallback(async () => {
    let rc = false
    let fs = false
    let success = true
    let errorMessage

    // —— Firestore ——
    try {
      const user = auth.currentUser
      if (user) {
        const snap = await getDoc(doc(db, 'users', user.uid))
        fs = isFirestorePremiumActive(snap.data())
      }
      setPremiumFromFirestore(fs)
    } catch (error) {
      console.error('[Premium] Error leyendo isPremium en Firestore:', error)
      success = false
      errorMessage = error.message
      setPremiumFromFirestore(false)
      fs = false
    }

    // —— RevenueCat (solo nativo; en web es false) ——
    if (isNativePlatform) {
      try {
        const { customerInfo } = await Purchases.getCustomerInfo()
        rc = isPremiumFromCustomerInfo(customerInfo)
        setPremiumFromRC(rc)
      } catch (error) {
        console.error('[Premium] Error consultando customerInfo:', error)
        success = false
        errorMessage = error.message || errorMessage
        setPremiumFromRC(false)
        rc = false
      }
    } else {
      rc = false
      setPremiumFromRC(false)
    }

    return {
      success,
      isPremium: rc || fs,
      ...(errorMessage ? { error: errorMessage } : {}),
    }
  }, [])

  const buyPremium = useCallback(async () => {
    if (!isNativePlatform) {
      return { success: false, error: 'Las compras premium no están disponibles en web.' }
    }

    try {
      const { pkg } = await fetchPremiumPackage()

      const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg })
      const premiumActive = isPremiumFromCustomerInfo(customerInfo)
      setPremiumFromRC(premiumActive)

      return { success: premiumActive, isPremium: premiumActive || premiumFromFirestore }
    } catch (error) {
      if (error?.userCancelled) {
        return { success: false, cancelled: true, error: 'Compra cancelada.' }
      }

      console.error('[Premium] Error en compra:', error)
      return { success: false, error: getRevenueCatErrorMessage(error) || 'Error al procesar la compra.' }
    }
  }, [premiumFromFirestore])

  const restorePurchases = useCallback(async () => {
    if (!isNativePlatform) {
      return { success: false, error: 'Restaurar compras no está disponible en web.' }
    }

    try {
      const { customerInfo } = await Purchases.restorePurchases()
      const premiumActive = isPremiumFromCustomerInfo(customerInfo)
      setPremiumFromRC(premiumActive)

      return {
        success: true,
        isPremium: premiumActive || premiumFromFirestore,
      }
    } catch (error) {
      console.error('[Premium] Error restaurando compras:', error)
      return { success: false, error: error.message || 'Error al restaurar compras.' }
    }
  }, [premiumFromFirestore])

  const activatePremium = buyPremium

  // —— Fuente Firestore (ambas plataformas): onSnapshot users/{uid} ——
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (firestoreUnsubRef.current) {
        firestoreUnsubRef.current()
        firestoreUnsubRef.current = null
      }

      if (!user) {
        setPremiumFromFirestore(false)
        setFsLoaded(true)
        return
      }

      setFsLoaded(false)

      firestoreUnsubRef.current = onSnapshot(
        doc(db, 'users', user.uid),
        (snap) => {
          setPremiumFromFirestore(isFirestorePremiumActive(snap.data()))
          setFsLoaded(true)
        },
        (error) => {
          console.error('[Premium] Snapshot Firestore error:', error)
          setPremiumFromFirestore(false)
          setFsLoaded(true)
        }
      )
    })

    return () => {
      unsubAuth()
      if (firestoreUnsubRef.current) {
        firestoreUnsubRef.current()
        firestoreUnsubRef.current = null
      }
    }
  }, [])

  // —— Fuente RevenueCat (solo nativo; en web queda false) ——
  useEffect(() => {
    if (!isNativePlatform) {
      setPremiumFromRC(false)
      setRcLoaded(true)
      return undefined
    }

    let cancelled = false
    setRcLoaded(false)

    const setup = async () => {
      try {
        await whenRevenueCatReady()

        const listenerId = await Purchases.addCustomerInfoUpdateListener((customerInfo) => {
          if (!cancelled) {
            setPremiumFromRC(isPremiumFromCustomerInfo(customerInfo))
          }
        })
        listenerIdRef.current = listenerId

        const { customerInfo } = await Purchases.getCustomerInfo()
        if (!cancelled) {
          setPremiumFromRC(isPremiumFromCustomerInfo(customerInfo))
        }
      } catch (error) {
        console.error('[Premium] Error inicializando RevenueCat:', error)
        if (!cancelled) {
          setPremiumFromRC(false)
        }
      } finally {
        if (!cancelled) {
          setRcLoaded(true)
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
  }, [])

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
