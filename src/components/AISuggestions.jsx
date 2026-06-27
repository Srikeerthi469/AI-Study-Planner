// AISuggestions.jsx
// Premium glassmorphism card that fetches and displays personalized
// AI study recommendations from Gemini. Handles loading, error, and
// regenerate states. Talks only to geminiService.js (never the SDK directly).

import { useState, useEffect, useCallback } from 'react'
import { getStudySuggestions } from '../services/geminiService.js'

// Receives plan, subject, examDate, dailyHours as props - everything needed
// to build the AI prompt, mirroring what's already used elsewhere (PDFExport, etc.)
function AISuggestions({ plan, subject, examDate, dailyHours }) {
  // suggestions: the raw text response from Gemini (split into bullet lines for display)
  const [suggestions, setSuggestions] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Fetches suggestions from Gemini - wrapped in useCallback so it can be
  // safely reused both on mount and when the "Regenerate" button is clicked
  const fetchSuggestions = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const result = await getStudySuggestions({ subject, examDate, dailyHours, plan })
      setSuggestions(result)
    } catch (error) {
      // Log full error for debugging, but show a friendly message to the user
      console.error('Gemini AI suggestion error:', error)
      setErrorMessage('Unable to generate AI suggestions. Please try again.')
      setSuggestions('')
    } finally {
      setIsLoading(false)
    }
  }, [plan, subject, examDate, dailyHours])

  // Automatically fetch suggestions once, when the component first mounts
  // (i.e. right after a study plan is generated)
  useEffect(() => {
    fetchSuggestions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Splits the raw AI text response into individual bullet lines for rendering.
  // Filters out empty lines and strips any leading bullet characters Gemini may add,
  // since we apply our own bullet styling in JSX.
  const bulletLines = suggestions
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  return (
    <div className="relative max-w-3xl mx-auto mb-8 overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg shadow-indigo-100 p-6 sm:p-8">
      {/* Decorative glow blobs - purely visual, matches the rest of the app's style */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-300/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-300/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🤖</span>
          <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            AI Study Mentor
          </h3>
        </div>
        <p className="text-sm font-medium text-gray-500 mb-5">
          ✨ Personalized Recommendations
        </p>

        {/* ---- Loading state: animated skeleton loaders ---- */}
        {isLoading && (
          <div className="space-y-3">
            <p className="text-sm text-indigo-600 font-medium mb-3 animate-pulse">
              Analyzing your study plan...
            </p>
            {[1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full animate-pulse"
                style={{ width: `${90 - index * 8}%` }}
              ></div>
            ))}
          </div>
        )}

        {/* ---- Error state ---- */}
        {!isLoading && errorMessage && (
          <div className="text-center py-4">
            <p className="text-red-500 font-medium mb-4">{errorMessage}</p>
            <button
              onClick={fetchSuggestions}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
            >
              Retry
            </button>
          </div>
        )}

        {/* ---- Success state: render bullet points ---- */}
        {!isLoading && !errorMessage && bulletLines.length > 0 && (
          <div className="space-y-2.5">
            {bulletLines.map((line, index) => (
              <p
                key={index}
                className="text-sm sm:text-base text-gray-700 leading-relaxed flex items-start gap-2"
              >
                <span className="text-indigo-500 mt-0.5">•</span>
                <span>{line.replace(/^[•\-*]\s*/, '')}</span>
              </p>
            ))}
          </div>
        )}

        {/* ---- Footer: regenerate button + attribution ---- */}
        {!isLoading && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200/60">
            <button
              onClick={fetchSuggestions}
              className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <span>🔄</span>
              <span>Generate New Suggestions</span>
            </button>

            <p className="text-xs text-gray-400 italic">Generated by Gemini AI</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AISuggestions