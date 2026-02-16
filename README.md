


# test_vue — weather (OpenWeatherMap) [RU](https://github.com/andreyDanilenko/weather_vue/blob/main/README.ru.md)
[DEMO](https://ephemeral-gumdrop-74504d.netlify.app/)

Test application: Vue 3 (Composition API), TypeScript, Vite, Axios, Element Plus, OpenWeatherMap API.

## Requirements
- Node.js 18+
- Free OpenWeatherMap API key

## Installation
```bash
cd test_vue
npm install
```

Create a `.env` file in the project root and add your key:
```
VITE_OPENWEATHER_API_KEY=your_key
```
You can get the key after registering at [openweathermap.org](https://openweathermap.org).

For development on localhost (when geolocation is unavailable) you can set test coordinates — then the "My location" button will use them instead of real geolocation:
```
VITE_DEV_LAT=55.7558
VITE_DEV_LON=37.6173
```
After changing `.env`, restart `npm run dev`.

## Run
```bash
npm run dev
```
The application will open at http://localhost:5173.

## Build
```bash
npm run build
```
Production build in the `dist` folder. Type checking: `npm run type-check`.

## Features
- Location detection on load and weather display for that location
- Current weather display: temperature, icon, description, humidity, wind speed
- City search by name
- Error handling: geolocation, API, network
- Loading indicator during requests
- Responsive layout

## Stack
- Vue 3 (Composition API)
- TypeScript
- Vite
- Axios
- Element Plus
- OpenWeatherMap API (endpoint https://api.openweathermap.org/data/2.5/weather)

## Project structure
```
src/
  entities/weather/    types and API response mapping
  features/weather/    geolocation, weather loading, city search
  pages/               weather page
  shared/api/          OpenWeatherMap request client
  styles/              global styles
```
