import { useState } from 'react'

const imgs = import.meta.glob('../assets/productos/*.{jpg,png}', { eager: true, import: 'default' })

export const WHATSAPP_NUMBER = '573004982667'

export function obtenerImagenProducto(imagen) {
  if (!imagen) return null
  return Object.entries(imgs).find(([ruta]) => ruta.endsWith(`/${imagen}`))?.[1] ?? null
}

export function formatearPrecioCop(valor) {
  return `$${valor.toLocaleString('es-CO')} COP`
}

export function formatearPrecioUsd(valor) {
  return `$${valor} USD`
}

export function formatearPrecios(producto) {
  return `${formatearPrecioCop(producto.precio_cop)} · ${formatearPrecioUsd(producto.precio_usd)}`
}

export function abrirWhatsAppProducto(nombre) {
  const text = encodeURIComponent(`Vi ${nombre} en la app Guía Espiritual`)
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank')
}

export function ProductoImagen({ imagen, nombre, className = '' }) {
  const [error, setError] = useState(false)
  const src = obtenerImagenProducto(imagen)

  if (!src || error) {
    return (
      <div
        className={`flex items-center justify-center bg-purple-950/50 border border-purple-600/40 rounded-lg ${className}`}
      >
        <span className="text-3xl text-purple-400/60" aria-hidden="true">
          ✨
        </span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={nombre}
      onError={() => setError(true)}
      className={`rounded-lg border border-[#fbbf24]/30 ${className}`}
    />
  )
}

export function BotonWhatsAppProducto({ nombre }) {
  return (
    <button
      type="button"
      onClick={() => abrirWhatsAppProducto(nombre)}
      className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
    >
      <span aria-hidden="true">💬</span>
      Consultar por WhatsApp
    </button>
  )
}
