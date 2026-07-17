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
    <div className={`flex items-center gap-0 text-left ${className}`}>
      <img
        src={avatarSrc}
        alt={avatarAlt}
        className={`relative z-10 w-auto object-contain shrink-0 drop-shadow-[0_0_12px_rgba(251,191,36,0.25)] ${
          esHome
            ? 'h-[230px] max-w-[240px]'
            : 'h-[150px] max-w-[155px]'
        }`}
      />

      {/* Burbuja pegada a GU, un poco más arriba (altura de la cabeza/boca) */}
      <div
        className={`relative z-0 flex-1 min-w-0 -ml-1 ${
          esHome ? '-translate-y-7' : '-translate-y-3'
        }`}
      >
        <div
          className={`relative bg-gradient-to-br from-purple-800/95 to-[#2d1b4e] border-2 border-[#fbbf24]/45 rounded-2xl rounded-bl-sm shadow-[0_4px_20px_rgba(45,27,78,0.5)] ${
            esHome ? 'px-2.5 py-2' : 'px-3.5 py-3'
          }`}
        >
          {/* Cola del bocadillo: borde dorado + relleno (apunta a GU) */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-[-14px] top-[42%] w-0 h-0 border-y-[10px] border-y-transparent border-r-[14px] border-r-[#fbbf24]/45"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-[-11px] top-[calc(42%+1.5px)] w-0 h-0 border-y-[8.5px] border-y-transparent border-r-[12px] border-r-[#2d1b4e]"
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
