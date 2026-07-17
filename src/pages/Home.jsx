import { useState } from 'react'
import { Link } from 'react-router-dom'
import logoGuia from '../assets/logo-guia.png'
import avatarVidente from '../assets/avatares/vidente.png'
import avatarSacerdotisa from '../assets/avatares/sacerdotisa.png'
import avatarNumerologo from '../assets/avatares/numerologo.png'
import avatarGuardian from '../assets/avatares/guardian.png'
import avatarChaman from '../assets/avatares/chaman.png'
import iconRituales from '../assets/avatares/rituales.png'
import iconAcademia from '../assets/avatares/academia.png'
import iconTienda from '../assets/avatares/tienda.png'
import iconConsulta from '../assets/avatares/consulta.png'
import BurbujaGU from '../components/BurbujaGU'
import ConsultaPersonalizadaModal from '../components/ConsultaPersonalizadaModal'
import { useSound } from '../contexts/SoundContext'

const revelaciones = [
  { to: '/tarot', avatar: avatarVidente, title: 'Tarot', desc: 'Descubre tu camino' },
  { to: '/horoscopo', avatar: avatarSacerdotisa, title: 'Horóscopo', desc: 'Tu energía hoy' },
  { to: '/numerologia', avatar: avatarNumerologo, title: 'Numerología', desc: 'Tu número de vida' },
  { to: '/carta-astral', avatar: avatarGuardian, title: 'Carta Astral', desc: 'Tu mapa cósmico' },
  { to: '/registros-akashicos', avatar: avatarChaman, title: 'Registros Akáshicos', desc: 'Sabiduría del alma' },
]

const revelacionCardClass =
  'bg-gradient-to-b from-indigo-950/50 to-purple-900/40 border-2 border-indigo-400/50 rounded-2xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(99,102,241,0.45)] hover:border-indigo-300/70 relative cursor-pointer'

const servicioBannerClass =
  'w-full bg-gradient-to-r from-[#2d1b4e]/90 to-yellow-950/40 border-2 border-[#fbbf24]/45 rounded-2xl px-4 py-3.5 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(251,191,36,0.3)] hover:border-[#fbbf24]/70 text-left'

const servicioIconClass =
  'h-14 w-14 object-contain shrink-0 drop-shadow-[0_0_10px_rgba(251,191,36,0.2)]'

export default function Home() {
  const { soundEnabled, toggleSound } = useSound()
  const [modalConsulta, setModalConsulta] = useState(false)
  const [toastProximamente, setToastProximamente] = useState(false)

  const handleBannerProximamente = () => {
    setToastProximamente(true)
    window.setTimeout(() => setToastProximamente(false), 2200)
  }

  return (
    <div className="max-w-md mx-auto px-5 pt-4 pb-24">
      <header className="text-center mb-8">
        <BurbujaGU seccion="inicio" className="mb-5" />

        <img
          src={logoGuia}
          alt="Guía Espiritual"
          className="mx-auto mb-5 max-w-[200px] w-full h-auto"
        />

        {/* Control de frecuencia sonora (junto al saludo) */}
        <div className="mb-5 flex items-center gap-2.5 rounded-2xl border border-[#fbbf24]/30 bg-[#2d1b4e]/70 px-3 py-2.5 text-left shadow-[0_0_16px_rgba(251,191,36,0.08)]">
          <p className="flex-1 min-w-0 text-[11px] leading-snug text-purple-200 sm:text-xs">
            {soundEnabled
              ? 'Frecuencia sonora activa 🎻'
              : 'Activa la frecuencia sonora y entra en un estado meditativo.'}
          </p>
          <button
            type="button"
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Desactivar sonido' : 'Activar sonido'}
            title="Activa la frecuencia sonora y entra en un estado meditativo."
            className="flex items-center justify-center w-11 h-11 shrink-0 rounded-xl border border-[#fbbf24]/45 bg-purple-900/50 text-xl shadow-sm transition-all duration-200 hover:border-[#fbbf24]/80 hover:bg-purple-800/60 hover:shadow-[0_0_12px_rgba(251,191,36,0.25)]"
          >
            {soundEnabled ? '🎻' : '🎼'}
          </button>
        </div>

        <p className="text-[#fbbf24] text-xl sm:text-2xl font-bold leading-snug">
          ¿Qué deseas descubrir hoy?
        </p>
      </header>

      {/* Revelaciones: lecturas místicas */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3 px-1">
          <span className="text-indigo-300 text-sm font-semibold tracking-wide uppercase">
            ✨ Revelaciones
          </span>
          <span className="flex-1 h-px bg-indigo-400/30" />
        </div>
        <p className="text-purple-300/80 text-xs mb-4 px-1">
          Lecturas y guías místicas para tu camino
        </p>

        <div className="grid grid-cols-2 gap-4">
          {revelaciones.map((item) => (
            <Link key={item.title} to={item.to} className={revelacionCardClass}>
              <span className="absolute top-2 left-2 bg-indigo-500/30 text-indigo-100 text-[9px] font-bold px-1.5 py-0.5 rounded border border-indigo-400/40">
                Lectura
              </span>
              {item.premium && (
                <div className="absolute top-2 right-2">
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-purple-900 text-xs font-bold px-2 py-1 rounded-full">
                    PREMIUM
                  </span>
                </div>
              )}
              <img
                src={item.avatar}
                alt=""
                className="h-[88px] w-auto object-contain mb-3 mt-3 drop-shadow-[0_0_10px_rgba(129,140,248,0.25)]"
              />
              <h2 className="text-yellow-300 font-bold text-lg mb-1">{item.title}</h2>
              <p className="text-purple-200 text-sm">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Servicios */}
      <section className="space-y-4 mb-8">
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className="text-[#fbbf24]/90 text-sm font-semibold tracking-wide uppercase">
            🕯️ Servicios
          </span>
          <span className="flex-1 h-px bg-[#fbbf24]/25" />
        </div>
        <p className="text-purple-300/80 text-xs mb-2 px-1">
          Academia, rituales y acompañamiento personalizado
        </p>

        <Link
          to="/rituales"
          className={`${servicioBannerClass} relative`}
        >
          <span className="absolute top-2 right-2 bg-[#fbbf24]/20 text-[#fbbf24] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#fbbf24]/40">
            Servicio
          </span>
          <img src={iconRituales} alt="" className={servicioIconClass} />
          <div className="flex-1 min-w-0 pr-10">
            <h2 className="text-yellow-300 font-bold text-base leading-snug mb-0.5">
              Rituales
            </h2>
            <p className="text-purple-200 text-sm leading-snug">
              Prácticas para transformar tu energía
            </p>
            <p className="text-green-300/90 text-[10px] mt-1 font-medium">10 rituales gratis</p>
          </div>
        </Link>

        <Link to="/academia" className={`${servicioBannerClass} relative`}>
          <span className="absolute top-2 right-2 bg-[#fbbf24]/20 text-[#fbbf24] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#fbbf24]/40">
            Servicio
          </span>
          <img src={iconAcademia} alt="" className={servicioIconClass} />
          <div className="flex-1 min-w-0 pr-10">
            <h2 className="text-yellow-300 font-bold text-base leading-snug mb-0.5">
              Academia del Maestro GU
            </h2>
            <p className="text-purple-200 text-sm leading-snug">
              Ebooks y guías espirituales
            </p>
          </div>
        </Link>

        <Link to="/tienda" className={`${servicioBannerClass} relative`}>
          <span className="absolute top-2 right-2 bg-[#fbbf24]/20 text-[#fbbf24] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#fbbf24]/40">
            Servicio
          </span>
          <img src={iconTienda} alt="" className={servicioIconClass} />
          <div className="flex-1 min-w-0 pr-10">
            <h2 className="text-yellow-300 font-bold text-base leading-snug mb-0.5">
              Tienda
            </h2>
            <p className="text-purple-200 text-sm leading-snug">
              Cristales, amuletos y joyas de poder
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setModalConsulta(true)}
          className={`${servicioBannerClass} relative border-[#fbbf24]/60`}
        >
          <span className="absolute top-2 right-2 bg-[#fbbf24]/20 text-[#fbbf24] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#fbbf24]/40">
            Servicio
          </span>
          <img src={iconConsulta} alt="" className={servicioIconClass} />
          <div className="flex-1 min-w-0 pr-10">
            <h2 className="text-yellow-300 font-bold text-base leading-snug mb-0.5">
              Consulta Personalizada
            </h2>
            <p className="text-purple-200 text-sm leading-snug">
              Ver modalidades y precios
            </p>
          </div>
        </button>
      </section>

      {/* Banner próximamente — al final del Home */}
      <button
        type="button"
        onClick={handleBannerProximamente}
        className="w-full relative overflow-hidden rounded-2xl border-2 border-pink-400/50 bg-gradient-to-r from-purple-900/90 via-[#3b1d6e] to-rose-950/70 px-4 py-4 text-left shadow-[0_0_28px_rgba(244,114,182,0.25)] transition-all duration-300 hover:border-pink-300/70 hover:shadow-[0_0_32px_rgba(251,191,36,0.2)]"
      >
        <span className="absolute top-2 right-2 bg-gradient-to-r from-[#fbbf24] to-yellow-500 text-[#2d1b4e] text-[10px] font-extrabold tracking-wide px-2 py-0.5 rounded-md shadow">
          PRÓXIMAMENTE
        </span>
        <p className="text-yellow-100 font-semibold text-[15px] leading-snug pr-24">
          😍 Próximamente: Chat de citas zodiacales y compatibilidad.
        </p>
        {toastProximamente && (
          <p className="mt-2 text-[#fbbf24] text-sm font-medium animate-pulse">
            Muy pronto ✨
          </p>
        )}
      </button>

      <ConsultaPersonalizadaModal
        abierto={modalConsulta}
        onCerrar={() => setModalConsulta(false)}
      />
    </div>
  )
}
