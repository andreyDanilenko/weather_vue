import { ref, computed } from 'vue'
import { fetchWeatherByCoords, fetchWeatherByCity } from '@/shared/api/weather-api'
import { getDevCoords, toApiError } from '@/shared/lib'
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

  async function loadByCoords(lat: number, lon: number) {
    apiError.value = null
    usedDevCoords.value = false
    try {
      searchLoading.value = true
      const data = await fetchWeatherByCoords(lat, lon)
      weather.value = toWeatherDisplay(data)
    } catch (e) {
      apiError.value = toApiError(e)
    } finally {
      searchLoading.value = false
    }
  }

  async function loadByGeolocation() {
    apiError.value = null
    const devCoords = getDevCoords()
    const pos = (await getCurrentPosition()) ?? devCoords
    if (!pos) return
    await loadByCoords(pos.lat, pos.lon)
    usedDevCoords.value = devCoords !== null && pos === devCoords
  }

  async function searchByCity(query: string) {
    if (!query.trim()) return
    apiError.value = null
    usedDevCoords.value = false
    try {
      searchLoading.value = true
      const data = await fetchWeatherByCity(query)
      weather.value = toWeatherDisplay(data)
    } catch (e) {
      const err = e as { response?: { status: number; data?: { message?: string } } }
      apiError.value = err.response?.status === 404 ? 'Город не найден' : toApiError(e)
    } finally {
      searchLoading.value = false
    }
  }

  return {
    weather,
    loading,
    error,
    usedDevCoords,
    clearError: () => { apiError.value = null },
    loadByGeolocation,
    loadByCoords,
    searchByCity,
  }
}
