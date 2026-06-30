import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase'
import guImg from '../assets/avatares/gu.png'
import mensajesGu from '../data/mensajes_gu.json'

function getNombreUsuario(user) {
  const nombre = user?.displayName?.trim()
  return nombre || 'alma viajera'
}

function getMensaje(seccion, user) {
  const datos = mensajesGu[seccion]
  if (!datos) return ''

  let mensaje = datos.mensaje
  if (datos.usa_nombre) {
    mensaje = mensaje.replace(/\{nombre\}/g, getNombreUsuario(user))
  }
  return mensaje
}

export default function BurbujaGU({
  seccion,
  className = '',
  avatarSrc = guImg,
  avatarAlt = 'Maestro GU',
}) {
  const [user] = useAuthState(auth)

  if (!mensajesGu[seccion]) return null

  const mensaje = getMensaje(seccion, user)

  return (
    <div className={`flex items-end gap-2 text-left ${className}`}>
      <img
        src={avatarSrc}
        alt={avatarAlt}
        className="h-[125px] w-auto max-w-[130px] object-contain shrink-0 drop-shadow-[0_0_12px_rgba(251,191,36,0.25)]"
      />
      <div className="relative flex-1 min-w-0 pb-1">
        <div className="relative bg-gradient-to-br from-purple-800/90 to-[#2d1b4e]/95 border-2 border-[#fbbf24]/35 rounded-2xl rounded-bl-md px-3.5 py-3 shadow-[0_4px_20px_rgba(45,27,78,0.5)]">
          <p className="text-purple-100 text-sm leading-relaxed">{mensaje}</p>
          <span
            aria-hidden="true"
            className="absolute -left-2.5 bottom-5 h-4 w-4 rotate-45 bg-gradient-to-br from-purple-800/90 to-[#2d1b4e]/95 border-l-2 border-b-2 border-[#fbbf24]/35"
          />
        </div>
      </div>
    </div>
  )
}
