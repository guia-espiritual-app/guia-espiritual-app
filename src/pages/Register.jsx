import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const mapFirebaseError = (code) => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Este correo ya está registrado. Intenta iniciar sesión.'
      case 'auth/weak-password':
        return 'La contraseña es demasiado débil. Usa al menos 6 caracteres seguros.'
      case 'auth/invalid-email':
        return 'El correo electrónico no es válido.'
      default:
        return 'Ocurrió un error al crear tu cuenta. Intenta de nuevo.'
    }
  }

  const handleEmailRegister = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)

    try {
      await createUserWithEmailAndPassword(auth, email, password)
      navigate('/')
    } catch (err) {
      console.error(err)
      setError(mapFirebaseError(err.code))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
      navigate('/')
    } catch (err) {
      console.error(err)
      setError('Ocurrió un error con Google. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#0f1020] px-4">
      <div className="w-full max-w-md bg-purple-900/40 border-2 border-purple-500/70 rounded-2xl p-8 shadow-2xl shadow-purple-900/70">
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🔮</div>
          <h1 className="text-2xl font-bold text-yellow-300 mb-1">Crear Cuenta</h1>
          <p className="text-purple-200 text-sm">Únete para iniciar tu viaje espiritual</p>
        </div>

        <form onSubmit={handleEmailRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-yellow-300 mb-2" htmlFor="name">
              Nombre completo
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/30 border-2 border-purple-400/70 rounded-xl px-4 py-3 text-purple-100 placeholder-purple-400/60 focus:outline-none focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/40 transition-all duration-200"
              placeholder="Tu nombre completo"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-yellow-300 mb-2" htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/30 border-2 border-purple-400/70 rounded-xl px-4 py-3 text-purple-100 placeholder-purple-400/60 focus:outline-none focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/40 transition-all duration-200"
              placeholder="tu@correo.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-yellow-300 mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/30 border-2 border-purple-400/70 rounded-xl px-4 py-3 text-purple-100 placeholder-purple-400/60 focus:outline-none focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/40 transition-all duration-200"
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-yellow-300 mb-2" htmlFor="confirmPassword">
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-black/30 border-2 border-purple-400/70 rounded-xl px-4 py-3 text-purple-100 placeholder-purple-400/60 focus:outline-none focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/40 transition-all duration-200"
              placeholder="Repite tu contraseña"
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-900/20 border border-red-500/40 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-600/90 to-yellow-500/90 border-2 border-yellow-400/80 rounded-xl py-3 px-6 text-purple-900 font-bold text-base shadow-lg shadow-yellow-900/70 hover:shadow-yellow-500/50 hover:scale-[1.02] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Cargando...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-purple-700/60" />
          <span className="mx-3 text-xs text-purple-300">o continuar con</span>
          <div className="flex-1 h-px bg-purple-700/60" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl border-2 border-purple-300 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-white"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          {loading ? 'Cargando...' : 'Continuar con Google'}
        </button>

        <p className="mt-6 text-center text-sm text-purple-200">
          ¿Ya tienes cuenta?{' '}
          <Link
            to="/login"
            className="text-yellow-300 font-semibold hover:text-yellow-200 underline-offset-2 hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}

