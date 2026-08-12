
const { genkit } = require('genkit');
const { googleAI } = require('@genkit-ai/googleai');

const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GEMINI_API_KEY })],
  model: 'googleai/gemini-3.6-flash',
});

ai.generate({
  prompt: 'Say hello in one word.'
}).then(response => {
  console.log("Gemini Response:", response.text);
}).catch(err => {
  console.error("Genkit Error:", err);
});
