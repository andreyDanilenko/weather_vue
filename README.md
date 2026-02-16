# test_vue — погода (OpenWeatherMap)

[DEMO](https://ephemeral-gumdrop-74504d.netlify.app/)

Тестовое приложение: Vue 3 (Composition API), TypeScript, Vite, Axios, Element Plus, OpenWeatherMap API.

## Требования

- Node.js 18+
- Бесплатный API-ключ [OpenWeatherMap](https://openweathermap.org/api)

## Установка

```bash
cd test_vue
npm install
```

Создайте файл `.env` в корне проекта и добавьте ключ:

```
VITE_OPENWEATHER_API_KEY=ваш_ключ
```

Ключ можно получить после регистрации на [openweathermap.org](https://openweathermap.org/).

Для разработки на localhost (когда геолокация недоступна) можно задать тестовые координаты — тогда кнопка «Моё местоположение» будет использовать их вместо реальной геолокации:

```
VITE_DEV_LAT=55.7558
VITE_DEV_LON=37.6173
```

После изменения `.env` перезапустите `npm run dev`.

## Запуск

```bash
npm run dev
```

Приложение откроется на `http://localhost:5173`.

## Сборка

```bash
npm run build
```

Продакшн-сборка в папку `dist`. Проверка типов: `npm run type-check`.

## Функционал

- Определение местоположения при загрузке и показ погоды по нему
- Отображение текущей погоды: температура, иконка, описание, влажность, скорость ветра
- Поиск города по названию
- Обработка ошибок: геолокация, API, сеть
- Индикатор загрузки при запросах
- Адаптивная вёрстка

## Стек

- Vue 3 (Composition API)
- TypeScript
- Vite
- Axios
- Element Plus
- OpenWeatherMap API (эндпоинт `https://api.openweathermap.org/data/2.5/weather`)

## Структура проекта

```
src/
  entities/weather/    типы и маппинг ответа API
  features/weather/    геолокация, загрузка погоды, поиск по городу
  pages/               страница погоды
  shared/api/          клиент запросов к OpenWeatherMap
  styles/              глобальные стили
```
