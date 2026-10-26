import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { Capacitor } from '@capacitor/core'
import { auth, db } from '../firebase'
import { usePremium } from '../contexts/PremiumContext'

export default function Perfil() {
  const [user, loading] = useAuthState(auth)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [savingName, setSavingName] = useState(false)
  const [nameMessage, setNameMessage] = useState('')
  const [nameError, setNameError] = useState('')
  const [deleteStep, setDeleteStep] = useState(null)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deleting, setDeleting] = useState(false)
  const { isPremium } = usePremium()
  const navigate = useNavigate()

  useEffect(() => {
    setDisplayName(user?.displayName || '')
  }, [user?.displayName, user?.uid])

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
    if (Capacitor.isNativePlatform()) {
      alert('Las notificaciones en la app nativa se configurarán próximamente.')
      return
    }

    try {
      if (window.OneSignal?.Slidedown?.promptPush) {
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

  const startEditName = () => {
    setNameInput(displayName || '')
    setNameMessage('')
    setNameError('')
    setEditingName(true)
  }

  const cancelEditName = () => {
    setEditingName(false)
    setNameInput('')
    setNameError('')
  }

  const borrarDatosFirestore = async (uid) => {
    const readings = await getDocs(collection(db, 'users', uid, 'readings'))
    await Promise.all(readings.docs.map((item) => deleteDoc(item.ref)))
    await deleteDoc(doc(db, 'users', uid))
  }

  const eliminarUsuarioAuth = async (currentUser, password) => {
    try {
      await deleteUser(currentUser)
    } catch (error) {
      if (error?.code !== 'auth/requires-recent-login') throw error
      if (!password) {
        const recentLogin = new Error('Se necesita la contraseña reciente.')
        recentLogin.code = 'auth/requires-recent-login'
        throw recentLogin
      }
      const credential = EmailAuthProvider.credential(currentUser.email, password)
      await reauthenticateWithCredential(currentUser, credential)
      await deleteUser(currentUser)
    }
  }

  const handleDeleteAccount = async () => {
    const currentUser = auth.currentUser
    if (!currentUser) return

    setDeleting(true)
    setDeleteError('')

    try {
      await borrarDatosFirestore(currentUser.uid)
      await eliminarUsuarioAuth(currentUser, deletePassword)
      navigate('/login')
    } catch (error) {
      console.error('Error al eliminar cuenta:', error)
      if (error?.code === 'auth/requires-recent-login') {
        setDeleteStep('password')
        setDeleteError('Por seguridad, escribe tu contraseña para confirmar el borrado.')
      } else if (error?.code === 'auth/wrong-password' || error?.code === 'auth/invalid-credential') {
        setDeleteStep('password')
        setDeleteError('La contraseña no es correcta. Inténtalo de nuevo.')
      } else {
        setDeleteError('No pudimos eliminar la cuenta. Intenta de nuevo en unos minutos.')
      }
    } finally {
      setDeleting(false)
    }
  }

  const handleSaveName = async () => {
    const nombre = nameInput.trim()
    if (!nombre) {
      setNameError('Escribe tu nombre para continuar.')
      return
    }

    setSavingName(true)
    setNameError('')
    setNameMessage('')

    try {
      await updateProfile(user, { displayName: nombre })
      await user.reload()
      setDisplayName(nombre)
      setEditingName(false)
      setNameMessage('Nombre actualizado. GU te saludará con tu nombre.')
    } catch (error) {
      console.error('Error al actualizar nombre:', error)
      setNameError('No pudimos guardar tu nombre. Intenta de nuevo.')
    } finally {
      setSavingName(false)
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
      <header className="text-center mb-8">
        <div className="text-5xl mb-2">👤</div>
        <h1 className="text-3xl font-bold text-yellow-300 mb-1">Mi Perfil</h1>
      </header>

      <div className="bg-purple-900/40 border-2 border-purple-500/60 rounded-2xl p-6 shadow-lg shadow-purple-900/60 mb-6">
        <div className="flex flex-col items-center text-center space-y-4">
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

          <div className="w-full">
            {editingName ? (
              <div className="space-y-3">
                <label className="block text-purple-200 text-sm mb-1" htmlFor="displayName">
                  Tu nombre
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Ej: María"
                  className="w-full bg-black/30 border-2 border-purple-400 focus:border-[#fbbf24] rounded-xl px-4 py-3 text-purple-100 placeholder-purple-400/60 outline-none transition-colors"
                  disabled={savingName}
                />
                {nameError && (
                  <p className="text-red-400 text-sm">{nameError}</p>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveName}
                    disabled={savingName}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-[#fbbf24] text-[#2d1b4e] font-bold py-2.5 px-4 rounded-xl disabled:opacity-50"
                  >
                    {savingName ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditName}
                    disabled={savingName}
                    className="flex-1 bg-purple-800/60 border border-purple-500/50 text-purple-200 font-medium py-2.5 px-4 rounded-xl disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-yellow-300 font-bold text-xl mb-1">
                  {displayName || 'Usuario'}
                </h2>
                {!displayName && (
                  <p className="text-purple-300 text-xs mb-2">
                    Aún no tienes nombre. Agrégalo para que GU te salude.
                  </p>
                )}
                <button
                  type="button"
                  onClick={startEditName}
                  className="text-sm text-[#fbbf24]/90 hover:text-[#fbbf24] underline-offset-2 hover:underline transition-colors"
                >
                  {displayName ? 'Editar nombre' : 'Agregar nombre'}
                </button>
              </>
            )}

            {nameMessage && (
              <p className="mt-3 text-[#fbbf24] text-sm bg-[#2d1b4e]/80 border border-[#fbbf24]/40 rounded-xl px-3 py-2">
                {nameMessage}
              </p>
            )}
          </div>

          <div className="w-full">
            <p className="text-purple-200 text-sm mb-1">Correo electrónico</p>
            <p className="text-gray-300 text-base break-all">{user.email}</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate('/historial')}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 mb-3"
      >
        📜 Ver Historial de Lecturas
      </button>

      <button
        type="button"
        onClick={() => navigate('/planes')}
        className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-purple-900 font-bold py-3 px-6 rounded-xl transition-all duration-200 mb-3"
      >
        ⭐ Ver Planes Premium
      </button>

      <button
        type="button"
        onClick={handleEnableNotifications}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 mb-3"
      >
        🔔 Activar Notificaciones
      </button>

      <button
        type="button"
        onClick={() => {
          setDeleteError('')
          setDeletePassword('')
          setDeleteStep('confirm1')
        }}
        className="w-full border border-red-400/50 text-red-200 font-medium py-3 px-6 rounded-xl mb-3 hover:bg-red-950/40 transition-colors"
      >
        Eliminar mi cuenta
      </button>

      {deleteStep && (
        <div className="mb-4 rounded-2xl border-2 border-red-500/50 bg-red-950/40 px-4 py-4 text-left">
          {deleteStep === 'confirm1' && (
            <>
              <p className="text-red-100 text-sm leading-relaxed mb-3">
                Esta acción es permanente. Se borrarán tu perfil, tus lecturas y el acceso a esta cuenta.
              </p>
              {isPremium && (
                <p className="text-yellow-200 text-sm leading-relaxed mb-3">
                  Tienes una suscripción activa. Eliminar la cuenta no cancela el cobro: cancélala en la App Store, Google Play o PayPal antes de continuar.
                </p>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteStep('confirm2')}
                  className="flex-1 bg-red-600 text-white font-bold py-2.5 rounded-xl"
                >
                  Continuar
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteStep(null)}
                  className="flex-1 border border-purple-400/50 text-purple-100 py-2.5 rounded-xl"
                >
                  Cancelar
                </button>
              </div>
            </>
          )}

          {deleteStep === 'confirm2' && (
            <>
              <p className="text-red-100 text-sm leading-relaxed mb-3">
                Esta acción es permanente. No podrás recuperar la cuenta ni las lecturas guardadas.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="flex-1 bg-red-600 text-white font-bold py-2.5 rounded-xl disabled:opacity-50"
                >
                  {deleting ? 'Eliminando...' : 'Sí, eliminar mi cuenta'}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteStep(null)}
                  disabled={deleting}
                  className="flex-1 border border-purple-400/50 text-purple-100 py-2.5 rounded-xl"
                >
                  Cancelar
                </button>
              </div>
            </>
          )}

          {deleteStep === 'password' && (
            <>
              <p className="text-red-100 text-sm leading-relaxed mb-3">
                Firebase pide una sesión reciente. Escribe tu contraseña para terminar de eliminar la cuenta.
              </p>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Tu contraseña"
                autoComplete="current-password"
                className="w-full mb-3 bg-black/30 border border-red-400/40 rounded-xl px-4 py-3 text-purple-100 outline-none"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleting || !deletePassword.trim()}
                  className="flex-1 bg-red-600 text-white font-bold py-2.5 rounded-xl disabled:opacity-50"
                >
                  {deleting ? 'Eliminando...' : 'Confirmar borrado'}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteStep(null)}
                  disabled={deleting}
                  className="flex-1 border border-purple-400/50 text-purple-100 py-2.5 rounded-xl"
                >
                  Cancelar
                </button>
              </div>
            </>
          )}

          {deleteError && (
            <p className="mt-3 text-red-200 text-xs leading-relaxed">{deleteError}</p>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={handleLogout}
        disabled={logoutLoading}
        className="w-full bg-gradient-to-r from-red-600/90 to-red-500/90 hover:from-red-700 hover:to-red-600 border-2 border-red-500/60 rounded-xl py-3 px-6 text-white font-bold text-base shadow-lg shadow-red-900/60 hover:shadow-red-500/50 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {logoutLoading ? 'Cerrando sesión...' : 'Cerrar Sesión'}
      </button>
    </div>
  )
}
