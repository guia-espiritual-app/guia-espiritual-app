import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/')
    } catch (err) {
      setError('No pudimos iniciar sesión. Revisa tus datos o intenta de nuevo.')
      console.error(err)
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
      setError('Ocurrió un error con Google. Intenta nuevamente.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#0f1020] px-4">
      <div className="w-full max-w-md bg-purple-900/40 border-2 border-purple-500/70 rounded-2xl p-8 shadow-2xl shadow-purple-900/70">
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🔮</div>
          <h1 className="text-2xl font-bold text-yellow-300 mb-1">Guía Espiritual</h1>
          <p className="text-purple-200 text-sm">Ingresa para continuar tu viaje místico</p>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-5">
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
              placeholder="Tu contraseña"
              required
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
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
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
          className="w-full flex items-center justify-center gap-2 bg-purple-600/70 hover:bg-purple-500/80 border-2 border-purple-300/80 rounded-xl py-3 px-6 text-purple-50 font-semibold shadow-lg shadow-purple-900/70 hover:shadow-purple-500/60 hover:scale-[1.02] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="bg-white rounded-full p-1">
            <span className="text-[18px] text-[#4285F4] font-bold">G</span>
          </span>
          <span>{loading ? 'Cargando...' : 'Continuar con Google'}</span>
        </button>

        <p className="mt-6 text-center text-sm text-purple-200">
          ¿No tienes cuenta?{' '}
          <Link
            to="/register"
            className="text-yellow-300 font-semibold hover:text-yellow-200 underline-offset-2 hover:underline"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}

