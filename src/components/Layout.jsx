import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import iconTienda from '../assets/avatares/tienda.png'
import iconAcademia from '../assets/avatares/academia.png'
import iconConsulta from '../assets/avatares/consulta.png'

const navItems = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/tienda', label: 'Tienda', avatar: iconTienda },
  { to: '/academia', label: 'Academia', avatar: iconAcademia },
  { to: '/perfil', label: 'Perfil', icon: '👤' },
]

const navClass = ({ isActive }) =>
  [
    'flex flex-col items-center justify-center flex-1 mx-0.5 py-1 rounded-xl transition-all duration-200',
    'text-xs font-medium',
    isActive
      ? 'bg-gradient-to-t from-purple-800/80 to-purple-500/80 text-yellow-400 shadow-[0_0_18px_rgba(139,92,246,0.7)] border border-yellow-400/60'
      : 'text-purple-300 hover:text-yellow-200 hover:bg-purple-800/40 border border-transparent',
  ].join(' ')

const navIdleClass =
  'flex flex-col items-center justify-center flex-1 mx-0.5 py-1 rounded-xl transition-all duration-200 text-xs font-medium text-purple-300 hover:text-yellow-200 hover:bg-purple-800/40 border border-transparent'

function NavIcon({ item }) {
  return (
    <span className="mb-0.5 flex h-8 items-center justify-center">
      {item.avatar ? (
        <img src={item.avatar} alt="" className="h-8 w-8 object-contain" />
      ) : (
        <span className="text-xl">{item.icon}</span>
      )}
    </span>
  )
}

function ConsultaTab() {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate('/', { state: { openConsulta: true } })}
      className={navIdleClass}
      aria-label="Consulta Personalizada"
    >
      <NavIcon item={{ avatar: iconConsulta }} />
      <span>Consulta</span>
    </button>
  )
}

export default function Layout() {
  const { pathname } = useLocation()
  const juegoPantallaCompleta = pathname === '/juego'

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#1a1a2e] text-purple-100 ${
        juegoPantallaCompleta ? 'h-dvh overflow-hidden' : ''
      }`}
    >
      <main className={juegoPantallaCompleta ? 'flex-1 relative z-10' : 'flex-1 pt-3 pb-20 relative z-10'}>
        <Outlet />
      </main>

      {!juegoPantallaCompleta && (
      <nav className="fixed inset-x-0 bottom-0 z-50 bg-[#0f1020]/95 border-t border-purple-700/40 backdrop-blur-md">
        <div className="max-w-md mx-auto flex justify-around px-2 py-2">
          {navItems.slice(0, 3).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={navClass}
            >
              <NavIcon item={item} />
              <span>{item.label}</span>
            </NavLink>
          ))}

          <ConsultaTab />

          {navItems.slice(3).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={navClass}
            >
              <NavIcon item={item} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
      )}
    </div>
  )
}
