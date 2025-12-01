/**
 * QWeather (和风天气) API Integration
 * API Documentation: https://dev.qweather.com/docs/api/
 */

import { getCityId } from './cityData.js';

const QWEATHER_API_KEY = import.meta.env.VITE_QWEATHER_API_KEY;
// API Host: custom host or default (devapi/api)
const CUSTOM_HOST = import.meta.env.VITE_QWEATHER_CUSTOM_HOST;
const API_TYPE = import.meta.env.VITE_QWEATHER_API_TYPE || 'devapi';
const GEO_API_BASE = 'https://geoapi.qweather.com/v2/city';
const WEATHER_API_BASE = CUSTOM_HOST 
  ? `https://${CUSTOM_HOST}/v7/weather`
  : `https://${API_TYPE}.qweather.com/v7/weather`;

/**
 * Get user's location using browser geolocation API
 * @returns {Promise<Object>} - { latitude, longitude }
 */
export async function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        timeout: 10000,
        maximumAge: 300000, // Cache for 5 minutes
      }
    );
  });
}

/**
 * Get city name from coordinates using reverse geocoding
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {Promise<Object>} - City info
 */
export async function getCityFromCoordinates(latitude, longitude) {
  if (!QWEATHER_API_KEY) {
    throw new Error('QWeather API Key is not configured');
  }

  try {
    const url = `${GEO_API_BASE}/lookup?location=${longitude},${latitude}&key=${QWEATHER_API_KEY}&lang=zh`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code === '200' && data.location && data.location.length > 0) {
      // Return the closest city
      return {
        id: data.location[0].id,
        name: data.location[0].name,
        country: data.location[0].country,
        adm1: data.location[0].adm1,
        adm2: data.location[0].adm2,
      };
    } else {
      throw new Error('No city found for coordinates');
    }
  } catch (error) {
    console.error('Error getting city from coordinates:', error);
    throw error;
  }
}

/**
 * Get user's city automatically
 * @returns {Promise<string>} - City name
 */
export async function getUserCity() {
  try {
    console.log('📍 正在获取浏览器位置权限...');
    const coords = await getUserLocation();
    console.log('✓ 获取到坐标:', coords);
    
    console.log('🌍 正在查询城市名称...');
    const city = await getCityFromCoordinates(coords.latitude, coords.longitude);
    console.log('✓ 查询到城市:', city.name);
    
    return city.name;
  } catch (error) {
    console.warn('❌ 自动定位失败:', error.message);
    throw error;
  }
}

/**
 * Search city by name and get location ID
 * @param {string} cityName - City name in Chinese or English
 * @returns {Promise<Object>} - Location info with id, name, country, etc.
 */
export async function searchCity(cityName) {
  if (!QWEATHER_API_KEY) {
    throw new Error('QWeather API Key is not configured. Please set VITE_QWEATHER_API_KEY in .env.local');
  }

  try {
    const url = `${GEO_API_BASE}/lookup?location=${encodeURIComponent(cityName)}&key=${QWEATHER_API_KEY}&lang=zh`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code === '200' && data.location && data.location.length > 0) {
      // Return the first match
      return {
        id: data.location[0].id,
        name: data.location[0].name,
        country: data.location[0].country,
        adm1: data.location[0].adm1, // Province/State
        adm2: data.location[0].adm2, // City
      };
    } else {
      throw new Error(`City not found: ${cityName}`);
    }
  } catch (error) {
    console.error('Error searching city:', error);
    throw error;
  }
}

/**
 * Get current weather (实时天气)
 * @param {string} locationId - Location ID from searchCity
 * @returns {Promise<Object>} - Current weather data
 */
export async function getCurrentWeather(locationId) {
  if (!QWEATHER_API_KEY) {
    throw new Error('QWeather API Key is not configured');
  }

  try {
    const url = `${WEATHER_API_BASE}/now?location=${locationId}&key=${QWEATHER_API_KEY}&lang=zh`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code === '200' && data.now) {
      return {
        temp: data.now.temp,           // Temperature
        feelsLike: data.now.feelsLike, // Feels like temperature
        text: data.now.text,           // Weather condition text
        icon: data.now.icon,           // Weather icon code
        humidity: data.now.humidity,   // Humidity %
        windDir: data.now.windDir,     // Wind direction
        windScale: data.now.windScale, // Wind scale
        windSpeed: data.now.windSpeed, // Wind speed km/h
        pressure: data.now.pressure,   // Atmospheric pressure
        updateTime: data.updateTime,   // Last update time
      };
    } else {
      throw new Error(`Failed to get weather: ${data.code}`);
    }
  } catch (error) {
    console.error('Error getting current weather:', error);
    throw error;
  }
}

/**
 * Get 15-day weather forecast (15天预报)
 * @param {string} locationId - Location ID from searchCity
 * @returns {Promise<Array>} - Array of daily forecast data
 */
export async function getDailyForecast(locationId) {
  if (!QWEATHER_API_KEY) {
    throw new Error('QWeather API Key is not configured');
  }

  try {
    const url = `${WEATHER_API_BASE}/15d?location=${locationId}&key=${QWEATHER_API_KEY}&lang=zh`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code === '200' && data.daily) {
      return data.daily.map(day => ({
        date: day.fxDate,              // Forecast date (YYYY-MM-DD)
        tempMax: day.tempMax,          // Max temperature
        tempMin: day.tempMin,          // Min temperature
        textDay: day.textDay,          // Daytime weather condition
        textNight: day.textNight,      // Nighttime weather condition
        iconDay: day.iconDay,          // Daytime icon code
        iconNight: day.iconNight,      // Nighttime icon code
        windDirDay: day.windDirDay,    // Daytime wind direction
        windScaleDay: day.windScaleDay,// Daytime wind scale
        humidity: day.humidity,        // Relative humidity %
        precip: day.precip,            // Precipitation mm
        uvIndex: day.uvIndex,          // UV index
        sunrise: day.sunrise,          // Sunrise time
        sunset: day.sunset,            // Sunset time
      }));
    } else {
      throw new Error(`Failed to get forecast: ${data.code}`);
    }
  } catch (error) {
    console.error('Error getting daily forecast:', error);
    throw error;
  }
}

/**
 * Get 24-hour hourly forecast (24小时逐小时预报)
 * @param {string} locationId - Location ID from searchCity
 * @returns {Promise<Array>} - Array of hourly forecast data
 */
export async function getHourlyForecast(locationId) {
  if (!QWEATHER_API_KEY) {
    throw new Error('QWeather API Key is not configured');
  }

  try {
    const url = `${WEATHER_API_BASE}/24h?location=${locationId}&key=${QWEATHER_API_KEY}&lang=zh`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code === '200' && data.hourly) {
      return data.hourly.map(hour => ({
        time: hour.fxTime,             // Forecast time (ISO 8601)
        temp: hour.temp,               // Temperature
        text: hour.text,               // Weather condition
        icon: hour.icon,               // Icon code
        windDir: hour.windDir,         // Wind direction
        windScale: hour.windScale,     // Wind scale
        humidity: hour.humidity,       // Humidity %
        pop: hour.pop,                 // Probability of precipitation %
        precip: hour.precip,           // Precipitation mm
      }));
    } else {
      throw new Error(`Failed to get hourly forecast: ${data.code}`);
    }
  } catch (error) {
    console.error('Error getting hourly forecast:', error);
    throw error;
  }
}

/**
 * Get all weather data for a city
 * @param {string} cityName - City name
 * @returns {Promise<Object>} - Combined weather data
 */
export async function getWeatherData(cityName) {
  try {
    // Get location ID from city name
    const location = getCityId(cityName);
    
    // Fetch all weather data in parallel
    const [current, daily, hourly] = await Promise.all([
      getCurrentWeather(location),
      getDailyForecast(location),
      getHourlyForecast(location),
    ]);
    
    return {
      location: {
        name: cityName,
        adm1: '',
        adm2: '',
      },
      current,
      daily,
      hourly,
    };
  } catch (error) {
    console.error('Error getting weather data:', error);
    throw error;
  }
}

