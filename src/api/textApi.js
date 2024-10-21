const BASE_URL = 'http://localhost:5000';

export const summarizeText = async (text) => {
  console.log('Attempting to summarize text:', text);
  console.log('Text length:', text.length);
  console.log('Text type:', typeof text);
  try {
    console.log('Sending request to summarize text...');
    const response = await fetch(`${BASE_URL}/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    console.log('Summarization response received:', response);
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
        console.log('hit an error')
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    console.log('Parsing response data...');
    const data = await response.json();
    console.log('Text summary:', data);
    console.log('Summary length:', data.summary.length);
    return data;
  } catch (error) {
    console.error('Error summarizing text:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    throw error;
  }
};