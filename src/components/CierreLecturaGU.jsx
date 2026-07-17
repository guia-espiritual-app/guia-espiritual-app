import { useState } from 'react'
import ConsultaPersonalizadaModal from './ConsultaPersonalizadaModal'

export default function CierreLecturaGU({ className = '', children = null }) {
  const [modalAbierto, setModalAbierto] = useState(false)

  return (
    <div
      className={`mt-6 rounded-2xl border border-[#fbbf24]/30 bg-[#2d1b4e]/70 px-4 py-4 text-center ${className}`}
    >
      <p className="text-purple-100 text-sm leading-relaxed mb-3">
        Que esta guía ilumine tu camino. Si deseas una lectura más profunda y
        personalizada, puedo acompañarte de forma directa. ✨
      </p>

      <button
        type="button"
        onClick={() => setModalAbierto(true)}
        className="inline-flex items-center justify-center gap-1.5 text-xs text-[#fbbf24]/90 hover:text-[#fbbf24] underline-offset-2 hover:underline transition-colors"
      >
        Consulta personalizada — ver precios
      </button>

      {children}

      <ConsultaPersonalizadaModal
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
      />
    </div>
  )
}
