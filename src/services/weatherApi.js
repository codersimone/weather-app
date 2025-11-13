const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Получить текущую погоду по названию города
 * @param {string} cityName - Название города
 * @returns {Promise<Object>} Данные о погоде
 */
export async function getCurrentWeather(cityName) {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=ru`,
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Город не найден');
      }
      if (response.status === 401) {
        throw new Error('Неверный API ключ');
      }
      throw new Error('Ошибка при получении данных');
    }

    const data = await response.json();

    // Преобразуем данные API в удобный формат
    return {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      condition: data.weather[0].description,
      conditionCode: data.weather[0].main, // Clear, Clouds, Rain, etc.
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // м/с в км/ч
      pressure: data.main.pressure,
      visibility: Math.round(data.visibility / 1000), // метры в км
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
    };
  } catch (error) {
    console.error('Ошибка в getCurrentWeather:', error);
    throw error;
  }
}

/**
 * Получить прогноз погоды на 5 дней
 * @param {string} cityName - Название города
 * @returns {Promise<Array>} Массив прогнозов
 */
export async function getForecast(cityName) {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${cityName}&appid=${API_KEY}&units=metric&lang=ru`,
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Город не найден');
      }
      throw new Error('Ошибка при получении прогноза');
    }

    const data = await response.json();

    // Группируем прогнозы по дням
    const dailyForecasts = {};

    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toLocaleDateString('ru-RU');

      if (!dailyForecasts[dateKey]) {
        dailyForecasts[dateKey] = {
          date: dateKey,
          temps: [],
          conditions: [],
          icons: [],
        };
      }

      dailyForecasts[dateKey].temps.push(item.main.temp);
      dailyForecasts[dateKey].conditions.push(item.weather[0].description);
      dailyForecasts[dateKey].icons.push(item.weather[0].icon);
    });

    // Преобразуем в массив с агрегированными данными
    return Object.values(dailyForecasts)
      .slice(0, 7)
      .map(day => ({
        date: day.date,
        maxTemp: Math.round(Math.max(...day.temps)),
        minTemp: Math.round(Math.min(...day.temps)),
        condition: day.conditions[0], // Берем первое условие дня
        icon: day.icons[0],
      }));
  } catch (error) {
    console.error('Ошибка в getForecast:', error);
    throw error;
  }
}

/**
 * Получить погоду по координатам
 * @param {number} lat - Широта
 * @param {number} lon - Долгота
 * @returns {Promise<Object>} Данные о погоде
 */
export async function getWeatherByCoords(lat, lon) {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ru`,
    );

    if (!response.ok) {
      throw new Error('Ошибка при получении данных по координатам');
    }

    const data = await response.json();

    return {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      condition: data.weather[0].description,
      conditionCode: data.weather[0].main,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6),
      pressure: data.main.pressure,
      visibility: Math.round(data.visibility / 1000),
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
    };
  } catch (error) {
    console.error('Ошибка в getWeatherByCoords:', error);
    throw error;
  }
}

/**
 * Получить текущее местоположение пользователя
 * @returns {Promise<Object>} Погода по текущему местоположению
 */
export async function getWeatherByLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Геолокация не поддерживается'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async position => {
        try {
          const weather = await getWeatherByCoords(
            position.coords.latitude,
            position.coords.longitude,
          );
          resolve(weather);
        } catch (error) {
          reject(error);
        }
      },
      error => {
        reject(new Error('Не удалось получить местоположение'), error);
      },
    );
  });
}

/**
 * Получить URL иконки погоды
 * @param {string} iconCode - Код иконки из API
 * @returns {string} URL иконки
 */
export function getWeatherIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}
