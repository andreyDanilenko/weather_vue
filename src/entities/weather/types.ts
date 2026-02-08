export interface GeoLocationItem {
  name: string
  lat: number
  lon: number
  country: string
}

export interface OpenWeatherMain {
  temp: number
  humidity: number
}

export interface OpenWeatherWeather {
  id: number
  main: string
  description: string
  icon: string
}

export interface OpenWeatherWind {
  speed: number
}

export interface OpenWeatherResponse {
  name: string
  main: OpenWeatherMain
  weather: OpenWeatherWeather[]
  wind: OpenWeatherWind
}

export interface WeatherDisplay {
  city: string
  temp: number
  description: string
  icon: string
  humidity: number
  windSpeed: number
}

export function toWeatherDisplay(data: OpenWeatherResponse): WeatherDisplay {
  const w = data.weather[0]
  return {
    city: data.name,
    temp: Math.round(data.main.temp),
    description: w.description,
    icon: w.icon,
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 10) / 10,
  }
}
