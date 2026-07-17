import { useNavigate } from 'react-router-dom'

const MENSAJES = {
  diario:
    'Ya recibiste tu lectura de hoy ✨. Vuelve mañana para una nueva guía, o hazte Premium y sigue explorando sin límites.',
  semanal:
    'Ya recibiste tu horóscopo de esta semana ✨. Vuelve la próxima semana, o hazte Premium para tu horóscopo diario y mucho más.',
}

const BENEFICIOS_RESUMEN = [
  '✨ Lecturas ILIMITADAS en todos los servicios',
  '📖 Lecturas más amplias y detalladas',
  '🛍️ Descuentos en la Tienda y en lecturas',
]

export default function AvisoLimiteDiario({ className = '', periodo = 'diario', mensaje }) {
  const navigate = useNavigate()
  const texto = mensaje || MENSAJES[periodo] || MENSAJES.diario

  return (
    <div
      className={`rounded-2xl border-2 border-[#fbbf24]/50 bg-[#2d1b4e]/90 p-6 text-center shadow-[0_0_24px_rgba(251,191,36,0.15)] ${className}`}
    >
      <div className="text-4xl mb-3">✨</div>
      <p className="text-purple-100 leading-relaxed mb-4">{texto}</p>

      <div className="mb-5 rounded-xl border border-[#fbbf24]/25 bg-purple-950/50 px-3 py-3 text-left">
        <p className="text-[#fbbf24] text-xs font-semibold tracking-wide uppercase mb-2 text-center">
          Con Premium obtienes
        </p>
        <ul className="space-y-1.5">
          {BENEFICIOS_RESUMEN.map((item) => (
            <li key={item} className="text-purple-100 text-sm leading-snug">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={() => navigate('/planes')}
        className="w-full bg-gradient-to-r from-[#fbbf24] to-yellow-500 hover:from-yellow-400 hover:to-[#fbbf24] text-[#2d1b4e] font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02]"
      >
        Hazte Premium
      </button>
    </div>
  )
}
