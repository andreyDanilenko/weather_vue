import { ref } from 'vue'

export interface GeoPosition {
  lat: number
  lon: number
}

export function useGeolocation() {
  const position = ref<GeoPosition | null>(null)
  const error = ref<string | null>(null)
  const loading = ref(false)

  function getCurrentPosition(): Promise<GeoPosition | null> {
    loading.value = true
    error.value = null
    position.value = null

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        error.value = 'Геолокация не поддерживается браузером'
        loading.value = false
        resolve(null)
        return
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          position.value = { lat: pos.coords.latitude, lon: pos.coords.longitude }
          loading.value = false
          resolve(position.value)
        },
        (err) => {
          switch (err.code) {
            case err.PERMISSION_DENIED:
              error.value = 'Доступ к геолокации запрещён'
              break
            case err.POSITION_UNAVAILABLE:
              error.value = 'Местоположение пока недоступно (система может повторить попытку). Попробуйте ещё раз или введите город.'
              break
            case err.TIMEOUT:
              error.value = 'Таймаут запроса геолокации'
              break
            default:
              error.value = 'Ошибка определения местоположения'
          }
          loading.value = false
          resolve(null)
        },
        { timeout: 10000, maximumAge: 300000 }
      )
    })
  }

  return { position, error, loading, getCurrentPosition }
}
