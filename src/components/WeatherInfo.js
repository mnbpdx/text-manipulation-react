import React, { useState } from 'react';
import { getWeatherInfo } from '../api/weatherApi';

const WeatherInfo = () => {
  const [query, setQuery] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      const data = await getWeatherInfo(query);
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError(`Failed to fetch weather information: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderWeatherData = (data) => {
    if (!data || !data.response) return null;

    return (
      <div className="bg-blue-100 p-4 rounded-lg shadow">
        <p className="text-gray-700 leading-relaxed">{data.response}</p>
      </div>
    );
  };

  return (
    <div className="weather-info mt-8 p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Weather Information</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your weather query"
          className="w-full p-2 border rounded"
        />
        <button 
          type="submit" 
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Get Weather'}
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {weatherData && renderWeatherData(weatherData)}
    </div>
  );
};

export default WeatherInfo;
