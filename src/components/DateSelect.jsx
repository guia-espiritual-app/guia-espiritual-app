import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

const MONTHS = [
  { value: '01', label: 'Enero' },
  { value: '02', label: 'Febrero' },
  { value: '03', label: 'Marzo' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Mayo' },
  { value: '06', label: 'Junio' },
  { value: '07', label: 'Julio' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Septiembre' },
  { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' },
  { value: '12', label: 'Diciembre' },
]

const YEARS = Array.from({ length: 2026 - 1920 + 1 }, (_, i) => String(2026 - i))
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'))

const FIELD_CLASS =
  'flex-1 min-w-0 bg-black/30 border-2 border-purple-400 focus:border-yellow-300 rounded-xl px-3 py-3 text-purple-100 outline-none transition-colors touch-manipulation cursor-pointer text-left'

export default function DateSelect({ value = '', onChange, required = false }) {
  const [picker, setPicker] = useState(null)

  // Guardamos cada parte por separado en estado local
  const [parts, setParts] = useState({ y: '', m: '', d: '' })

  // Sincroniza si llega un value externo ya formado
  useEffect(() => {
    if (value) {
      const [yy = '', mm = '', dd = ''] = value.split('-')
      setParts({ y: yy, m: mm, d: dd })
    }
  }, [value])

  const { y, m, d } = parts

  useEffect(() => {
    if (picker) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [picker])

  const updatePart = (part, nextValue) => {
    const key = part === 'year' ? 'y' : part === 'month' ? 'm' : 'd'
    const next = { ...parts, [key]: nextValue }
    setParts(next)
    // Solo notifica al padre la fecha completa cuando las 3 partes existen
    if (next.y && next.m && next.d) {
      onChange(`${next.y}-${next.m}-${next.d}`)
    } else {
      onChange('') // aún incompleta
    }
    setPicker(null)
  }

  const pickerOptions =
    picker === 'day'
      ? DAYS.map((day) => ({ value: day, label: String(parseInt(day, 10)) }))
      : picker === 'month'
        ? MONTHS
        : picker === 'year'
          ? YEARS.map((year) => ({ value: year, label: year }))
          : []

  const pickerTitle =
    picker === 'day' ? 'Día' : picker === 'month' ? 'Mes' : picker === 'year' ? 'Año' : ''

  const currentPickerValue = picker === 'day' ? d : picker === 'month' ? m : picker === 'year' ? y : ''

  const modal = picker ? (
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/60"
      onClick={() => setPicker(null)}
      role="presentation"
    >
      <div
        className="w-full max-w-md max-h-[70vh] bg-[#1a1a2e] border-t-2 border-purple-500/60 rounded-t-2xl shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={`Seleccionar ${pickerTitle}`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-purple-700/40">
          <h3 className="text-yellow-300 font-bold">Seleccionar {pickerTitle}</h3>
          <button
            type="button"
            onClick={() => setPicker(null)}
            className="text-purple-300 hover:text-yellow-300 px-2 py-1 touch-manipulation"
          >
            Cerrar
          </button>
        </div>
        <ul className="overflow-y-auto flex-1 p-2">
          {pickerOptions.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => updatePart(picker, option.value)}
                className={`w-full text-left px-4 py-3 rounded-xl mb-1 touch-manipulation transition-colors ${
                  currentPickerValue === option.value
                    ? 'bg-purple-600/60 text-yellow-300 font-semibold'
                    : 'text-purple-100 hover:bg-purple-800/50'
                }`}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  ) : null

  return (
    <>
      <div className="flex gap-2">
        <button type="button" onClick={() => setPicker('day')} className={FIELD_CLASS}>
          {d ? parseInt(d, 10) : 'Día'}
        </button>
        <button type="button" onClick={() => setPicker('month')} className={FIELD_CLASS}>
          {m ? MONTHS.find((mo) => mo.value === m)?.label : 'Mes'}
        </button>
        <button type="button" onClick={() => setPicker('year')} className={FIELD_CLASS}>
          {y || 'Año'}
        </button>
      </div>

      {required && (
        <input
          type="text"
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
          value={value}
          required
          readOnly
          onChange={() => {}}
        />
      )}

      {modal && createPortal(modal, document.body)}
    </>
  )
}