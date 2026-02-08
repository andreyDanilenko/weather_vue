import { ref, computed } from 'vue'
import { fetchWeatherByCoords, fetchWeatherByCity } from '@/shared/api/weather-api'
import { toWeatherDisplay, type WeatherDisplay } from '@/entities/weather'
import { useGeolocation } from './use-geolocation'

export function useWeather() {
  const { getCurrentPosition, error: geoError, loading: geoLoading } = useGeolocation()
  const weather = ref<WeatherDisplay | null>(null)
  const apiError = ref<string | null>(null)
  const searchLoading = ref(false)
  const usedDevCoords = ref(false)

  const loading = computed(() => geoLoading.value || searchLoading.value)
  const error = computed(() => geoError.value || apiError.value)

  function clearError() {
    apiError.value = null
  }

  function getDevCoords(): { lat: number; lon: number } | null {
    const lat = import.meta.env.VITE_DEV_LAT
    const lon = import.meta.env.VITE_DEV_LON
    if (lat == null || lon == null) return null
    const latN = parseFloat(lat)
    const lonN = parseFloat(lon)
    if (Number.isNaN(latN) || Number.isNaN(lonN)) return null
    if (latN < -90 || latN > 90 || lonN < -180 || lonN > 180) return null
    return { lat: latN, lon: lonN }
  }

  async function loadByGeolocation() {
    apiError.value = null
    const devCoords = getDevCoords()
    const pos =(await getCurrentPosition()) ?? devCoords

    console.log(pos.lat,pos.lon);

    if (!pos) return
    usedDevCoords.value = devCoords !== null
    try {
      searchLoading.value = true
      const data = await fetchWeatherByCoords(pos.lat, pos.lon)
      weather.value = toWeatherDisplay(data)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Ошибка сети или API'
      if (msg.includes('VITE_OPENWEATHER_API_KEY')) {
        apiError.value = 'Добавьте VITE_OPENWEATHER_API_KEY в файл .env'
      } else {
        apiError.value = msg
      }
    } finally {
      searchLoading.value = false
    }
  }

  async function loadByCoords(lat: number, lon: number) {
    console.log(lat,lon);
    
    apiError.value = null
    usedDevCoords.value = false
    try {
      searchLoading.value = true
      const data = await fetchWeatherByCoords(lat, lon)
      weather.value = toWeatherDisplay(data)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Ошибка сети или API'
      if (msg.includes('VITE_OPENWEATHER_API_KEY')) {
        apiError.value = 'Добавьте VITE_OPENWEATHER_API_KEY в файл .env'
      } else {
        apiError.value = msg
      }
    } finally {
      searchLoading.value = false
    }
  }

  async function searchByCity(query: string) {
    if (!query.trim()) return
    apiError.value = null
    usedDevCoords.value = false
    try {
      searchLoading.value = true
      const data = await fetchWeatherByCity(query)
      weather.value = toWeatherDisplay(data)
    } catch (e: unknown) {
      const err = e as { response?: { status: number; data?: { message?: string } } }
      if (err.response?.status === 404) {
        apiError.value = 'Город не найден'
      } else if (err.response?.data?.message) {
        apiError.value = err.response.data.message
      } else {
        const msg = e instanceof Error ? e.message : 'Ошибка сети или API'
        if (msg.includes('VITE_OPENWEATHER_API_KEY')) {
          apiError.value = 'Добавьте VITE_OPENWEATHER_API_KEY в файл .env'
        } else {
          apiError.value = msg
        }
      }
    } finally {
      searchLoading.value = false
    }
  }

  return {
    weather,
    loading,
    error,
    usedDevCoords,
    clearError,
    loadByGeolocation,
    loadByCoords,
    searchByCity,
  }
}
