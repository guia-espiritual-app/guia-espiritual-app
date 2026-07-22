import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Resetea el scroll al cambiar de ruta.
 * El Layout no usa un contenedor overflow propio: el scroll vive en window/document.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pathname])

  return null
}
