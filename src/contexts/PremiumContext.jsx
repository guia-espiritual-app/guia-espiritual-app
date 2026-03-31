import { createContext, useContext, useState, useEffect } from 'react'
import { auth, db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'

const PremiumContext = createContext()

export function usePremium() {
  return useContext(PremiumContext)
}

export function PremiumProvider({ children }) {
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkPremiumStatus = async () => {
      const user = auth.currentUser
      
      if (!user) {
        setIsPremium(false)
        setLoading(false)
        return
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        
        if (userDoc.exists()) {
          const userData = userDoc.data()
          setIsPremium(userData.isPremium || false)
        } else {
          setIsPremium(false)
        }
      } catch (error) {
        console.error('Error checking premium status:', error)
        setIsPremium(false)
      }
      
      setLoading(false)
    }

    checkPremiumStatus()

    // Re-check cuando cambie el usuario
    const unsubscribe = auth.onAuthStateChanged(() => {
      checkPremiumStatus()
    })

    return unsubscribe
  }, [])

  const activatePremium = async () => {
    const user = auth.currentUser
    if (!user) return

    try {
      // Por ahora solo actualiza el estado local
      // Más adelante integraremos Stripe y actualizaremos Firestore
      setIsPremium(true)
      
      // TODO: Actualizar en Firestore cuando integremos pagos reales
      // await setDoc(doc(db, 'users', user.uid), { isPremium: true }, { merge: true })
      
      return { success: true }
    } catch (error) {
      console.error('Error activating premium:', error)
      return { success: false, error: error.message }
    }
  }

  const value = {
    isPremium,
    loading,
    activatePremium
  }

  return (
    <PremiumContext.Provider value={value}>
      {children}
    </PremiumContext.Provider>
  )
}