// geminiService.js
// Service layer responsible for all communication with the Gemini API.
// Keeping this isolated means AISuggestions.jsx (and any future component)
// never talks to the SDK directly - it just calls getStudySuggestions().

import { GoogleGenerativeAI } from '@google/generative-ai'
import { buildStudyPrompt } from '../utils/aiPrompt.js'

// Read the API key from Vite's environment variables.
// NEVER hardcode the key here - it must come from .env (VITE_GEMINI_API_KEY).
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

// Model name as required by the project spec
const MODEL_NAME = 'gemini-2.5-flash'

// Lazily create the client only when needed, and only once per session.
// This avoids crashing the whole app at import-time if the key is missing.
let genAI = null
function getClient() {
  if (!API_KEY) {
    throw new Error(
      'Missing Gemini API key. Please set VITE_GEMINI_API_KEY in your .env file.'
    )
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(API_KEY)
  }
  return genAI
}

// Calls Gemini with the study plan details and returns the suggestion text.
// Throws an error if the call fails - the calling component is responsible
// for catching it and showing the error UI.
export async function getStudySuggestions({ subject, examDate, dailyHours, plan }) {
  const client = getClient()
  const model = client.getGenerativeModel({ model: MODEL_NAME })

  // Build the prompt text using the dedicated prompt builder
  const prompt = buildStudyPrompt({ subject, examDate, dailyHours, plan })

  // Call the Gemini API
  const result = await model.generateContent(prompt)
  const response = result.response
  const text = response.text()

  if (!text || text.trim().length === 0) {
    throw new Error('Gemini returned an empty response.')
  }

  return text.trim()
}