import { useState, useEffect } from 'react'
import './Weather.css'
import { getMockWeatherData } from '../../utils/mockData'
import HourlyForecast from './HourlyForecast'

const Weather = () => {
  const [location, setLocation] = useState('北京')
  const [weatherData, setWeatherData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Implement real geolocation
    // Try to get user's location automatically
    loadWeatherData(location)
  }, [location])

  const loadWeatherData = async (city) => {
    setIsLoading(true)
    // Simulate API call delay
    setTimeout(() => {
      const data = getMockWeatherData(city)
      setWeatherData(data)
      setIsLoading(false)
    }, 500)
  }

  const handleLocationChange = (e) => {
    setLocation(e.target.value)
  }

  if (isLoading) {
    return (
      <div className="weather">
        <div className="loading">加载中...</div>
      </div>
    )
  }

  return (
    <div className="weather">
      <div className="weather-header">
        <h2 className="weather-title">天气预报</h2>
        <div className="location-selector">
          <label htmlFor="location">📍</label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={handleLocationChange}
            onBlur={() => loadWeatherData(location)}
            onKeyPress={(e) => e.key === 'Enter' && loadWeatherData(location)}
            placeholder="输入城市名称"
          />
        </div>
      </div>

      {/* Current weather card */}
      <div className="current-weather">
        <div className="current-weather-main">
          <div className="weather-icon">{weatherData.current.icon}</div>
          <div className="temperature-group">
            <div className="temperature">{weatherData.current.temperature}°C</div>
            <div className="temperature-range">
              {weatherData.current.low}° ~ {weatherData.current.high}°
            </div>
          </div>
        </div>
        <div className="current-weather-details">
          <div className="weather-condition">{weatherData.current.condition}</div>
          <div className="weather-meta">
            <div className="meta-item">
              <span className="meta-icon">💧</span>
              <span className="meta-label">湿度</span>
              <span className="meta-value">{weatherData.current.humidity}%</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">🌧️</span>
              <span className="meta-label">降雨</span>
              <span className="meta-value">{weatherData.current.rainProbability}%</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">💨</span>
              <span className="meta-label">风力</span>
              <span className="meta-value">{weatherData.current.wind}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 48-hour forecast */}
      {weatherData.hourly && <HourlyForecast hourlyData={weatherData.hourly} />}

      {/* 15-day forecast */}
      <div className="forecast-section">
        <h3 className="forecast-title">未来15天预报</h3>
        <div className="forecast-list">
          {weatherData.forecast.map((day, index) => (
            <div key={index} className="forecast-item">
              <div className="forecast-date">{day.date}</div>
              <div className="forecast-icon">{day.icon}</div>
              <div className="forecast-condition">{day.condition}</div>
              <div className="forecast-temp">
                <span className="temp-high">{day.high}°</span>
                <span className="temp-separator">/</span>
                <span className="temp-low">{day.low}°</span>
              </div>
              <div className="forecast-details">
                <div className="forecast-detail-item">
                  <span>💨 {day.wind}</span>
                </div>
                <div className="forecast-detail-item">
                  <span>🌧️ {day.rainProbability}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Weather

