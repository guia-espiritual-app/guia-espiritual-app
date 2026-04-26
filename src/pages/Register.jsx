import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

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

  // Temporalmente deshabilitado para Android nativo (se puede restaurar fácil)
  // const handleGoogleLogin = async () => {
  //   setError('')
  //   setLoading(true)
  //   try {
  //     await signInWithPopup(auth, googleProvider)
  //     navigate('/')
  //   } catch (err) {
  //     console.error(err)
  //     setError('Ocurrió un error con Google. Intenta nuevamente.')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

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

