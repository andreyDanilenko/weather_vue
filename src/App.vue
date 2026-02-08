<template>
  <el-config-provider :locale="locale">
    <div class="app">
      <WeatherPage />
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import ru from 'element-plus/es/locale/lang/ru'
import WeatherPage from '@/pages/WeatherPage.vue'

const locale = ru
</script>

<style>
.app {
  min-height: 100vh;
  background: lightblue;
  padding: 1rem;
  box-sizing: border-box;
}
</style>
