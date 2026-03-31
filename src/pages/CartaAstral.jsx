import { useState } from 'react'
import { usePremium } from '../contexts/PremiumContext'
import { useNavigate } from 'react-router-dom'

export default function CartaAstral() {
    const { isPremium, loading: premiumLoading } = usePremium()
const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nombre: '',
    fecha: '',
    hora: '',
    ciudad: ''
  })
  const [resultado, setResultado] = useState(null)

  const signos = [
    'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
    'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
  ]

  const calcularSignoSolar = (fecha) => {
    const mes = new Date(fecha).getMonth() + 1
    const dia = new Date(fecha).getDate()
    
    if ((mes === 3 && dia >= 21) || (mes === 4 && dia <= 19)) return 'Aries'
    if ((mes === 4 && dia >= 20) || (mes === 5 && dia <= 20)) return 'Tauro'
    if ((mes === 5 && dia >= 21) || (mes === 6 && dia <= 20)) return 'Géminis'
    if ((mes === 6 && dia >= 21) || (mes === 7 && dia <= 22)) return 'Cáncer'
    if ((mes === 7 && dia >= 23) || (mes === 8 && dia <= 22)) return 'Leo'
    if ((mes === 8 && dia >= 23) || (mes === 9 && dia <= 22)) return 'Virgo'
    if ((mes === 9 && dia >= 23) || (mes === 10 && dia <= 22)) return 'Libra'
    if ((mes === 10 && dia >= 23) || (mes === 11 && dia <= 21)) return 'Escorpio'
    if ((mes === 11 && dia >= 22) || (mes === 12 && dia <= 21)) return 'Sagitario'
    if ((mes === 12 && dia >= 22) || (mes === 1 && dia <= 19)) return 'Capricornio'
    if ((mes === 1 && dia >= 20) || (mes === 2 && dia <= 18)) return 'Acuario'
    return 'Piscis'
  }

  const calcularSignoLunar = (fecha) => {
    // Simplificado: basado en el día del mes
    const dia = new Date(fecha).getDate()
    const index = Math.floor((dia - 1) / 2.5)
    return signos[index % 12]
  }

  const calcularAscendente = (hora) => {
    // Simplificado: basado en la hora
    if (!hora) return signos[0]
    const h = parseInt(hora.split(':')[0])
    const index = Math.floor(h / 2)
    return signos[index % 12]
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.fecha || !formData.hora) {
      alert('Por favor completa al menos la fecha y hora de nacimiento')
      return
    }

    const signoSolar = calcularSignoSolar(formData.fecha)
    const signoLunar = calcularSignoLunar(formData.fecha)
    const ascendente = calcularAscendente(formData.hora)

    setResultado({
      nombre: formData.nombre || 'Usuario',
      signoSolar,
      signoLunar,
      ascendente
    })
  }

  const nuevaConsulta = () => {
    setFormData({ nombre: '', fecha: '', hora: '', ciudad: '' })
    setResultado(null)
  }
// Mostrar loading mientras verifica premium
if (premiumLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🔮</div>
          <p className="text-purple-300">Cargando...</p>
        </div>
      </div>
    )
  }
  
  // Paywall para usuarios no premium
  if (!isPremium) {
    return (
      <div className="max-w-md mx-auto px-4 pt-10 pb-4">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold text-yellow-300 mb-2">Contenido Premium</h1>
          <p className="text-purple-200 mb-6">
            La Carta Astral es una funcionalidad exclusiva para miembros Premium
          </p>
        </div>
  
        <div className="bg-gradient-to-br from-yellow-900/60 to-yellow-700/60 border-4 border-yellow-400/80 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-yellow-200 mb-4 text-center">
            ✨ Con Premium obtienes:
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <span className="text-yellow-300 mt-0.5">⭐</span>
              <p className="text-yellow-100 text-sm">Carta Astral completa con todos los planetas</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-300 mt-0.5">⭐</span>
              <p className="text-yellow-100 text-sm">Análisis detallado de casas astrológicas</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-300 mt-0.5">⭐</span>
              <p className="text-yellow-100 text-sm">Lecturas ilimitadas de Tarot</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-300 mt-0.5">⭐</span>
              <p className="text-yellow-100 text-sm">Registros Akáshicos</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-300 mt-0.5">⭐</span>
              <p className="text-yellow-100 text-sm">Sin anuncios</p>
            </div>
          </div>
  
          <div className="text-center mt-6">
            <p className="text-3xl font-bold text-yellow-300 mb-1">$4.99/mes</p>
            <p className="text-yellow-200 text-sm">Cancela cuando quieras</p>
          </div>
        </div>
  
        <button
          onClick={() => navigate('/planes')}
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-purple-900 font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] mb-3"
        >
          🚀 Actualizar a Premium
        </button>
  
        <button
          onClick={() => navigate('/')}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
        >
          ← Volver al Inicio
        </button>
      </div>
    )
  }
  
  if (resultado) {
    return (
      <div className="max-w-md mx-auto px-4 pt-10 pb-4">
        <div className="text-center mb-4">
          <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-purple-900 text-xs font-bold px-3 py-1 rounded-full">
            ⭐ PREMIUM
          </span>
        </div>

        <h1 className="text-3xl font-bold text-yellow-300 mb-2 text-center">✨ Tu Carta Astral</h1>
        <p className="text-purple-200 text-center mb-6">{resultado.nombre}</p>

        <div className="space-y-4">
          {/* Signo Solar */}
          <div className="bg-gradient-to-br from-yellow-900/40 to-yellow-700/40 border-2 border-yellow-500/60 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-2xl font-bold text-yellow-300">☀️ Signo Solar</h2>
              <span className="text-4xl">{resultado.signoSolar}</span>
            </div>
            <p className="text-yellow-100 mb-2 font-semibold">{resultado.signoSolar}</p>
            <p className="text-sm text-yellow-200/80">
              Tu esencia, tu ego, cómo brillas en el mundo. Representa tu identidad central y propósito de vida.
            </p>
          </div>

          {/* Signo Lunar */}
          <div className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 border-2 border-purple-400/60 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-2xl font-bold text-purple-200">🌙 Signo Lunar</h2>
              <span className="text-4xl">{resultado.signoLunar}</span>
            </div>
            <p className="text-purple-100 mb-2 font-semibold">{resultado.signoLunar}</p>
            <p className="text-sm text-purple-200/80">
              Tu mundo emocional, tus necesidades internas. Representa cómo procesas sentimientos y buscas seguridad.
            </p>
          </div>

          {/* Ascendente */}
          <div className="bg-gradient-to-br from-pink-900/40 to-rose-900/40 border-2 border-pink-500/60 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-2xl font-bold text-pink-200">⬆️ Ascendente</h2>
              <span className="text-4xl">{resultado.ascendente}</span>
            </div>
            <p className="text-pink-100 mb-2 font-semibold">{resultado.ascendente}</p>
            <p className="text-sm text-pink-200/80">
              Tu máscara social, cómo te perciben otros. Representa tu apariencia externa y primera impresión.
            </p>
          </div>

          {/* Info adicional */}
          <div className="bg-purple-800/30 border border-purple-500/50 rounded-xl p-4">
            <p className="text-sm text-purple-200 italic text-center">
              💫 Esta es una carta astral básica. Para un análisis completo con todas las casas y planetas, 
              próximamente dispondremos de la versión avanzada.
            </p>
          </div>

          <button
            onClick={nuevaConsulta}
            className="w-full bg-gradient-to-r from-yellow-600/80 to-yellow-500/80 border-2 border-yellow-400/60 rounded-xl py-3 px-6 text-purple-900 font-bold shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            ✨ Nueva Carta Astral
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-10 pb-4">
      <div className="text-center mb-4">
        <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-purple-900 text-xs font-bold px-3 py-1 rounded-full">
          ⭐ PREMIUM
        </span>
      </div>

      <h1 className="text-3xl font-bold text-yellow-300 mb-2 text-center">✨ Carta Astral</h1>
      <p className="text-purple-200 mb-6 text-center">
        Descubre tu mapa cósmico personal
      </p>

      <form onSubmit={handleSubmit} className="bg-purple-900/40 border-2 border-purple-500/60 rounded-2xl p-8 shadow-lg">
        <div className="space-y-5">
          <div>
            <label className="block text-purple-200 mb-2 font-medium">
              Tu nombre <span className="text-purple-400 text-sm">(opcional)</span>
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              placeholder="Ej: María García"
              className="w-full bg-black/30 border-2 border-purple-400 focus:border-yellow-300 rounded-xl px-4 py-3 text-purple-100 placeholder-purple-400/60 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-purple-200 mb-2 font-medium">
              Fecha de nacimiento <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({...formData, fecha: e.target.value})}
              required
              className="w-full bg-black/30 border-2 border-purple-400 focus:border-yellow-300 rounded-xl px-4 py-3 text-purple-100 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-purple-200 mb-2 font-medium">
              Hora de nacimiento <span className="text-red-400">*</span>
            </label>
            <input
              type="time"
              value={formData.hora}
              onChange={(e) => setFormData({...formData, hora: e.target.value})}
              required
              className="w-full bg-black/30 border-2 border-purple-400 focus:border-yellow-300 rounded-xl px-4 py-3 text-purple-100 outline-none transition-colors"
            />
            <p className="text-xs text-purple-300 mt-1">Es importante para calcular tu ascendente</p>
          </div>

          <div>
            <label className="block text-purple-200 mb-2 font-medium">
              Ciudad de nacimiento <span className="text-purple-400 text-sm">(opcional)</span>
            </label>
            <input
              type="text"
              value={formData.ciudad}
              onChange={(e) => setFormData({...formData, ciudad: e.target.value})}
              placeholder="Ej: Bogotá, Colombia"
              className="w-full bg-black/30 border-2 border-purple-400 focus:border-yellow-300 rounded-xl px-4 py-3 text-purple-100 placeholder-purple-400/60 outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-600/80 to-yellow-500/80 border-2 border-yellow-400/60 rounded-xl py-4 px-6 text-purple-900 font-bold text-lg shadow-lg shadow-yellow-900/60 hover:shadow-yellow-500/40 transition-all duration-300 hover:scale-[1.02]"
          >
            🔮 Generar Mi Carta Astral
          </button>
        </div>
      </form>
    </div>
  )
}