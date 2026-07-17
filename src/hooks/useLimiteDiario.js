import { useState, useEffect, useCallback } from 'react'
import { usePremium } from '../contexts/PremiumContext'
import {
  LIMITES_SERVICIO,
  getFechaLocalHoy,
  getUltimaLectura,
  guardarUltimaLectura,
  limiteAlcanzadoParaPeriodo,
} from '../lib/limiteDiario'

/**
 * @param {keyof typeof LIMITES_SERVICIO} servicio
 */
export function useLimiteDiario(servicio) {
  const { isPremium, loading: premiumLoading } = usePremium()
  const [limiteAlcanzado, setLimiteAlcanzado] = useState(false)
  const [listo, setListo] = useState(false)

  const config = LIMITES_SERVICIO[servicio]
  const clave = config?.clave
  const periodo = config?.periodo || 'diario'

  const refrescarEstado = useCallback(async () => {
    if (isPremium || !clave) {
      setLimiteAlcanzado(false)
      return
    }

    const ultima = await getUltimaLectura(clave)
    setLimiteAlcanzado(limiteAlcanzadoParaPeriodo(ultima, periodo))
  }, [isPremium, clave, periodo])

  useEffect(() => {
    if (premiumLoading) {
      setListo(false)
      return
    }

    let cancelled = false

    const cargar = async () => {
      await refrescarEstado()
      if (!cancelled) {
        setListo(true)
      }
    }

    cargar()

    return () => {
      cancelled = true
    }
  }, [premiumLoading, refrescarEstado])

  const intentarLectura = useCallback(async () => {
    if (isPremium) {
      return true
    }

    if (!clave) {
      console.warn(`[Limite] Servicio desconocido: ${servicio}`)
      return true
    }

    const ultima = await getUltimaLectura(clave)

    if (limiteAlcanzadoParaPeriodo(ultima, periodo)) {
      setLimiteAlcanzado(true)
      return false
    }

    await guardarUltimaLectura(clave, getFechaLocalHoy())
    setLimiteAlcanzado(true)
    return true
  }, [isPremium, clave, periodo, servicio])

  return {
    limiteAlcanzado: !isPremium && limiteAlcanzado,
    listo: !premiumLoading && listo,
    intentarLectura,
    refrescarEstado,
    esPremium: isPremium,
    periodo,
  }
}
