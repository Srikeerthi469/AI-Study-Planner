// StudyTips.jsx
// Displays a single random study tip in a premium glassmorphism card.
// Currently uses a static array of tips - structured so it can be
// swapped for a Gemini AI API call later without changing the UI.

import { useState, useEffect } from 'react'

// Static tip pool for now.
// TODO (future): Replace this static array with a Gemini AI generated tip.
const tips = [
  'Study for 50 minutes and take a 10-minute break.',
  "Revise today's topics before sleeping.",
  'Practice active recall instead of passive reading.',
  'Solve at least 10 practice questions after each topic.',
  'Stay hydrated while studying.',
  'Review difficult topics every weekend.',
]

function StudyTips() {
  // Holds the randomly chosen tip for this page load
  const [currentTip, setCurrentTip] = useState('')

  // Pick one random tip only once, when the component first mounts.
  // It will stay the same until the page is refreshed (empty dependency array).
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * tips.length)
    setCurrentTip(tips[randomIndex])
  }, [])

  // Don't render anything until a tip has been selected
  if (!currentTip) return null

  return (
    <div className="relative max-w-2xl mx-auto mb-8 overflow-hidden rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg shadow-indigo-100 p-6 sm:p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Glowing accent blob - purely decorative */}
      <div className="absolute -top-8 -left-8 w-32 h-32 bg-indigo-300/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-300/30 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top gradient accent bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

      <div className="relative z-10">
        {/* Card heading */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">💡</span>
          <h3 className="text-base sm:text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Today's AI Study Tip
          </h3>
        </div>

        {/* The randomly selected tip */}
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
          {currentTip}
        </p>
      </div>
    </div>
  )
}

export default StudyTips