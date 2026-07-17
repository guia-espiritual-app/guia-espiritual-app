import { useState } from 'react'
import productosData from '../data/productos.json'
import BurbujaGU from '../components/BurbujaGU'
import BotonAtras from '../components/BotonAtras'
import {
  ProductoImagen,
  BotonWhatsAppProducto,
  formatearPrecios,
  formatearPrecioCop,
  formatearPrecioUsd,
} from '../components/CatalogoProducto'
import iconAcademia from '../assets/avatares/academia.png'

const ebooks = productosData.ebooks || []

export default function Academia() {
  const [ebookSeleccionado, setEbookSeleccionado] = useState(null)

  if (ebookSeleccionado) {
    const ebook = ebookSeleccionado

    return (
      <div className="max-w-md mx-auto px-4 pt-10 pb-24">
        <BotonAtras />
        <button
          type="button"
          onClick={() => setEbookSeleccionado(null)}
          className="text-purple-300 hover:text-yellow-300 text-sm mb-4 transition-colors"
        >
          ← Volver a la Academia
        </button>

        <ProductoImagen
          imagen={ebook.imagen}
          nombre={ebook.nombre}
          className="w-full max-h-72 object-contain mb-5"
        />

        <p className="text-purple-300 text-sm mb-1">📚 Ebook</p>
        <h1 className="text-2xl font-bold text-yellow-300 mb-4">{ebook.nombre}</h1>

        <div className="space-y-4">
          {ebook.subtitulo && (
            <p className="text-purple-200 italic text-sm leading-relaxed">{ebook.subtitulo}</p>
          )}
          <div className="bg-purple-900/40 border border-purple-500/50 rounded-xl p-4">
            <h3 className="text-[#fbbf24] font-semibold text-sm mb-2">Descripción</h3>
            <p className="text-gray-100 text-sm leading-relaxed">{ebook.descripcion}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-900/30 to-purple-900/40 border-2 border-yellow-500/50 rounded-xl p-4 text-center">
            <p className="text-[#fbbf24] font-bold text-lg">{formatearPrecioCop(ebook.precio_cop)}</p>
            <p className="text-purple-200 text-sm">{formatearPrecioUsd(ebook.precio_usd)}</p>
            <p className="text-purple-400/80 text-[11px] mt-2 leading-relaxed">
              Precios sujetos a verificación y disponibilidad.
            </p>
          </div>

          <BotonWhatsAppProducto nombre={ebook.nombre} />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-10 pb-24">
      <BotonAtras />
      <BurbujaGU
        seccion="academia"
        avatarSrc={iconAcademia}
        avatarAlt="Academia del Maestro GU"
        className="mb-6"
      />

      <div className="flex flex-col items-center mb-4">
        <img
          src={iconAcademia}
          alt=""
          className="h-20 w-20 object-contain mb-3 drop-shadow-[0_0_14px_rgba(251,191,36,0.25)]"
        />
        <h1 className="text-3xl font-bold text-yellow-300 mb-2 text-center">
          Academia del Maestro GU
        </h1>
        <p className="text-purple-200 text-center text-sm">
          Ebooks y guías espirituales para tu aprendizaje
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-[#fbbf24]/35 bg-[#2d1b4e]/60 px-4 py-3 text-center">
        <p className="text-purple-100 text-xs leading-relaxed">
          Al completar tus estudios en la Academia del Maestro GU, recibirás un diploma
          que certifica tu camino de aprendizaje espiritual. 🎓
        </p>
      </div>

      <p className="text-purple-400/80 text-[11px] text-center mb-6 leading-relaxed">
        Precios sujetos a verificación y disponibilidad.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {ebooks.map((ebook) => (
          <button
            key={ebook.id}
            type="button"
            onClick={() => setEbookSeleccionado(ebook)}
            className="text-left bg-purple-900/40 border-2 border-purple-500/60 rounded-xl p-3 hover:border-purple-400/80 hover:shadow-[0_0_16px_rgba(139,92,246,0.35)] transition-all duration-200"
          >
            <ProductoImagen
              imagen={ebook.imagen}
              nombre={ebook.nombre}
              className="w-full aspect-square object-cover mb-2"
            />
            <h3 className="text-yellow-300 font-semibold text-sm leading-snug mb-1 line-clamp-2">
              {ebook.nombre}
            </h3>
            {ebook.subtitulo && (
              <p className="text-purple-300/90 text-[10px] leading-tight mb-1.5 line-clamp-2">
                {ebook.subtitulo}
              </p>
            )}
            <p className="text-purple-300 text-[10px] leading-tight">
              {formatearPrecios(ebook)}
            </p>
          </button>
        ))}
      </div>

      <p className="mt-10 mb-4 text-center text-[11px] leading-relaxed text-purple-400/70 px-2">
        {productosData.disclaimer}
      </p>
    </div>
  )
}
