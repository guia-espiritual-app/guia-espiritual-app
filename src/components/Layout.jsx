import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/tarot', label: 'Tarot', icon: '🃏' },
  { to: '/horoscopo', label: 'Horóscopo', icon: '♈' },
  { to: '/numerologia', label: 'Numerología', icon: '🔢' },
  { to: '/perfil', label: 'Perfil', icon: '👤' },
]

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#1a1a2e] text-purple-100">
      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 bg-[#0f1020]/95 border-t border-purple-700/40 backdrop-blur-md">
        <div className="max-w-md mx-auto flex justify-around px-2 py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                [
                  'flex flex-col items-center justify-center flex-1 mx-0.5 py-1 rounded-xl transition-all duration-200',
                  'text-xs font-medium',
                  isActive
                    ? 'bg-gradient-to-t from-purple-800/80 to-purple-500/80 text-yellow-400 shadow-[0_0_18px_rgba(139,92,246,0.7)] border border-yellow-400/60'
                    : 'text-purple-300 hover:text-yellow-200 hover:bg-purple-800/40 border border-transparent',
                ].join(' ')
              }
            >
              <span className="text-xl mb-0.5">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
