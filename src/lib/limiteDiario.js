import { Capacitor } from '@capacitor/core'
import { Preferences } from '@capacitor/preferences'

/** Configuración de límites por servicio (usuarios no premium). */
export const LIMITES_SERVICIO = {
  tarot: { clave: 'ultimaLectura_tarot', periodo: 'diario' },
  horoscopo: { clave: 'ultimaLectura_horoscopo', periodo: 'semanal' },
  numerologia: { clave: 'ultimaLectura_numerologia', periodo: 'diario' },
  cartaAstral: { clave: 'ultimaLectura_cartaAstral', periodo: 'diario' },
  registros: { clave: 'ultimaLectura_registros', periodo: 'diario' },
}

/** @deprecated usar LIMITES_SERVICIO */
export const CLAVES_LECTURA = Object.fromEntries(
  Object.entries(LIMITES_SERVICIO).map(([k, v]) => [k, v.clave])
)

export function getFechaLocalHoy(fecha = new Date()) {
  const year = fecha.getFullYear()
  const month = String(fecha.getMonth() + 1).padStart(2, '0')
  const day = String(fecha.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Parsea YYYY-MM-DD como fecha local (medianoche). */
export function parseFechaLocal(fechaStr) {
  if (!fechaStr || !/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) return null
  const [y, m, d] = fechaStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/**
 * Clave de semana calendario local (domingo → sábado).
 * Formato: YYYY-MM-DD del domingo de esa semana.
 */
export function getClaveSemanaLocal(fecha = new Date()) {
  const d = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate())
  const day = d.getDay() // 0 = domingo
  d.setDate(d.getDate() - day)
  return getFechaLocalHoy(d)
}

export function diasEntre(fechaA, fechaB) {
  const a = new Date(fechaA.getFullYear(), fechaA.getMonth(), fechaA.getDate())
  const b = new Date(fechaB.getFullYear(), fechaB.getMonth(), fechaB.getDate())
  return Math.floor((b.getTime() - a.getTime()) / 86400000)
}

/**
 * true = ya usó el cupo gratuito y está bloqueado.
 * Diario: misma fecha local.
 * Semanal: misma semana calendario Y menos de 7 días desde la última lectura.
 */
export function limiteAlcanzadoParaPeriodo(ultimaFechaStr, periodo) {
  if (!ultimaFechaStr) return false

  const ultima = parseFechaLocal(ultimaFechaStr)
  if (!ultima) return false

  const hoy = new Date()

  if (periodo === 'semanal') {
    const mismaSemana = getClaveSemanaLocal(ultima) === getClaveSemanaLocal(hoy)
    const menosDe7Dias = diasEntre(ultima, hoy) < 7
    return mismaSemana && menosDe7Dias
  }

  // diario
  return getFechaLocalHoy(ultima) === getFechaLocalHoy(hoy)
}

async function leerValor(clave) {
  if (Capacitor.getPlatform() === 'web') {
    return localStorage.getItem(clave)
  }

  const { value } = await Preferences.get({ key: clave })
  return value
}

async function escribirValor(clave, valor) {
  if (Capacitor.getPlatform() === 'web') {
    localStorage.setItem(clave, valor)
    return
  }

  await Preferences.set({ key: clave, value: valor })
}

export async function getUltimaLectura(clave) {
  return leerValor(clave)
}

export async function guardarUltimaLectura(clave, fecha = getFechaLocalHoy()) {
  await escribirValor(clave, fecha)
}

export async function yaUsoLecturaHoy(clave) {
  const ultima = await getUltimaLectura(clave)
  return limiteAlcanzadoParaPeriodo(ultima, 'diario')
}
