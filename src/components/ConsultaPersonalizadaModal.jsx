import iconConsulta from '../assets/avatares/consulta.png'

const WHATSAPP_NUMBER = '573004982667'

const OPCIONES = [
  {
    id: 'texto',
    emoji: '💬',
    titulo: 'Consulta por texto',
    precio: '$70 USD',
    modalidad: 'TEXTO',
  },
  {
    id: 'llamada',
    emoji: '📞',
    titulo: 'Llamada',
    precio: '$150 USD',
    modalidad: 'LLAMADA',
  },
  {
    id: 'videollamada',
    emoji: '🎥',
    titulo: 'Videollamada',
    precio: '$200 USD',
    modalidad: 'VIDEOLLAMADA',
  },
]

function urlWhatsApp(modalidad, precio) {
  const texto = `Hola, quiero una consulta personalizada por ${modalidad} (${precio}) - app Guía Espiritual`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`
}

function abrirWhatsApp(modalidad, precio) {
  window.open(urlWhatsApp(modalidad, precio), '_blank')
}

export default function ConsultaPersonalizadaModal({ abierto, onCerrar }) {
  if (!abierto) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onCerrar}
      role="dialog"
      aria-modal="true"
      aria-labelledby="consulta-personalizada-titulo"
    >
      <div
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-[#fbbf24]/50 bg-gradient-to-b from-[#2d1b4e] to-[#1a0f2e] shadow-[0_0_40px_rgba(251,191,36,0.2)] p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-start gap-3 min-w-0 pr-2">
            <img
              src={iconConsulta}
              alt=""
              className="h-14 w-14 object-contain shrink-0 drop-shadow-[0_0_12px_rgba(251,191,36,0.25)]"
            />
            <h2
              id="consulta-personalizada-titulo"
              className="text-xl sm:text-2xl font-bold text-yellow-300 leading-snug"
            >
              Consulta Personalizada con el Maestro GU
            </h2>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            className="shrink-0 text-purple-300 hover:text-yellow-300 text-2xl leading-none px-1"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <p className="text-purple-200/90 text-sm mb-5 leading-relaxed">
          Elige la modalidad que prefieres. Verás el valor y luego podrás
          contactar por WhatsApp.
        </p>

        <ul className="space-y-3">
          {OPCIONES.map((opcion) => (
            <li
              key={opcion.id}
              className="rounded-xl border border-[#fbbf24]/35 bg-purple-950/50 p-4 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-2xl" aria-hidden>
                    {opcion.emoji}
                  </span>
                  <div>
                    <p className="text-yellow-200 font-semibold text-base leading-tight">
                      {opcion.titulo}
                    </p>
                    <p className="text-[#fbbf24] font-bold text-lg mt-0.5">
                      {opcion.precio}
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => abrirWhatsApp(opcion.modalidad, opcion.precio)}
                className="w-full bg-gradient-to-r from-[#fbbf24] to-yellow-500 hover:from-yellow-400 hover:to-[#fbbf24] text-[#2d1b4e] font-bold py-2.5 px-4 rounded-xl text-sm shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                Contactar por WhatsApp
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
