import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../firebase'
import logoGuia from '../assets/logo-guia.png'

function mensajeErrorReset(code) {
  switch (code) {
    case 'auth/invalid-email':
      return 'El formato del correo no es válido.'
    case 'auth/user-not-found':
      return 'No encontramos una cuenta con ese correo.'
    case 'auth/missing-email':
      return 'Escribe tu correo para recuperar la contraseña.'
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Espera un momento e inténtalo de nuevo.'
    case 'auth/network-request-failed':
      return 'Sin conexión. Revisa tu internet e inténtalo de nuevo.'
    default:
      return 'No pudimos enviar el correo de recuperación. Intenta de nuevo.'
  }
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [resetMessage, setResetMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setError('')
    setResetMessage('')
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

  const handleForgotPassword = async () => {
    setError('')
    setResetMessage('')

    const correo = email.trim()
    if (!correo) {
      setError('Escribe tu correo primero para recuperar la contraseña.')
      return
    }

    setResetting(true)
    try {
      await sendPasswordResetEmail(auth, correo)
      setResetMessage(
        'Te enviamos un correo para restablecer tu contraseña. Revisa tu bandeja de entrada.'
      )
    } catch (err) {
      setError(mensajeErrorReset(err.code))
      console.error(err)
    } finally {
      setResetting(false)
    }
  }

  // Guideline 4.8: en iOS nativo no se ofrece "Iniciar sesión con Google".
  // No hay botón de Google en ninguna plataforma; Android y web siguen solo con correo.

  // const handleGoogleLogin = async () => {
  //   setError('')
  //   setLoading(true)
  //   try {
  //     await signInWithPopup(auth, googleProvider)
  //     navigate('/')
  //   } catch (err) {
  //     setError('Ocurrió un error con Google. Intenta nuevamente.')
  //     console.error(err)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#0f1020] px-4">
      <div className="w-full max-w-md bg-purple-900/40 border-2 border-purple-500/70 rounded-2xl p-8 shadow-2xl shadow-purple-900/70">
        <div className="text-center mb-8">
          <img
            src={logoGuia}
            alt="Guía Espiritual"
            className="mx-auto mb-2 max-w-[220px] w-full h-auto"
          />
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
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/30 border-2 border-purple-400/70 rounded-xl px-4 py-3 pr-12 text-purple-100 placeholder-purple-400/60 focus:outline-none focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/40 transition-all duration-200"
                placeholder="Tu contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-[#fbbf24]/80 hover:text-[#fbbf24] transition-colors"
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={loading || resetting}
                className="text-sm text-[#fbbf24]/90 hover:text-[#fbbf24] underline-offset-2 hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resetting ? 'Enviando...' : '¿Olvidaste tu contraseña?'}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-900/20 border border-red-500/40 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          {resetMessage && (
            <p className="text-[#fbbf24] text-sm bg-[#2d1b4e]/80 border border-[#fbbf24]/40 rounded-xl px-3 py-2">
              {resetMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || resetting}
            className="w-full bg-gradient-to-r from-yellow-600/90 to-yellow-500/90 border-2 border-yellow-400/80 rounded-xl py-3 px-6 text-purple-900 font-bold text-base shadow-lg shadow-yellow-900/70 hover:shadow-yellow-500/50 hover:scale-[1.02] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>

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

