import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase'

export default function Perfil() {
  const [user, loading] = useAuthState(auth)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    setLogoutLoading(true)
    try {
      await signOut(auth)
      navigate('/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      alert('Ocurrió un error al cerrar sesión. Intenta nuevamente.')
    } finally {
      setLogoutLoading(false)
    }
  }

  const handleEnableNotifications = async () => {
    try {
      if (window.OneSignal) {
        await window.OneSignal.Slidedown.promptPush()
        alert('¡Notificaciones activadas! Recibirás la frase del día.')
      } else {
        alert('OneSignal no está cargado. Recarga la página.')
      }
    } catch (error) {
      console.error('Error enabling notifications:', error)
      alert('Error al activar notificaciones.')
    }
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 pt-10 pb-4 text-center">
        <p className="text-purple-300">Cargando perfil...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 pt-10 pb-4 text-center">
        <p className="text-red-400">No se pudo cargar tu perfil.</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-5 pt-10 pb-24">
      {/* Header */}
      <header className="text-center mb-8">
        <div className="text-5xl mb-2">👤</div>
        <h1 className="text-3xl font-bold text-yellow-300 mb-1">Mi Perfil</h1>
      </header>

      {/* Tarjeta de información del usuario */}
      <div className="bg-purple-900/40 border-2 border-purple-500/60 rounded-2xl p-6 shadow-lg shadow-purple-900/60 mb-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Foto de perfil o avatar genérico */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center border-4 border-yellow-400/60 shadow-lg">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="Foto de perfil"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-4xl">🔮</span>
            )}
          </div>

          {/* Nombre */}
          <div>
            <h2 className="text-yellow-300 font-bold text-xl mb-1">
              {user.displayName || 'Usuario'}
            </h2>
          </div>

          {/* Email */}
          <div className="w-full">
            <p className="text-purple-200 text-sm mb-1">Correo electrónico</p>
            <p className="text-gray-300 text-base break-all">{user.email}</p>
          </div>
        </div>
      </div>

      <button
  onClick={() => navigate('/historial')}
  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 mb-3"
>
  📜 Ver Historial de Lecturas
</button>
<button
  onClick={() => navigate('/planes')}
  className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-purple-900 font-bold py-3 px-6 rounded-xl transition-all duration-200 mb-3"
>
<button
  onClick={handleEnableNotifications}
  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 mb-3"
>
  🔔 Activar Notificaciones
</button>

  ⭐ Ver Planes Premium
</button>

      {/* Botón de cerrar sesión */}
      <button
        onClick={handleLogout}
        disabled={logoutLoading}
        className="w-full bg-gradient-to-r from-red-600/90 to-red-500/90 hover:from-red-700 hover:to-red-600 border-2 border-red-500/60 rounded-xl py-3 px-6 text-white font-bold text-base shadow-lg shadow-red-900/60 hover:shadow-red-500/50 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {logoutLoading ? 'Cerrando sesión...' : 'Cerrar Sesión'}
      </button>
    </div>
  )
}
