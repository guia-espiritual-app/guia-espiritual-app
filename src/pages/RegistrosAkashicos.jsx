import { useState } from 'react'
import { usePremium } from '../contexts/PremiumContext'
import { useNavigate } from 'react-router-dom'

export default function RegistrosAkashicos() {
  const { isPremium, loading: premiumLoading } = usePremium()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    nombre: '',
    fecha: '',
    preguntaPrincipal: '',
    areaVida: ''
  })
  const [lectura, setLectura] = useState(null)

  const areasDeVida = [
    'Propósito de vida',
    'Relaciones y amor',
    'Carrera y abundancia',
    'Salud y bienestar',
    'Crecimiento espiritual',
    'Bloqueos a superar'
  ]

  const generarLectura = (datos) => {
    const { nombre, areaVida, preguntaPrincipal } = datos
    
    const lecturasPorArea = {
      'Propósito de vida': [
        `${nombre}, tus registros revelan que tu alma eligió esta encarnación para desarrollar la maestría en crear puentes entre mundos. Tu propósito se activa cuando compartes tu sabiduría con autenticidad y permites que tu luz inspire transformación en otros.`,
        `Los registros muestran, ${nombre}, que viniste a este plano para anclar frecuencias de sanación a través de tu presencia. Tu propósito florece cuando confías en tu intuición y permites que tu energía única se exprese sin limitaciones.`,
        `${nombre}, tu alma registra un contrato de servicio a través de la creatividad y la innovación. Tu propósito se manifiesta cuando te atreves a materializar las visiones que tu espíritu recibe y las compartes con valentía.`
      ],
      'Relaciones y amor': [
        `En el área del amor, ${nombre}, tus registros indican que has venido a sanar patrones ancestrales de relación. Tu camino incluye aprender el amor propio profundo antes de co-crear con otro ser. Las relaciones que llegan ahora son espejos para tu evolución.`,
        `${nombre}, los registros revelan que tu alma busca experimentar la vulnerabilidad sagrada en las relaciones. Tu mayor crecimiento viene de permitir ser visto completamente, soltando máscaras y abriéndote a la intimidad auténtica.`,
        `Tus registros muestran, ${nombre}, que has elegido aprender sobre el amor a través del servicio desinteresado y la compasión. Las relaciones en tu vida son maestros que te enseñan sobre límites sanos y amor incondicional simultáneamente.`
      ],
      'Carrera y abundancia': [
        `${nombre}, en el área de la abundancia, tus registros revelan que has venido a desmantelar creencias limitantes sobre la prosperidad. Tu camino es aprender que la abundancia fluye cuando alineas tu trabajo con tu verdad más profunda.`,
        `Los registros indican, ${nombre}, que tu alma busca experimentar la abundancia a través de la creatividad y la autenticidad. Cuando dejas de buscar aprobación externa y sigues tu guía interior, las oportunidades se multiplican naturalmente.`,
        `${nombre}, tus registros muestran que la verdadera riqueza para ti viene de hacer lo que amas. Tu camino incluye soltar el miedo a la escasez y confiar en que el universo sostiene tus necesidades cuando estás alineado con tu propósito.`
      ],
      'Salud y bienestar': [
        `${nombre}, tus registros revelan que tu cuerpo es un templo sagrado que sostiene memorias antiguas. Tu sanación viene de escuchar los mensajes sutiles de tu cuerpo y honrar sus necesidades con compasión y respeto.`,
        `En el área de la salud, ${nombre}, los registros muestran que has venido a aprender sobre el equilibrio entre dar y recibir. Tu bienestar se restaura cuando priorizas tu propio cuidado y estableces límites amorosos con tu energía.`,
        `Los registros indican, ${nombre}, que tu salud está profundamente conectada con tu estado emocional y espiritual. Tu camino de sanación incluye liberar emociones almacenadas y conectar con prácticas que nutran tu ser integral.`
      ],
      'Crecimiento espiritual': [
        `${nombre}, tus registros revelan que eres un alma antigua en un camino de maestría espiritual. Tu crecimiento se acelera cuando confías en tus dones intuitivos y te permites ser canal de sabiduría superior.`,
        `Los registros muestran, ${nombre}, que has venido a integrar las dimensiones espirituales y materiales de la existencia. Tu evolución incluye aprender a vivir con un pie en el cielo y otro en la tierra, honrando ambos aspectos de tu ser.`,
        `${nombre}, tus registros indican que tu despertar espiritual es gradual e incluye períodos de integración profunda. Confía en los tiempos divinos y honra cada etapa de tu viaje sin prisas ni comparaciones.`
      ],
      'Bloqueos a superar': [
        `${nombre}, tus registros revelan que el principal bloqueo a liberar es el miedo a tu propio poder. Has contenido tu luz por temor a brillar demasiado. Es momento de reclamar tu magnificencia y dejar de hacerte pequeño.`,
        `Los registros muestran, ${nombre}, que cargas con patrones de auto-sabotaje heredados de tu linaje. Tu liberación viene de reconocer que no estás destinado a repetir las limitaciones de tus ancestros. Eres el que rompe las cadenas.`,
        `${nombre}, el bloqueo principal en tus registros es la creencia de no ser suficiente. Esta ilusión ha limitado tu expansión. Tu sanación comienza al reconocer tu valor inherente, independiente de logros externos.`
      ]
    }

    const mensajes = lecturasPorArea[areaVida] || lecturasPorArea['Propósito de vida']
    const indice = Math.floor(Math.random() * mensajes.length)
    
    return {
      lecturaPrincipal: mensajes[indice],
      mensajeAdicional: preguntaPrincipal 
        ? `Respecto a tu pregunta: "${preguntaPrincipal}", los registros sugieren que la respuesta que buscas ya habita en tu corazón. Permite que el silencio y la meditación te revelen lo que tu alma ya sabe. Confía en las señales que el universo te envía.`
        : null
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.nombre || !formData.fecha || !formData.areaVida) {
      alert('Por favor completa los campos requeridos')
      return
    }

    const resultado = generarLectura(formData)
    setLectura(resultado)
  }

  const nuevaConsulta = () => {
    setFormData({
      nombre: '',
      fecha: '',
      preguntaPrincipal: '',
      areaVida: ''
    })
    setLectura(null)
  }

  // Loading mientras verifica premium
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
            Los Registros Akáshicos son una funcionalidad exclusiva para miembros Premium
          </p>
        </div>

        <div className="bg-gradient-to-br from-yellow-900/60 to-yellow-700/60 border-4 border-yellow-400/80 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-yellow-200 mb-4 text-center">
            ✨ Con Premium obtienes:
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <span className="text-yellow-300 mt-0.5">⭐</span>
              <p className="text-yellow-100 text-sm">Acceso completo a tus Registros Akáshicos</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-300 mt-0.5">⭐</span>
              <p className="text-yellow-100 text-sm">Carta Astral completa con todos los planetas</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-300 mt-0.5">⭐</span>
              <p className="text-yellow-100 text-sm">Lecturas ilimitadas de Tarot</p>
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

  // Vista de resultado
  if (lectura) {
    return (
      <div className="max-w-md mx-auto px-4 pt-10 pb-4">
        <div className="text-center mb-4">
          <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-purple-900 text-xs font-bold px-3 py-1 rounded-full">
            ⭐ PREMIUM
          </span>
        </div>

        <h1 className="text-3xl font-bold text-yellow-300 mb-2 text-center">📜 Tu Lectura Akáshica</h1>
        <p className="text-purple-200 text-center mb-6">{formData.nombre}</p>

        <div className="space-y-4">
          {/* Lectura Principal */}
          <div className="bg-gradient-to-br from-purple-900/60 to-indigo-900/60 border-2 border-purple-400/60 rounded-2xl p-6 shadow-lg">
            <h2 className="text-yellow-300 font-bold text-lg mb-3 flex items-center gap-2">
              <span>🌟</span>
              <span>Mensaje de tus Registros</span>
            </h2>
            <p className="text-purple-100 leading-relaxed italic">
              {lectura.lecturaPrincipal}
            </p>
          </div>

          {/* Mensaje adicional si hay pregunta */}
          {lectura.mensajeAdicional && (
            <div className="bg-gradient-to-br from-yellow-900/40 to-purple-900/40 border-2 border-yellow-500/60 rounded-2xl p-6">
              <h2 className="text-yellow-300 font-bold text-lg mb-3 flex items-center gap-2">
                <span>💫</span>
                <span>Guía sobre tu Pregunta</span>
              </h2>
              <p className="text-yellow-100 leading-relaxed italic">
                {lectura.mensajeAdicional}
              </p>
            </div>
          )}

          {/* Información del área consultada */}
          <div className="bg-purple-800/30 border border-purple-500/50 rounded-xl p-4">
            <p className="text-sm text-purple-200 text-center">
              <span className="font-semibold">Área consultada:</span> {formData.areaVida}
            </p>
          </div>

          <button
            onClick={nuevaConsulta}
            className="w-full bg-gradient-to-r from-yellow-600/80 to-yellow-500/80 border-2 border-yellow-400/60 rounded-xl py-3 px-6 text-purple-900 font-bold shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            ✨ Nueva Consulta Akáshica
          </button>
        </div>
      </div>
    )
  }

  // Formulario
  return (
    <div className="max-w-md mx-auto px-4 pt-10 pb-4">
      <div className="text-center mb-4">
        <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-purple-900 text-xs font-bold px-3 py-1 rounded-full">
          ⭐ PREMIUM
        </span>
      </div>

      <h1 className="text-3xl font-bold text-yellow-300 mb-2 text-center">📜 Registros Akáshicos</h1>
      <p className="text-purple-200 mb-6 text-center">
        Accede a la sabiduría de tu alma y descubre tu propósito
      </p>

      <form onSubmit={handleSubmit} className="bg-purple-900/40 border-2 border-purple-500/60 rounded-2xl p-8 shadow-lg">
        <div className="space-y-5">
          <div>
            <label className="block text-purple-200 mb-2 font-medium">
              Tu nombre completo <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              placeholder="Ej: María García"
              required
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
              Área de tu vida a consultar <span className="text-red-400">*</span>
            </label>
            <select
              value={formData.areaVida}
              onChange={(e) => setFormData({...formData, areaVida: e.target.value})}
              required
              className="w-full bg-black/30 border-2 border-purple-400 focus:border-yellow-300 rounded-xl px-4 py-3 text-purple-100 outline-none transition-colors"
            >
              <option value="">Selecciona un área...</option>
              {areasDeVida.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-purple-200 mb-2 font-medium">
              Pregunta específica <span className="text-purple-400 text-sm">(opcional)</span>
            </label>
            <textarea
              value={formData.preguntaPrincipal}
              onChange={(e) => setFormData({...formData, preguntaPrincipal: e.target.value})}
              placeholder="¿Hay algo específico que deseas saber?"
              rows={3}
              className="w-full bg-black/30 border-2 border-purple-400 focus:border-yellow-300 rounded-xl px-4 py-3 text-purple-100 placeholder-purple-400/60 outline-none transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-600/80 to-yellow-500/80 border-2 border-yellow-400/60 rounded-xl py-4 px-6 text-purple-900 font-bold text-lg shadow-lg shadow-yellow-900/60 hover:shadow-yellow-500/40 transition-all duration-300 hover:scale-[1.02]"
          >
            🔮 Acceder a mis Registros
          </button>
        </div>
      </form>
    </div>
  )
}