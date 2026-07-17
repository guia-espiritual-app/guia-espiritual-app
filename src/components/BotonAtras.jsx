import { useNavigate } from 'react-router-dom'

export default function BotonAtras({ fallback = '/', className = '' }) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate(fallback)
    }
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label="Volver"
      className={`inline-flex items-center gap-1 text-[#fbbf24]/90 hover:text-[#fbbf24] text-sm font-medium transition-colors mb-3 ${className}`}
    >
      <span className="text-xl leading-none" aria-hidden="true">
        ←
      </span>
      <span>Volver</span>
    </button>
  )
}
