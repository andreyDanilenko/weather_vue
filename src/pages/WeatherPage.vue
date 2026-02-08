<template>
  <div class="weather-page">
    <el-card class="weather-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>Погода</span>
          <el-button
            type="primary"
            :loading="loading"
            :disabled="!hasApiKey"
            @click="loadByGeolocation"
          >
            Моё местоположение
          </el-button>
        </div>
      </template>

      <div class="search-row">
        <el-autocomplete
          v-model="searchQuery"
          placeholder="Введите город"
          :fetch-suggestions="querySuggestions"
          :disabled="loading || !hasApiKey"
          value-key="value"
          clearable
          @select="onSelectSuggestion"
          @keyup.enter="onSearch"
        />
        <el-button type="primary" :loading="loading" :disabled="!hasApiKey" @click="onSearch">
          Найти
        </el-button>
      </div>

      <el-alert
        v-if="error"
        type="error"
        :title="error"
        show-icon
        closable
        class="error-alert"
        @close="clearError"
      />

      <el-alert
        v-if="!hasApiKey"
        type="warning"
        title="Добавьте VITE_OPENWEATHER_API_KEY в файл .env"
        show-icon
        class="error-alert"
      />

      <el-skeleton v-if="loading && !weather" :rows="5" animated />

      <div v-else-if="weather" class="weather-content">
        <el-alert
          v-if="usedDevCoords"
          type="info"
          title="Геолокация не определена. Загружена погода по координатам из .env (тестовый режим)."
          show-icon
          class="default-location-alert"
        />
        <div class="weather-main">
          <img
            :src="iconUrl"
            :alt="weather.description"
            class="weather-icon"
          >
          <div class="temp-block">
            <span class="temp">{{ weather.temp }}°C</span>
            <span class="city">{{ weather.city }}</span>
            <span class="description">{{ weather.description }}</span>
          </div>
        </div>
        <el-descriptions :column="1" border class="weather-details">
          <el-descriptions-item label="Влажность">{{ weather.humidity }}%</el-descriptions-item>
          <el-descriptions-item label="Ветер">{{ weather.windSpeed }} м/с</el-descriptions-item>
        </el-descriptions>
      </div>

      <div v-else-if="!loading && !error && hasApiKey" class="empty-state">
        Нажмите «Моё местоположение» или введите город для поиска
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWeather } from '@/features/weather'
import { fetchCitySuggestions } from '@/shared/api/weather-api'
import type { GeoLocationItem } from '@/entities/weather'

const { weather, loading, error, usedDevCoords, clearError, loadByGeolocation, loadByCoords, searchByCity } = useWeather()
const searchQuery = ref('')
let suggestDebounce: ReturnType<typeof setTimeout> | null = null

const hasApiKey = computed(() => !!import.meta.env.VITE_OPENWEATHER_API_KEY)

const iconUrl = computed(() => {
  if (!weather.value) return ''
  return `https://openweathermap.org/img/wn/${weather.value.icon}@2x.png`
})

interface SuggestionItem {
  value: string
  lat: number
  lon: number
}

function querySuggestions(query: string, callback: (items: SuggestionItem[]) => void) {
  if (suggestDebounce) clearTimeout(suggestDebounce)
  if (!query.trim()) {
    callback([])
    return
  }
  suggestDebounce = setTimeout(async () => {
    try {
      const list = await fetchCitySuggestions(query, 5)
      const items: SuggestionItem[] = list.map((c: GeoLocationItem) => ({
        value: `${c.name}, ${c.country}`,
        lat: c.lat,
        lon: c.lon,
      }))
      callback(items)
    } catch {
      callback([])
    } finally {
      suggestDebounce = null
    }
  }, 300)
}

function onSelectSuggestion(item: SuggestionItem) {
  loadByCoords(item.lat, item.lon)
  searchQuery.value = item.value
}

function onSearch() {
  searchByCity(searchQuery.value)
}

</script>

<style scoped>
.weather-page {
  max-width: 480px;
  margin: 0 auto;
  padding: 1rem 0;
}

.weather-card {
  border-radius: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.search-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.search-row .el-autocomplete,
.search-row .el-input {
  flex: 1;
  min-width: 0;
}

.error-alert {
  margin-bottom: 1rem;
}

.weather-content {
  margin-top: 1rem;
}

.weather-main {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.weather-icon {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.temp-block {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.temp {
  font-size: 2rem;
  font-weight: 700;
  color: #303133;
}

.city {
  font-size: 1.25rem;
  color: #606266;
}

.description {
  font-size: 0.9rem;
  color: #909399;
  text-transform: capitalize;
}

.weather-details {
  margin-top: 0.5rem;
}

.default-location-alert {
  margin-bottom: 1rem;
}

.empty-state {
  text-align: center;
  color: #909399;
  padding: 2rem 0;
}

@media (max-width: 480px) {
  .card-header {
    flex-direction: column;
    align-items: stretch;
  }

  .search-row {
    flex-direction: column;
  }
}
</style>
