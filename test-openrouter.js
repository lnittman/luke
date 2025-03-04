// Simple test for OpenRouter API
const axios = require('axios');

async function testOpenRouter() {
  const apiKey = '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';
  
  console.log('Testing OpenRouter API key:');
  console.log(`Key starts with: ${apiKey.substring(0, 12)}...`);
  
  try {
    // Test auth endpoint
    console.log('\nTesting auth endpoint:');
    const authResponse = await axios.post(
      'https://openrouter.ai/api/v1/auth/key',
      {},
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Auth response:', authResponse.data);
  } catch (authError) {
    console.error('Auth error:', authError.response?.data || authError.message);
  }
  
  try {
    // Test completions endpoint
    console.log('\nTesting completions endpoint:');
    const completionsResponse = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'anthropic/claude-3-haiku',
        messages: [
          { role: 'user', content: 'Hello, how are you?' }
        ],
        max_tokens: 50
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://luke-portfolio.vercel.app',
          'X-Title': 'Luke App Test'
        }
      }
    );
    
    console.log('Completions response:', completionsResponse.data);
  } catch (completionsError) {
    console.error('Completions error:', completionsError.response?.data || completionsError.message);
  }
}

testOpenRouter().catch(e => console.error('Unhandled error:', e)); 