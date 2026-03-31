import { Navigate } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase'

export default function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#0f1020]">
        <div className="flex flex-col items-center gap-3">
          <div className="text-5xl animate-spin">🔮</div>
          <p className="text-purple-300 text-sm">Cargando tu viaje místico...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

