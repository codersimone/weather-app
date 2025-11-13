import { useState } from 'react';
import { getCurrentWeather, getForecast, getWeatherByLocation } from './services/weatherApi';

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchWeather = async cityName => {
    setLoading(true);
    setError('');

    try {
      const weatherData = await getCurrentWeather(cityName);
      setWeather(weatherData);

      const forecastData = await getForecast(cityName);
      setForecast(forecastData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getMyLocationWeather = async () => {
    setLoading(true);
    setError('');

    try {
      const weatherData = await getWeatherByLocation();
      setWeather(weatherData);

      const forecastData = await getForecast(weatherData.city);
      setForecast(forecastData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => searchWeather('Москва')}>Погода в Москве</button>
      <button onClick={getMyLocationWeather}>Моя геолокация</button>

      {loading && <p>Загрузка...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {weather && (
        <div>
          <h2>
            {weather.city}, {weather.country}
          </h2>
          <p>Температура: {weather.temperature}°C</p>
          <p>Ощущается как: {weather.feelsLike}°C</p>
          <p>Условия: {weather.condition}</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.condition}
          />
        </div>
      )}

      {forecast.length > 0 && (
        <div>
          <h3>Прогноз на неделю:</h3>
          {forecast.map((day, index) => (
            <div key={index}>
              <p>
                {day.date}: {day.minTemp}°C - {day.maxTemp}°C
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
