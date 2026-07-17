import { useState } from 'react'
import productosData from '../data/productos.json'
import BurbujaGU from '../components/BurbujaGU'
import BotonAtras from '../components/BotonAtras'
import iconTienda from '../assets/avatares/tienda.png'
import {
  ProductoImagen,
  BotonWhatsAppProducto,
  formatearPrecios,
  formatearPrecioCop,
  formatearPrecioUsd,
} from '../components/CatalogoProducto'

const categoriasFisicas = [...productosData.categorias]
  .filter((c) => c.nombre !== 'Ebooks')
  .sort((a, b) => a.orden - b.orden)

function getProductosPorCategoria(nombreCategoria) {
  return productosData.productos_fisicos.filter((p) => p.categoria === nombreCategoria)
}

export default function Tienda() {
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)

  if (productoSeleccionado) {
    const producto = productoSeleccionado
    const categoria = categoriasFisicas.find((c) => c.nombre === producto.categoria)

    return (
      <div className="max-w-md mx-auto px-4 pt-10 pb-24">
        <BotonAtras />
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

          <div className="bg-gradient-to-br from-yellow-900/30 to-purple-900/40 border-2 border-yellow-500/50 rounded-xl p-4 text-center">
            <p className="text-[#fbbf24] font-bold text-lg">{formatearPrecioCop(producto.precio_cop)}</p>
            <p className="text-purple-200 text-sm">{formatearPrecioUsd(producto.precio_usd)}</p>
            <p className="text-purple-400/80 text-[11px] mt-2 leading-relaxed">
              Precios sujetos a verificación y disponibilidad.
            </p>
          </div>

          <p className="text-purple-300/90 text-xs text-center leading-relaxed px-1">
            Cada elemento incluye activación energética personalizada según tu signo y propósito.
          </p>

          {productosData.info_envio.envio_incluido && (
            <p className="text-purple-300 text-xs text-center leading-relaxed">
              Envío incluido · Entrega: 5 a 30 días
            </p>
          )}

          <BotonWhatsAppProducto nombre={producto.nombre} />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-10 pb-24">
      <BotonAtras />
      <BurbujaGU
        seccion="tienda"
        avatarSrc={iconTienda}
        avatarAlt="Tienda"
        className="mb-6"
      />
      <div className="flex flex-col items-center mb-2">
        <img
          src={iconTienda}
          alt=""
          className="h-20 w-20 object-contain mb-3 drop-shadow-[0_0_14px_rgba(251,191,36,0.25)]"
        />
        <h1 className="text-3xl font-bold text-yellow-300 text-center">Tienda</h1>
      </div>
      <p className="text-purple-200 text-center mb-4 text-sm">
        Cristales, amuletos y joyas de poder
      </p>

      <p className="text-purple-400/80 text-[11px] text-center mb-6 leading-relaxed">
        Precios sujetos a verificación y disponibilidad.
      </p>

      <div className="space-y-8">
        {categoriasFisicas.map((categoria) => {
          const productos = getProductosPorCategoria(categoria.nombre)
          if (!productos.length) return null

          return (
            <section key={categoria.nombre}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{categoria.emoji}</span>
                <h2 className="text-yellow-300 font-bold text-lg">{categoria.nombre}</h2>
              </div>

              <p className="text-purple-400/80 text-[11px] leading-relaxed mb-3">
                Cada elemento incluye activación energética personalizada según tu signo y propósito.
              </p>

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
