import { Link } from 'react-router-dom'

const FRASES_MISTICAS = [
  'El universo conspira a tu favor cuando te alineas con tu verdadero propósito.',
  'Cada final es un nuevo comienzo disfrazado de transformación.',
  'Tu intuición es el susurro del alma, escúchala.',
  'La luz que buscas ya habita en ti; solo hace falta recordarla.',
  'No eres un capítulo, eres la historia completa que el cosmos está escribiendo.',
  'Las estrellas no deciden tu destino; iluminan el camino que tú eliges.',
  'En el silencio interior está la respuesta que tu corazón ya conoce.',
  'Cada día es una carta nueva del tarot de tu vida: voltéala con confianza.',
  'Tu energía atrae lo que eres; transforma tu interior y transformarás tu mundo.',
  'El presente es el único momento donde la magia puede suceder.',
]

function getSaludo() {
  const hora = new Date().getHours()
  if (hora >= 5 && hora < 12) return 'Buenos días'
  if (hora >= 12 && hora < 20) return 'Buenas tardes'
  return 'Buenas noches'
}

function getFraseDelDia() {
  const hoy = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  const seed = hoy.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const index = seed % FRASES_MISTICAS.length
  return FRASES_MISTICAS[index]
}

const features = [
  { to: '/tarot', icon: '🃏', title: 'Tarot', desc: 'Descubre tu camino', external: false },
  { to: '/horoscopo', icon: '♈', title: 'Horóscopo', desc: 'Tu energía hoy', external: false },
  { to: '/numerologia', icon: '🔢', title: 'Numerología', desc: 'Tu número de vida', external: false },
  { to: '/carta-astral', icon: '✨', title: 'Carta Astral', desc: 'Tu mapa cósmico', external: false, premium: true },
  { to: '/registros-akashicos', icon: '📜', title: 'Registros Akáshicos', desc: 'Sabiduría del alma', external: false, premium: true },
]

export default function Home() {
  const saludo = getSaludo()
  const fraseDelDia = getFraseDelDia()

  return (
    <div className="max-w-md mx-auto px-5 pt-8 pb-24">
      {/* Header */}
      <header className="text-center mb-8">
        <div className="text-5xl mb-2">🔮</div>
        <h1 className="text-3xl font-bold text-yellow-300 mb-1">{saludo}</h1>
        <p className="text-purple-200 text-lg">¿Qué deseas descubrir hoy?</p>
      </header>

      {/* Frase del Día */}
      <section className="mb-10">
        <div className="bg-gradient-to-br from-purple-900/60 to-black/40 border-2 border-purple-500/50 rounded-2xl p-6 shadow-xl shadow-purple-900/40 transition-all duration-300">
          <p className="text-purple-100 italic text-base leading-relaxed flex items-start gap-2">
            <span className="text-yellow-300 text-xl shrink-0">✨</span>
            <span>{fraseDelDia}</span>
          </p>
        </div>
      </section>

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
              <div className="text-5xl mb-3">{item.icon}</div>
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
    </div>
  )
}
