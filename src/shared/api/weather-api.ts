import axios, { type AxiosInstance } from 'axios'
import type { GeoLocationItem, OpenWeatherResponse } from '@/entities/weather/types'

const WEATHER_BASE = 'https://api.openweathermap.org/data/2.5'
const GEO_BASE = 'https://api.openweathermap.org/geo/1.0'

function getApiKey(): string {
  const key = import.meta.env.VITE_OPENWEATHER_API_KEY
  if (!key) {
    throw new Error('VITE_OPENWEATHER_API_KEY is not set in .env')
  }
  return key
}

function createWeatherClient(): AxiosInstance {
  return axios.create({
    baseURL: WEATHER_BASE,
    timeout: 10000,
    params: {
      appid: getApiKey(),
      units: 'metric',
      lang: 'ru',
    },
  })
}

let weatherClient: AxiosInstance | null = null

function getWeatherClient(): AxiosInstance {
  if (!weatherClient) {
    weatherClient = createWeatherClient()
  }
  return weatherClient
}

export async function fetchWeatherByCoords(lat: number, lon: number): Promise<OpenWeatherResponse> {
  const { data } = await getWeatherClient().get<OpenWeatherResponse>('/weather', {
    params: { lat, lon },
  })
  return data
}

export async function fetchCitySuggestions(q: string, limit = 5): Promise<GeoLocationItem[]> {
  const trimmed = q.trim()
  if (!trimmed) return []
  const key = getApiKey()
  const { data } = await axios.get<GeoLocationItem[]>(`${GEO_BASE}/direct`, {
    timeout: 10000,
    params: {
      q: trimmed,
      limit,
      appid: key,
    },
  })
  if (!Array.isArray(data)) return []
  return data.map((item) => ({
    name: item.name,
    lat: item.lat,
    lon: item.lon,
    country: item.country,
  }))
}

export async function fetchCoordsByCity(q: string): Promise<GeoLocationItem | null> {
  const list = await fetchCitySuggestions(q, 1)
  const first = list[0]
  return first ?? null
}

export async function fetchWeatherByCity(q: string): Promise<OpenWeatherResponse> {
  const coords = await fetchCoordsByCity(q)
  if (!coords) {
    const err = new Error('Город не найден') as Error & { response?: { status: number } }
    err.response = { status: 404 }
    throw err
  }
  return fetchWeatherByCoords(coords.lat, coords.lon)
}
