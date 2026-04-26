import { useState } from 'react'
import numerologiaData from '../data/numerologia.json'
import { saveNumerologyReading } from '../services/firestoreService'

export default function Numerologia() {
  const [nombre, setNombre] = useState('')
  const [fechaNacimiento, setFechaNacimiento] = useState('')
  const [resultado, setResultado] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  const calcularNumeroVida = (fecha) => {
    const numeros = fecha.replace(/\D/g, '')
    let suma = 0
    
    for (let i = 0; i < numeros.length; i++) {
      suma += parseInt(numeros[i])
    }
    
    while (suma > 9) {
      const sumaStr = suma.toString()
      suma = 0
      for (let i = 0; i < sumaStr.length; i++) {
        suma += parseInt(sumaStr[i])
      }
    }
    
    return suma
  }

  const calcular = (e) => {
    e.preventDefault()
    
    if (!nombre || !fechaNacimiento) {
      alert('Por favor completa todos los campos')
      return
    }

    const numeroVida = calcularNumeroVida(fechaNacimiento)
    const datosNumerologia = numerologiaData.numerologia_1_9.find(n => n.numero === numeroVida)
    
    setResultado({
      nombre,
      numeroVida,
      datos: datosNumerologia
    })
    setSaveMessage('')
  }

  const handleSaveReading = async () => {
    if (!resultado) return
    
    setSaving(true)
    setSaveMessage('')
    
    const result = await saveNumerologyReading(resultado.numeroVida, resultado.datos)
    
    if (result.success) {
      setSaveMessage('✅ Lectura de numerología guardada')
      setTimeout(() => setSaveMessage(''), 3000)
    } else {
      setSaveMessage('❌ Error al guardar')
    }
    
    setSaving(false)
  }

  const nuevaConsulta = () => {
    setNombre('')
    setFechaNacimiento('')
    setResultado(null)
    setSaveMessage('')
  }

  if (resultado) {
    return (
      <div className="max-w-md mx-auto px-4 pt-10 pb-4">
        <h1 className="text-3xl font-bold text-yellow-300 mb-6 text-center">🔢 Tu Número de Vida</h1>
        
        <div className="bg-gradient-to-br from-purple-900/90 to-purple-700/90 border-2 border-yellow-400/60 rounded-2xl p-8 shadow-[0_0_30px_rgba(212,175,55,0.3)] mb-6">
          <div className="text-center mb-6">
            <div className="text-8xl font-bold text-yellow-300 mb-2 drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]">
              {resultado.numeroVida}
            </div>
            <p className="text-2xl font-bold text-purple-100">{resultado.datos.arquetipo}</p>
          </div>

          <div className="space-y-4">
            <div className="bg-purple-800/40 border border-purple-600/60 rounded-xl p-4">
              <h3 className="text-yellow-300 font-bold mb-2">Energía Principal</h3>
              <p className="text-gray-200">{resultado.datos.energia_principal}</p>
            </div>

            <div className="bg-purple-800/40 border border-purple-600/60 rounded-xl p-4">
              <h3 className="text-yellow-300 font-bold mb-2">Descripción</h3>
              <p className="text-gray-200 italic">{resultado.datos.descripcion_breve}</p>
            </div>

            <div className="bg-purple-800/40 border border-purple-600/60 rounded-xl p-4">
              <h3 className="text-yellow-300 font-bold mb-2">Características</h3>
              <div className="flex flex-wrap gap-2">
                {resultado.datos.caracteristicas_generales.map((caracteristica, i) => (
                  <span
                    key={i}
                    className="text-xs bg-purple-600/30 text-purple-200 px-3 py-1 rounded-full border border-purple-600/60"
                  >
                    {caracteristica}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-900/20 border border-green-600/60 rounded-xl p-4">
                <h3 className="text-green-300 font-bold mb-2 text-sm">Fortalezas</h3>
                <ul className="space-y-1">
                  {resultado.datos.fortalezas.map((fortaleza, i) => (
                    <li key={i} className="text-xs text-gray-200">• {fortaleza}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-900/20 border border-red-600/60 rounded-xl p-4">
                <h3 className="text-red-300 font-bold mb-2 text-sm">Debilidades</h3>
                <ul className="space-y-1">
                  {resultado.datos.debilidades.map((debilidad, i) => (
                    <li key={i} className="text-xs text-gray-200">• {debilidad}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-600/60 rounded-xl p-4">
              <h3 className="text-yellow-300 font-bold mb-2">Aprendizaje Clave</h3>
              <p className="text-sm text-gray-200">{resultado.datos.aprendizaje_clave}</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveReading}
          disabled={saving}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-3"
        >
          {saving ? '💾 Guardando...' : '💾 Guardar Lectura'}
        </button>

        {saveMessage && (
          <p className="text-center text-sm mb-3 font-medium">
            {saveMessage}
          </p>
        )}

        <button
          onClick={nuevaConsulta}
          className="w-full bg-gradient-to-r from-yellow-600/80 to-yellow-500/80 border-2 border-yellow-400/60 rounded-xl py-3 px-6 text-purple-900 font-bold shadow-lg shadow-yellow-900/60 hover:shadow-yellow-500/40 transition-all duration-300 hover:scale-[1.02]"
        >
          ✨ Nueva Consulta
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-10 pb-4">
      <h1 className="text-3xl font-bold text-yellow-300 mb-2 text-center">🔢 Numerología</h1>
      <p className="text-purple-200 mb-6 text-center">
        Descubre tu número de vida y su significado profundo
      </p>

      <form onSubmit={calcular} className="bg-purple-900/40 border-2 border-purple-500/60 rounded-2xl p-8 shadow-lg shadow-purple-900/60">
        <div className="space-y-6">
          <div>
            <label className="block text-purple-200 mb-2 font-medium">
              Tu nombre completo
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: María García"
              className="w-full bg-black/30 border-2 border-purple-400 focus:border-yellow-300 rounded-xl px-4 py-3 text-purple-100 placeholder-purple-400/60 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-purple-200 mb-2 font-medium">
              Fecha de nacimiento
            </label>
            {(() => {
              const [y = '', m = '', d = ''] = (fechaNacimiento || '').split('-')
              const selectedYear = y
              const selectedMonth = m
              const selectedDay = d

              const years = Array.from({ length: 2026 - 1920 + 1 }, (_, i) => String(2026 - i))
              const months = [
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
              const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'))

              const updateFecha = (next) => {
                const nextYear = next.year ?? selectedYear
                const nextMonth = next.month ?? selectedMonth
                const nextDay = next.day ?? selectedDay
                const nextFecha =
                  nextYear && nextMonth && nextDay ? `${nextYear}-${nextMonth}-${nextDay}` : ''
                setFechaNacimiento(nextFecha)
              }

              const selectClass =
                'w-full bg-black/30 border-2 border-purple-400 focus:border-yellow-300 rounded-xl px-3 py-3 text-purple-100 outline-none transition-colors'

              return (
                <div className="flex gap-2">
                  <select
                    value={selectedDay}
                    onChange={(e) => updateFecha({ day: e.target.value })}
                    className={selectClass}
                  >
                    <option value="">Día</option>
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {parseInt(day, 10)}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedMonth}
                    onChange={(e) => updateFecha({ month: e.target.value })}
                    className={selectClass}
                  >
                    <option value="">Mes</option>
                    {months.map((mo) => (
                      <option key={mo.value} value={mo.value}>
                        {mo.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedYear}
                    onChange={(e) => updateFecha({ year: e.target.value })}
                    className={selectClass}
                  >
                    <option value="">Año</option>
                    {years.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>
              )
            })()}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-600/80 to-yellow-500/80 border-2 border-yellow-400/60 rounded-xl py-3 px-6 text-purple-900 font-bold text-lg shadow-lg shadow-yellow-900/60 hover:shadow-yellow-500/40 transition-all duration-300 hover:scale-[1.02]"
          >
            🔮 Calcular Mi Número
          </button>
        </div>
      </form>
    </div>
  )
}
