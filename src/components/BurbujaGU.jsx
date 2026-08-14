import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase'
import guImg from '../assets/avatares/gu.png'
import mensajesGu from '../data/mensajes_gu.json'

function getNombreUsuario(user) {
  const completo = user?.displayName?.trim()
  if (!completo) return 'alma viajera'
  return completo.split(/\s+/)[0]
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
  const esHome = seccion === 'inicio'

  return (
    <div
      className={`flex items-center gap-0 text-left ${
        esHome ? 'justify-center -translate-x-6' : ''
      } ${className}`}
    >
      <img
        src={avatarSrc}
        alt={avatarAlt}
        className={`relative z-10 w-auto object-contain shrink-0 drop-shadow-[0_0_12px_rgba(251,191,36,0.25)] ${
          esHome
            ? 'h-[230px] max-w-[240px] -mr-10'
            : 'h-[150px] max-w-[155px] -mr-2'
        }`}
      />

      {/* Burbuja pegada a GU (globo de diálogo) */}
      <div
        className={`relative z-0 min-w-0 ${
          esHome
            ? 'w-[min(52%,13.5rem)] -ml-3 -translate-y-4'
            : 'flex-1 -translate-y-2'
        }`}
      >
        <div
          className={`relative bg-gradient-to-br from-purple-800/95 to-[#2d1b4e] border-2 border-[#fbbf24]/45 rounded-2xl rounded-bl-sm shadow-[0_4px_20px_rgba(45,27,78,0.5)] ${
            esHome ? 'px-2.5 py-2' : 'px-3.5 py-3'
          }`}
        >
          {/* Cola del bocadillo: casi tocando a GU */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-[-8px] top-[40%] w-0 h-0 border-y-[7px] border-y-transparent border-r-[9px] border-r-[#fbbf24]/45"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-[-5px] top-[calc(40%+1.5px)] w-0 h-0 border-y-[5.5px] border-y-transparent border-r-[7px] border-r-[#2d1b4e]"
          />

          <p
            className={`text-purple-100 leading-snug ${
              esHome ? 'text-xs' : 'text-sm leading-relaxed'
            }`}
          >
            {mensaje}
          </p>
        </div>
      </div>
    </div>
  )
}
