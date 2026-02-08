export function getDevCoords(): { lat: number; lon: number } | null {
  const lat = import.meta.env.VITE_DEV_LAT
  const lon = import.meta.env.VITE_DEV_LON
  if (lat == null || lon == null) return null
  const latN = parseFloat(lat)
  const lonN = parseFloat(lon)
  if (Number.isNaN(latN) || Number.isNaN(lonN)) return null
  if (latN < -90 || latN > 90 || lonN < -180 || lonN > 180) return null
  return { lat: latN, lon: lonN }
}

export function toApiError(e: unknown): string {
  const msg = e instanceof Error ? e.message : 'Ошибка сети или API'
  return msg.includes('VITE_OPENWEATHER_API_KEY') ? 'Добавьте VITE_OPENWEATHER_API_KEY в файл .env' : msg
}
