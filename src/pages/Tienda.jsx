import { useState } from 'react'
import productosData from '../data/productos.json'
import BurbujaGU from '../components/BurbujaGU'
import guImg from '../assets/avatares/gu.png'

const imgs = import.meta.glob('../assets/productos/*.{jpg,png}', { eager: true, import: 'default' })

const categorias = [...productosData.categorias].sort((a, b) => a.orden - b.orden)
const WHATSAPP_NUMBER = '573004982667'

function obtenerImagenProducto(imagen) {
  if (!imagen) return null
  return Object.entries(imgs).find(([ruta]) => ruta.endsWith(`/${imagen}`))?.[1] ?? null
}

function formatearPrecioCop(valor) {
  return `$${valor.toLocaleString('es-CO')} COP`
}

function formatearPrecioUsd(valor) {
  return `$${valor} USD`
}

function formatearPrecios(producto) {
  return `${formatearPrecioCop(producto.precio_cop)} · ${formatearPrecioUsd(producto.precio_usd)}`
}

function getProductosPorCategoria(nombreCategoria) {
  if (nombreCategoria === 'Ebooks') {
    return productosData.ebooks
  }
  return productosData.productos_fisicos.filter((p) => p.categoria === nombreCategoria)
}

function abrirWhatsApp(nombre) {
  const text = encodeURIComponent(`Vi ${nombre} en la app Guía Espiritual`)
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank')
}

function ProductoImagen({ imagen, nombre, className = '' }) {
  const [error, setError] = useState(false)
  const src = obtenerImagenProducto(imagen)

  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-purple-950/50 border border-purple-600/40 rounded-lg ${className}`}>
        <span className="text-3xl text-purple-400/60" aria-hidden="true">✨</span>
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

export default function Tienda() {
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)

  if (productoSeleccionado) {
    const producto = productoSeleccionado
    const categoria = categorias.find((c) => c.nombre === producto.categoria)
    const esFisico = producto.tipo === 'fisico'

    return (
      <div className="max-w-md mx-auto px-4 pt-10 pb-24">
        <button
          type="button"
          onClick={() => setProductoSeleccionado(null)}
          className="text-purple-300 hover:text-yellow-300 text-sm mb-4 transition-colors"
        >
          ← Volver al catálogo
        </button>

        <ProductoImagen
          imagen={producto.imagen}
          nombre={producto.nombre}
          className="w-full max-h-72 object-contain mb-5"
        />

        {categoria && (
          <p className="text-purple-300 text-sm mb-1">
            {categoria.emoji} {producto.categoria}
          </p>
        )}

        <h1 className="text-2xl font-bold text-yellow-300 mb-4">{producto.nombre}</h1>

        <div className="space-y-4">
          {esFisico ? (
            <>
              <div className="bg-purple-900/40 border border-purple-500/50 rounded-xl p-4">
                <h3 className="text-[#fbbf24] font-semibold text-sm mb-2">Propósito</h3>
                <p className="text-gray-100 text-sm leading-relaxed">{producto.proposito}</p>
              </div>
              {producto.signos?.length > 0 && (
                <p className="text-purple-200 text-sm">
                  <span className="text-[#fbbf24] font-semibold">Signos:</span>{' '}
                  {producto.signos.join(', ')}
                </p>
              )}
            </>
          ) : (
            <>
              {producto.subtitulo && (
                <p className="text-purple-200 italic text-sm leading-relaxed">{producto.subtitulo}</p>
              )}
              <div className="bg-purple-900/40 border border-purple-500/50 rounded-xl p-4">
                <h3 className="text-[#fbbf24] font-semibold text-sm mb-2">Descripción</h3>
                <p className="text-gray-100 text-sm leading-relaxed">{producto.descripcion}</p>
              </div>
            </>
          )}

          <div className="bg-gradient-to-br from-yellow-900/30 to-purple-900/40 border-2 border-yellow-500/50 rounded-xl p-4 text-center">
            <p className="text-[#fbbf24] font-bold text-lg">{formatearPrecioCop(producto.precio_cop)}</p>
            <p className="text-purple-200 text-sm">{formatearPrecioUsd(producto.precio_usd)}</p>
          </div>

          {esFisico && productosData.info_envio.envio_incluido && (
            <p className="text-purple-300 text-xs text-center leading-relaxed">
              Envío incluido · Entrega: 5 a 30 días
            </p>
          )}

          <button
            type="button"
            onClick={() => abrirWhatsApp(producto.nombre)}
            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <span aria-hidden="true">💬</span>
            Consultar por WhatsApp
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-10 pb-24">
      <BurbujaGU
        seccion="academia"
        avatarSrc={guImg}
        avatarAlt="Academia del Maestro GU"
        className="mb-6"
      />
      <h1 className="text-3xl font-bold text-yellow-300 mb-2 text-center">Academia del Maestro GU y Tienda</h1>
      <p className="text-purple-200 text-center mb-8 text-sm">
        Cristales, amuletos y guías para tu camino espiritual
      </p>

      <div className="space-y-8">
        {categorias.map((categoria) => {
          const productos = getProductosPorCategoria(categoria.nombre)
          if (!productos.length) return null

          return (
            <section key={categoria.nombre}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{categoria.emoji}</span>
                <h2 className="text-yellow-300 font-bold text-lg">{categoria.nombre}</h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {productos.map((producto) => (
                  <button
                    key={producto.id}
                    type="button"
                    onClick={() => setProductoSeleccionado(producto)}
                    className="text-left bg-purple-900/40 border-2 border-purple-500/60 rounded-xl p-3 hover:border-purple-400/80 hover:shadow-[0_0_16px_rgba(139,92,246,0.35)] transition-all duration-200"
                  >
                    <ProductoImagen
                      imagen={producto.imagen}
                      nombre={producto.nombre}
                      className="w-full aspect-square object-cover mb-2"
                    />
                    <h3 className="text-yellow-300 font-semibold text-sm leading-snug mb-1 line-clamp-2">
                      {producto.nombre}
                    </h3>
                    <p className="text-purple-300 text-[10px] leading-tight">
                      {formatearPrecios(producto)}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      <p className="mt-10 mb-4 text-center text-[11px] leading-relaxed text-purple-400/70 px-2">
        {productosData.disclaimer}
      </p>
    </div>
  )
}
