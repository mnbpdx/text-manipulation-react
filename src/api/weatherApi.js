const BASE_URL = 'http://localhost:5000';

export const getWeatherInfo = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/weather`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Weather information:', data);
    return data;
  } catch (error) {
    console.error('Error fetching weather information:', error);
    throw error;
  }

};
