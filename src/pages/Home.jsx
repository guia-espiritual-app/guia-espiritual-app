import { Link } from 'react-router-dom'
import logoGuia from '../assets/logo-guia.png'
import avatarVidente from '../assets/avatares/vidente.png'
import avatarSacerdotisa from '../assets/avatares/sacerdotisa.png'
import avatarNumerologo from '../assets/avatares/numerologo.png'
import avatarGuardian from '../assets/avatares/guardian.png'
import avatarChaman from '../assets/avatares/chaman.png'
import avatarEjercicios from '../assets/avatares/ejercicios.png'
import guImg from '../assets/avatares/gu.png'
import BurbujaGU from '../components/BurbujaGU'

function getSaludo() {
  const hora = new Date().getHours()
  if (hora >= 5 && hora < 12) return 'Buenos días'
  if (hora >= 12 && hora < 20) return 'Buenas tardes'
  return 'Buenas noches'
}

const features = [
  { to: '/tarot', avatar: avatarVidente, title: 'Tarot', desc: 'Descubre tu camino', external: false },
  { to: '/horoscopo', avatar: avatarSacerdotisa, title: 'Horóscopo', desc: 'Tu energía hoy', external: false },
  { to: '/numerologia', avatar: avatarNumerologo, title: 'Numerología', desc: 'Tu número de vida', external: false },
  { to: '/carta-astral', avatar: avatarGuardian, title: 'Carta Astral', desc: 'Tu mapa cósmico', external: false, premium: true },
  { to: '/registros-akashicos', avatar: avatarChaman, title: 'Registros Akáshicos', desc: 'Sabiduría del alma', external: false, premium: true },
  { to: '/rituales', avatar: avatarEjercicios, title: 'Rituales', desc: 'Prácticas para transformar tu energía', external: false, badgeGratis: '10 rituales gratis' },
]

const WHATSAPP_CONSULTA_URL =
  'https://wa.me/573004982667?text=Hola,%20quiero%20una%20consulta%20personalizada%20(app%20Gu%C3%ADa%20Espiritual)'

function openConsultaWhatsApp() {
  window.open(WHATSAPP_CONSULTA_URL, '_blank')
}

const bannerClass =
  'w-full bg-purple-900/40 border-2 border-purple-500/60 rounded-2xl px-4 py-3.5 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(139,92,246,0.5)] hover:border-purple-400/80'

export default function Home() {
  const saludo = getSaludo()

  return (
    <div className="max-w-md mx-auto px-5 pt-8 pb-24">
      {/* Header */}
      <header className="text-center mb-8">
        <img
          src={logoGuia}
          alt="Guía Espiritual"
          className="mx-auto mb-2 max-w-[220px] w-full h-auto"
        />

        <BurbujaGU seccion="inicio" className="mt-4 mb-6" />

        <h1 className="text-3xl font-bold text-yellow-300 mb-1">{saludo}</h1>
        <p className="text-purple-200 text-lg">¿Qué deseas descubrir hoy?</p>
      </header>

      {/* Grid de features */}
      <section className="grid grid-cols-2 gap-4">
        {features.map((item) => {
          const content = (
            <>
              {item.premium && (
                <div className="absolute top-2 right-2">
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-purple-900 text-xs font-bold px-2 py-1 rounded-full">
                    PREMIUM
                  </span>
                </div>
              )}
              {item.badgeGratis && (
                <div className="absolute top-2 right-2">
                  <span className="bg-gradient-to-r from-green-500 to-emerald-400 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.45)] border border-green-300/50">
                    {item.badgeGratis}
                  </span>
                </div>
              )}
              {item.avatar ? (
                <img
                  src={item.avatar}
                  alt=""
                  className="h-[65px] w-auto object-contain mb-3 drop-shadow-[0_0_10px_rgba(251,191,36,0.15)]"
                />
              ) : (
                <div className="text-5xl mb-3">{item.icon}</div>
              )}
              <h2 className="text-yellow-300 font-bold text-lg mb-1">{item.title}</h2>
              <p className="text-purple-200 text-sm">{item.desc}</p>
            </>
          )

const cardClass = `bg-purple-900/40 border-2 border-purple-500/60 rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(139,92,246,0.5)] hover:border-purple-400/80 relative ${item.disabled ? 'opacity-50 cursor-default' : 'cursor-pointer'}`
          if (item.disabled) {
            return (
              <div key={item.title} className={cardClass}>
                {content}
              </div>
            )
          }

          return (
            <Link
              key={item.title}
              to={item.to}
              className={cardClass}
            >
              {content}
            </Link>
          )
        })}
      </section>

      {/* Banners de ancho completo */}
      <section className="mt-4 space-y-4">
        <Link to="/tienda" className={bannerClass}>
          <img src={guImg} alt="" className="h-10 w-10 object-contain shrink-0 drop-shadow-[0_0_10px_rgba(251,191,36,0.15)]" />
          <div className="text-left flex-1 min-w-0">
            <h2 className="text-yellow-300 font-bold text-base leading-snug mb-0.5">
              Academia del Maestro GU y Tienda
            </h2>
            <p className="text-purple-200 text-sm leading-snug">Cristales, amuletos y guías</p>
          </div>
        </Link>

        <button
          type="button"
          onClick={openConsultaWhatsApp}
          className={`${bannerClass} bg-gradient-to-r from-purple-900/60 to-yellow-900/30 border-yellow-500/60 hover:border-yellow-400/80 hover:shadow-[0_0_24px_rgba(251,191,36,0.35)] text-left`}
        >
          <img src={guImg} alt="" className="h-10 w-10 object-contain shrink-0 drop-shadow-[0_0_10px_rgba(251,191,36,0.15)]" />
          <div className="flex-1 min-w-0">
            <h2 className="text-yellow-300 font-bold text-base leading-snug mb-0.5">
              Consulta Personalizada
            </h2>
            <p className="text-purple-200 text-sm leading-snug">
              Tu lectura personalizada por WhatsApp
            </p>
          </div>
        </button>
      </section>
    </div>
  )
}
